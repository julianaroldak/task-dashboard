const slots = Object.keys(slotLabels);
const storageKey = "soft-power-90s-saved-looks";
let activeCategory = "hair";
let currentLook = Object.fromEntries(slots.map((slot) => [slot, null]));
let savedLooks = loadSavedLooks();

const stage = document.querySelector("#outfit-stage");
const tabs = document.querySelector("#category-tabs");
const itemGrid = document.querySelector("#item-grid");
const formulaList = document.querySelector("#formula-list");
const formulaScore = document.querySelector("#formula-score");
const savedLooksContainer = document.querySelector("#saved-looks");
const savedCount = document.querySelector("#saved-count");
const pickerInstruction = document.querySelector("#picker-instruction");

function loadSavedLooks() {
  try {
    const storedLooks = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(storedLooks) ? storedLooks : [];
  } catch (error) {
    console.error("Could not load saved looks.", error);
    return [];
  }
}

function persistSavedLooks() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(savedLooks));
  } catch (error) {
    console.error("Could not save this look.", error);
  }
}

function itemFor(slot, itemId) {
  return wardrobe[slot].find((item) => item.id === itemId);
}

function selectedItems() {
  return slots.map((slot) => currentLook[slot]).filter(Boolean);
}

function hasTag(tag) {
  return selectedItems().some((item) => item.tags.includes(tag));
}

function renderStage() {
  stage.innerHTML = slots.map((slot) => {
    const item = currentLook[slot];
    return `
      <div class="stage-layer ${item ? "" : "is-empty"}">
        <div class="swatch" style="--swatch: ${item?.color || "#efe4d3"}"></div>
        <div class="layer-copy">
          <span class="layer-label">${slotLabels[slot]}</span>
          <span class="layer-name">${item?.name || "Nothing selected yet"}</span>
        </div>
      </div>`;
  }).join("");
}

function renderTabs() {
  tabs.innerHTML = slots.map((slot) => `
    <button class="category-tab" type="button" role="tab" aria-selected="${slot === activeCategory}" data-category="${slot}">
      ${slotLabels[slot]}
    </button>
  `).join("");
}

function renderItems() {
  pickerInstruction.textContent = `Choose a ${slotLabels[activeCategory].toLowerCase()} for this look.`;
  itemGrid.innerHTML = wardrobe[activeCategory].map((item) => `
    <button class="item-card ${currentLook[activeCategory]?.id === item.id ? "is-selected" : ""}" type="button" data-item-id="${item.id}">
      <span class="item-swatch" style="--swatch: ${item.color}"></span>
      <span class="item-copy">
        <span class="item-name">${item.name}</span>
        <span class="item-tags">${item.tags.map((tag) => `<span class="tag">${tag.replace("-", " ")}</span>`).join("")}</span>
      </span>
    </button>
  `).join("");
}

function formulaChecks() {
  const textureCount = selectedItems().filter((item) => item.tags.includes("lace") || item.tags.includes("satin")).length;
  const top = currentLook.top;
  const bottom = currentLook.bottom;
  const contrast = Boolean(top && bottom && ((top.tone === "light" && bottom.tone === "dark") || (top.tone === "dark" && bottom.tone === "light")));
  return [
    ["Fitted shape included", hasTag("fitted")],
    ["Flare piece included", hasTag("flare")],
    ["Exactly one lace or satin texture", textureCount === 1],
    ["Light-dark contrast in top and bottom", contrast],
    ["Undone or imperfect hair", hasTag("imperfect-hair")]
  ];
}

function renderFormula() {
  const checks = formulaChecks();
  const score = checks.filter(([, isMet]) => isMet).length;
  formulaScore.textContent = `${score}/5`;
  formulaList.innerHTML = checks.map(([label, isMet]) => `
    <li class="formula-item ${isMet ? "is-met" : ""}">
      <span class="formula-mark" aria-hidden="true">${isMet ? "&#10003;" : "&#10005;"}</span><span>${label}</span>
    </li>
  `).join("");
}

function renderSavedLooks() {
  savedCount.textContent = savedLooks.length ? `${savedLooks.length} saved` : "No looks saved yet";
  if (!savedLooks.length) {
    savedLooksContainer.innerHTML = `<div class="empty-saves">Your saved combinations will collect here. Build one that feels like you.</div>`;
    return;
  }
  savedLooksContainer.innerHTML = savedLooks.map((look, index) => {
    const pieces = slots.map((slot) => itemFor(slot, look[slot])).filter(Boolean);
    return `
      <article class="saved-look">
        <div class="saved-preview" aria-label="Saved look preview">
          ${slots.map((slot) => `<span style="--swatch: ${itemFor(slot, look[slot])?.color || "#eadfce"}"></span>`).join("")}
        </div>
        <div class="saved-copy">
          <strong>Look ${savedLooks.length - index}</strong>
          <button class="remove-button" type="button" data-remove-index="${index}" aria-label="Remove Look ${savedLooks.length - index}">Remove</button>
        </div>
      </article>`;
  }).join("");
}

function render() {
  renderStage();
  renderTabs();
  renderItems();
  renderFormula();
  renderSavedLooks();
}

tabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderTabs();
  renderItems();
});

itemGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-item-id]");
  if (!button) return;
  currentLook[activeCategory] = itemFor(activeCategory, button.dataset.itemId);
  render();
});

document.querySelector("#randomize-button").addEventListener("click", () => {
  currentLook = Object.fromEntries(slots.map((slot) => {
    const items = wardrobe[slot];
    return [slot, items[Math.floor(Math.random() * items.length)]];
  }));
  render();
});

document.querySelector("#reset-button").addEventListener("click", () => {
  currentLook = Object.fromEntries(slots.map((slot) => [slot, null]));
  render();
});

document.querySelector("#save-button").addEventListener("click", () => {
  if (!selectedItems().length) return;
  savedLooks.unshift(Object.fromEntries(slots.map((slot) => [slot, currentLook[slot]?.id || null])));
  persistSavedLooks();
  renderSavedLooks();
});

savedLooksContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-index]");
  if (!button) return;
  savedLooks.splice(Number(button.dataset.removeIndex), 1);
  persistSavedLooks();
  renderSavedLooks();
});

render();
