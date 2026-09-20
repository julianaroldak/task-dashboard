const savedLooksKey = "soft-power-90s-saved-looks";
const studioStorageKey = "soft-power-90s-content-studio";
const storyCategories = ["FORMULA", "LOOKS", "DETAILS", "UNDONE", "DAY", "NIGHT"];
const editorialSlides = [
  { id: "cover", title: "CHAPTER 01", emphasis: "THE FORMULA", text: "A record of the quiet decisions that make an outfit feel like yours." },
  { id: "instinct", title: "INSTINCT", text: "Begin with the piece you reach for without needing a reason. It already knows the way." },
  { id: "second-skin", title: "SECOND SKIN", text: "Keep the shape close enough to feel intentional, never tight enough to become a costume." },
  { id: "contrast", title: "CONTRAST", text: "Let something pale meet something dark. The tension gives the softness its definition." },
  { id: "texture", title: "TEXTURE", text: "Lace, rib, satin, denim: one surface catches the light so the rest can stay quiet." },
  { id: "the-line", title: "THE LINE", text: "A flare, a shoulder, a pointed toe. One clean line can carry the whole thought." },
  { id: "undone", title: "UNDONE", text: "Leave one thing uncorrected. The bend in the hair is often the part that makes it real." },
  { id: "repetition", title: "REPETITION", text: "Return to the shapes that keep returning to you. Personal style is recognition, not reinvention." },
  { id: "soft-power", title: "SOFT POWER", text: "There is strength in choosing ease, then wearing it with the certainty of a signature." },
  { id: "close", title: "A LAST NOTE", text: "I didn't invent a style. I noticed what I kept returning to." }
];

let savedLooks = loadSavedLooks();
let studio = loadStudio();
let activeSlideIndex = 0;
let touchStartX = null;

const emptyState = document.querySelector("#empty-state");
const studioContent = document.querySelector("#studio-content");
const carouselTrack = document.querySelector("#carousel-track");
const carouselIndicators = document.querySelector("#carousel-indicators");
const slidePosition = document.querySelector("#slide-position");
const instagramPlanner = document.querySelector("#instagram-planner");
const storiesPlanner = document.querySelector("#stories-planner");

function loadSavedLooks() {
  try {
    const looks = JSON.parse(localStorage.getItem(savedLooksKey) || "[]");
    return Array.isArray(looks) ? looks : [];
  } catch (error) {
    console.error("Could not load saved looks.", error);
    return [];
  }
}

function defaultStudio() {
  return {
    order: editorialSlides.map((slide) => slide.id),
    slides: Object.fromEntries(editorialSlides.map((slide) => [slide.id, { lookIndex: "", caption: "", alt: "", ready: false }])),
    stories: Object.fromEntries(storyCategories.map((category) => [category, { note: "", lookIndex: "" }]))
  };
}

function loadStudio() {
  const defaults = defaultStudio();
  try {
    const stored = JSON.parse(localStorage.getItem(studioStorageKey) || "null");
    if (!stored || typeof stored !== "object") return defaults;
    return {
      order: Array.isArray(stored.order) && stored.order.length === editorialSlides.length ? stored.order : defaults.order,
      slides: Object.fromEntries(editorialSlides.map((slide) => [slide.id, { ...defaults.slides[slide.id], ...stored.slides?.[slide.id] }])),
      stories: Object.fromEntries(storyCategories.map((category) => [category, { ...defaults.stories[category], ...stored.stories?.[category] }]))
    };
  } catch (error) {
    console.error("Could not load Content Studio.", error);
    return defaults;
  }
}

function persistStudio() {
  try {
    localStorage.setItem(studioStorageKey, JSON.stringify(studio));
  } catch (error) {
    console.error("Could not save Content Studio.", error);
  }
}

function lookName(index) {
  return `Look ${savedLooks.length - index}`;
}

function lookOptions(selectedIndex) {
  const options = ['<option value="">No saved look selected</option>'];
  savedLooks.forEach((look, index) => {
    options.push(`<option value="${index}" ${String(index) === String(selectedIndex) ? "selected" : ""}>${lookName(index)}</option>`);
  });
  return options.join("");
}

function slideFromId(id) {
  return editorialSlides.find((slide) => slide.id === id);
}

function renderCarousel() {
  carouselTrack.innerHTML = editorialSlides.map((slide, index) => {
    const state = studio.slides[slide.id];
    const title = slide.emphasis ? `${slide.title} <em>${slide.emphasis}</em>` : slide.title;
    return `<article class="editorial-slide" aria-hidden="${index !== activeSlideIndex}">
      <span class="slide-number">0${index + 1} / 10</span>
      <div class="slide-copy"><h3>${title}</h3><p>${slide.text}</p></div>
      <label class="slide-form"><span class="field-label">Saved look</span><select class="look-select" data-slide-look="${slide.id}">${lookOptions(state.lookIndex)}</select></label>
    </article>`;
  }).join("");
  carouselIndicators.innerHTML = editorialSlides.map((slide, index) => `<button class="indicator" type="button" data-slide-index="${index}" aria-label="Go to slide ${index + 1}" aria-current="${index === activeSlideIndex}"></button>`).join("");
  updateCarouselPosition();
}

function updateCarouselPosition() {
  carouselTrack.style.transform = `translateX(-${activeSlideIndex * 100}%)`;
  [...carouselTrack.children].forEach((slide, index) => slide.setAttribute("aria-hidden", String(index !== activeSlideIndex)));
  [...carouselIndicators.children].forEach((indicator, index) => indicator.setAttribute("aria-current", String(index === activeSlideIndex)));
  slidePosition.textContent = `Slide ${activeSlideIndex + 1} of ${editorialSlides.length}`;
}

