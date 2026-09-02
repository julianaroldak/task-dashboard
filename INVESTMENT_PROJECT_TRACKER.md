# 🏢 Investment Project Tracker - Implementation Guide

## Overview

This document describes the new **Investment Project Tracker** feature added to the Task Dashboard application. It enables comprehensive management of real estate investment projects like the **Beato Riverside Residences** project.

## Project Structure

### New Files Created

```
src/
├── context/
│   └── ProjectContext.jsx          # State management for projects
├── features/projects/
│   └── components/
│       ├── InvestmentProjectDashboard.jsx  # Main dashboard UI
│       ├── ProjectForm.jsx                 # Create/edit projects
│       ├── ProjectOverview.jsx            # Project details & specs
│       ├── ProjectPhases.jsx              # Timeline & phases
│       ├── ProjectFinancials.jsx          # Cost breakdown & financials
│       └── ProjectTeam.jsx                # Team & organization
└── App.jsx                         # Updated with project navigation
```

## Feature Breakdown

### 1. **ProjectContext.jsx**

Manages global project state including:
- Project list management (CRUD operations)
- Phase tracking per project
- Team member management
- Financial data storage
- Selected project state

**Key Actions:**
- `addProject()` - Create new investment project
- `updateProject()` - Update project details
- `deleteProject()` - Remove project
- `addPhase()` - Add project phase
- `updatePhase()` - Modify phase
- `deletePhase()` - Remove phase
- `addTeamMember()` - Add team member
- `updateFinancials()` - Update financial data

### 2. **InvestmentProjectDashboard.jsx**

Main dashboard component featuring:
- Project list sidebar (project selection)
- Tabbed interface for different sections
- Project header with title and location
- Navigation between Overview, Phases, Financials, and Team tabs
- Responsive grid layout

**Functionality:**
- Create new projects via modal form
- Switch between projects
- Delete projects
- View project details across multiple tabs

### 3. **ProjectForm.jsx**

Modal form for creating new projects with fields:
- **Basic Info:** Name, Location, Description
- **Profile:** Investor Type (Value Added, Core+, Opportunistic)
- **Strategy:** Disinvestment Model (Fraction Sales, Whole Sale, Rental)
- **Capital:** Owner Capital amount
- **Timeline:** Start and End dates
- **Value:** Expected project value

### 4. **ProjectOverview.jsx**

Displays comprehensive project information:

**Sections:**
- **Project Details:** Name, location, investor profile, strategy
- **Construction Specs:** 40 apartments, square meters, T2/T3/T4 distribution
- **Cost Breakdown:**
  - Direct costs (above/below ground)
  - Indirect costs (17% of direct)
  - Total construction costs: €11,583,000
- **Financing Structure:**
  - Owner capital: €15,000,000
  - Land financing: Up to 25%
  - Construction financing: Up to 50%
  - Financing rate: 5.0364% (Euribor 6M + 2.5%)
- **Financial Metrics:** Project IRR, Equity IRR, NPV
- **Data Validation Notes:** Highlights Excel discrepancies

### 5. **ProjectPhases.jsx**

Project timeline management with:

**Default Phases:**
1. Land Acquisition (2-3 months)
2. Project Development (3-4 months)
3. Construction Phase (18-24 months)
4. Sales & Commercialization (parallel with construction)
5. Unit Delivery & Handover (2-3 months)

**Features:**
- View all project phases
- Add custom phases with budget tracking
- Update phase status (pending, planning, in-progress, completed)
- Delete phases
- Timeline summary with critical path analysis

### 6. **ProjectFinancials.jsx**

Comprehensive financial analysis including:

**Cost Breakdown:**
```
Direct Costs:
- Above Ground: 6,500 m² × €1,400 = €9,100,000
- Below Ground: 2,000 m² × €400 = €800,000
- Total Direct: €9,900,000

Indirect Costs (17%): €1,683,000

Total Construction: €11,583,000
```

**Financing:**
- Owner Capital: €15,000,000
- Land Financing: Up to 25% of acquisition
- Construction Financing: Up to 50% of costs
- Financing Rate: 5.0364% p.a.

**Sales & Revenue:**
- 40 apartments: T2 (10), T3 (15), T4 (15)
- Expected total sales: ~€26,726,471
- Commission: 7.38% (6% + IVA)

**Financial Metrics:**
- Expected Project IRR: ~10-12% (pending validation)
- Expected Equity IRR: ~18-22% (pending validation)
- Project NPV: €1.4M+ (pending validation)

**Data Validation Warnings:**
- ⚠️ Excel land financing discrepancy (50% vs 25%)
- ⚠️ Excel financing rate discrepancy (3M @ 2% vs 6M @ 2.5%)
- ⚠️ Commission shown as 6% instead of 7.38%

### 7. **ProjectTeam.jsx**

Team management with RACI matrix:

**Default Team Members:**
1. **Investor/Developer** - Project Owner
2. **Architect/Designer** - Design Lead
3. **Construction Manager** - Project Manager
4. **Real Estate Agent** - Sales & Marketing
5. **Financial Advisor** - Finance
6. **Legal Counsel** - Legal

**Features:**
- View all team members with details
- Add custom team members
- Organizational chart
- RACI Matrix (Responsible, Accountable, Consulted, Informed)
- Contact information management

## Data Model

### Project Object

```javascript
{
  id: number,
  name: string,
  location: string,
  description: string,
  investorProfile: "Value Added" | "Core+" | "Opportunistic",
  disinvestmentStrategy: "Fraction Sales" | "Whole Sale" | "Rental",
  ownerCapital: number,
  projectValue: number,
  startDate: string (ISO date),
  expectedEndDate: string (ISO date),
  status: "active" | "completed" | "on-hold",
  createdAt: string (ISO timestamp),
  phases: Phase[],
  financials: FinancialData,
  team: TeamMember[]
}
```

### Phase Object

```javascript
{
  id: number,
  name: string,
  description: string,
  startDate: string,
  endDate: string,
  status: "pending" | "planning" | "in-progress" | "completed",
  budget: number,
  spentAmount: number,
  duration: string
}
```

### TeamMember Object

```javascript
{
  id: number,
  name: string,
  role: string,
  email: string,
  phone: string,
  responsibility: string,
  color: string,
  initials: string
}
```

## Key Features

### 1. **Beato Riverside Residences Project**

Pre-populated with all data from the investment analysis:
- 40 apartments across 4 stories
- €11.58M construction budget
- €15M investor capital
- 27-34 month timeline
- Value Added investor profile
- Fraction sales strategy

### 2. **Multi-Tab Navigation**

- **Overview Tab:** Complete project specifications and costs
- **Phases Tab:** Construction timeline with milestones
- **Financials Tab:** Cost breakdown, financing structure, revenue projections
- **Team Tab:** Organization structure and RACI matrix

### 3. **Data Validation**

Highlights discrepancies between Excel model and specifications:
- Land financing: 50% (Excel) vs 25% (spec)
- Financing rate: Euribor 3M+2% (Excel) vs Euribor 6M+2.5% (spec)
- Commission: 6% (profitability sheet) vs 7.38% (spec)

### 4. **Financial Calculations**

Automatic calculation of:
- Direct construction costs (€9,900,000)
- Indirect costs at 17% (€1,683,000)
- Total construction budget (€11,583,000)
- Sales commission (7.38% of revenue)
- Financing costs based on rates

### 5. **Team Organization**

Complete organizational structure with:
- Role-based assignments
- RACI matrix for responsibility mapping
- Contact information
- Activity assignments

## Usage Guide

### Creating a New Project

1. Click **"+ New Project"** button in the dashboard
2. Fill in project details:
   - Project name and location
   - Investor profile type
   - Disinvestment strategy
   - Owner capital
   - Expected project value
   - Timeline dates
3. Click **"Create Project"**

### Managing Project Phases

1. Navigate to **Phases** tab
2. Click **"+ Add Phase"** to create new phases
3. Set phase details:
   - Name and description
   - Start and end dates
   - Budget allocation
4. Update phase status as work progresses

### Viewing Financial Analysis

1. Navigate to **Financials** tab
2. Review cost breakdowns:
   - Direct costs (above/below ground)
   - Indirect costs
   - Total construction budget
3. Check financing structure:
   - Owner capital allocation
   - Bank financing terms
   - Interest rates
4. Analyze sales projections and commission

### Managing Team

1. Navigate to **Team** tab
2. View organizational structure and RACI matrix
3. Click **"+ Add Member"** to add team members
4. Assign roles and responsibilities
5. Update contact information

## Integration with Task Dashboard

The Investment Project Tracker is fully integrated with the existing Task Dashboard:

### Navigation

- **Tasks Tab:** Original task management interface
- **Projects Tab:** New investment project tracker

### Shared Context

Both systems use React Context for state management:
- `TaskContext` - Task management
- `ProjectContext` - Project management
- Can be expanded to link tasks to projects

## Technical Stack

- **React 19.1.0** - UI framework
- **Framer Motion 12.23.9** - Animations
- **Tailwind CSS 4.1.5** - Styling
- **React Context API** - State management
- **Heroicons** - UI icons

## Next Steps & Enhancements

### Planned Features

1. **Excel Integration**
   - Import Excel data directly
   - Export project data to Excel
   - Automatic calculations sync

2. **Financial Modeling**
   - Cash flow projections
   - NPV/IRR calculations
   - Sensitivity analysis

3. **Task Linking**
   - Link tasks to project phases
   - Gantt chart visualization
   - Resource allocation

4. **Reporting**
   - Generate project reports
   - Financial summaries
   - Progress dashboards

5. **Collaboration**
   - Team member assignments
   - Activity logs
   - Comments and notes

6. **Validation**
   - Correct Excel discrepancies
   - Recalculate financial metrics
   - Cross-validate assumptions

## Data Persistence

Currently uses React state (in-memory). For production:
- Integrate with backend API
- Store in database
- Add authentication/authorization
- Implement audit trails

## Testing

To test the new features:

1. Click **"🏢 Investment Projects"** tab
2. Click **"+ New Project"**
3. Use pre-filled data or enter custom values
4. Explore each tab (Overview, Phases, Financials, Team)
5. Add phases, team members, and modify data

## Code Quality

- Follow React best practices
- Use functional components with hooks
- Maintain component separation of concerns
- Include prop validation
- Write JSDoc comments for complex functions
- Add unit tests for critical functions

## Notes

- All calculations use data from the investment analysis document
- Financial figures are indicative and require Excel validation
- Team structure includes typical real estate project roles
- Timeline assumes standard construction phases