function renderInstagramPlanner() {
  instagramPlanner.innerHTML = studio.order.map((id, index) => {
    const slide = slideFromId(id);
    const state = studio.slides[id];
    return `<li class="planner-item">
      <div class="planner-topline">
        <span class="planner-order">${String(index + 1).padStart(2, "0")}</span>
        <strong class="planner-title">${slide.title}${slide.emphasis ? ` — ${slide.emphasis}` : ""}</strong>
        <span class="move-controls">
          <button class="move-button" type="button" data-move-slide="${id}" data-direction="-1" aria-label="Move ${slide.title} up" ${index === 0 ? "disabled" : ""}>↑</button>
          <button class="move-button" type="button" data-move-slide="${id}" data-direction="1" aria-label="Move ${slide.title} down" ${index === studio.order.length - 1 ? "disabled" : ""}>↓</button>
        </span>
      </div>
      <div class="planner-fields">
        <label><span class="field-label">Saved look</span><select class="look-select" data-slide-look="${id}">${lookOptions(state.lookIndex)}</select></label>
        <label><span class="field-label">Caption</span><textarea class="planner-textarea" data-slide-caption="${id}" placeholder="A caption for this frame"></textarea></label>
        <label><span class="field-label">Alt text</span><textarea class="planner-textarea" data-slide-alt="${id}" placeholder="A clear description of this frame"></textarea></label>
        <label class="status-control"><input type="checkbox" data-slide-ready="${id}" ${state.ready ? "checked" : ""}> Ready</label>
      </div>
    </li>`;
  }).join("");
  studio.order.forEach((id) => {
    instagramPlanner.querySelector(`[data-slide-caption="${id}"]`).value = studio.slides[id].caption;
    instagramPlanner.querySelector(`[data-slide-alt="${id}"]`).value = studio.slides[id].alt;
  });
}

function renderStoriesPlanner() {
  storiesPlanner.innerHTML = storyCategories.map((category) => {
    const state = studio.stories[category];
    return `<article class="story-card">
      <h3>${category}</h3>
      <label><span class="field-label">Note</span><textarea class="planner-textarea story-note" data-story-note="${category}" placeholder="A small direction"></textarea></label>
      <label><span class="field-label">Saved look</span><select class="look-select" data-story-look="${category}">${lookOptions(state.lookIndex)}</select></label>
    </article>`;
  }).join("");
  storyCategories.forEach((category) => {
    storiesPlanner.querySelector(`[data-story-note="${category}"]`).value = studio.stories[category].note;
  });
}

function render() {
  savedLooks = loadSavedLooks();
  emptyState.hidden = savedLooks.length > 0;
  studioContent.hidden = savedLooks.length === 0;
  if (!savedLooks.length) return;
  renderCarousel();
  renderInstagramPlanner();
  renderStoriesPlanner();
}

function setSlideLook(slideId, lookIndex) {
  studio.slides[slideId].lookIndex = lookIndex;
  persistStudio();
  render();
}

document.querySelector("#previous-slide").addEventListener("click", () => {
  activeSlideIndex = (activeSlideIndex + editorialSlides.length - 1) % editorialSlides.length;
  updateCarouselPosition();
});
document.querySelector("#next-slide").addEventListener("click", () => {
  activeSlideIndex = (activeSlideIndex + 1) % editorialSlides.length;
  updateCarouselPosition();
});
carouselIndicators.addEventListener("click", (event) => {
  const button = event.target.closest("[data-slide-index]");
  if (!button) return;
  activeSlideIndex = Number(button.dataset.slideIndex);
  updateCarouselPosition();
});
carouselTrack.addEventListener("change", (event) => {
  const select = event.target.closest("[data-slide-look]");
  if (select) setSlideLook(select.dataset.slideLook, select.value);
});
carouselTrack.addEventListener("touchstart", (event) => {
  touchStartX = event.changedTouches[0].screenX;
}, { passive: true });
carouselTrack.addEventListener("touchend", (event) => {
  if (touchStartX === null) return;
  const difference = event.changedTouches[0].screenX - touchStartX;
  if (Math.abs(difference) > 40) {
    activeSlideIndex = (activeSlideIndex + (difference < 0 ? 1 : editorialSlides.length - 1)) % editorialSlides.length;
    updateCarouselPosition();
  }
  touchStartX = null;
}, { passive: true });
instagramPlanner.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches("[data-slide-look]")) setSlideLook(target.dataset.slideLook, target.value);
  if (target.matches("[data-slide-ready]")) {
    studio.slides[target.dataset.slideReady].ready = target.checked;
    persistStudio();
  }
});
instagramPlanner.addEventListener("input", (event) => {
  const target = event.target;
  if (target.matches("[data-slide-caption]")) studio.slides[target.dataset.slideCaption].caption = target.value;
  if (target.matches("[data-slide-alt]")) studio.slides[target.dataset.slideAlt].alt = target.value;
  if (target.matches("[data-slide-caption], [data-slide-alt]")) persistStudio();
});
instagramPlanner.addEventListener("click", (event) => {
  const button = event.target.closest("[data-move-slide]");
  if (!button) return;
  const index = studio.order.indexOf(button.dataset.moveSlide);
  const destination = index + Number(button.dataset.direction);
  [studio.order[index], studio.order[destination]] = [studio.order[destination], studio.order[index]];
  persistStudio();
  renderInstagramPlanner();
});
storiesPlanner.addEventListener("change", (event) => {
  const target = event.target;
  if (!target.matches("[data-story-look]")) return;
  studio.stories[target.dataset.storyLook].lookIndex = target.value;
  persistStudio();
});
storiesPlanner.addEventListener("input", (event) => {
  const target = event.target;
  if (!target.matches("[data-story-note]")) return;
  studio.stories[target.dataset.storyNote].note = target.value;
  persistStudio();
});

render();
