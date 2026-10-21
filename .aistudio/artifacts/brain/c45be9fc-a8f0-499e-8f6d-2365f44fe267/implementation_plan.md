# Hydration Tracker with Dynamic Goal Calculation & Vitals Integration

A specialized preventive hydration intelligence system for LifeSphere AI-X that tracks daily water intake, visualizes progress with an interactive liquid progress gauge, and dynamically adapts daily hydration targets based on ambient environmental temperature, relative humidity, user physical activity, and physiological vitals.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Implementation Strategy & Defaults Confirmed**:
> - **Dynamic Goal Adaptation**: Daily hydration targets start with a clinical weight baseline ($35\text{ ml/kg}$ body weight $\approx 2,590\text{ ml}$ for a $74\text{ kg}$ profile) and dynamically calibrate in real-time according to ambient heat index (+$250\text{ ml}$ per $5^\circ\text{C}$ over $24^\circ\text{C}$), dry air/humidity deficits, and physiological strain (elevated heart rate, body temperature, and daily step count).
> - **Multi-Surface Access**: The Hydration Tracker will be featured as a dedicated first-class primary module in the navigation sidebar (`ScreenModule: 'hydration'`), accompanied by a compact summary widget on the **Main Dashboard** and **Health Overview** for instant glanceability and quick logging.
> - **Logging Controls**: Combines ergonomic quick-tap presets ($150\text{ ml}$ espresso/tea, $250\text{ ml}$ standard glass, $500\text{ ml}$ sports bottle, $750\text{ ml}$ thermal flask) with a custom numeric drawer supporting beverage types and hydration coefficients (Water $1.0\times$, Electrolyte $1.1\times$, Herbal Tea $0.95\times$, Coconut Water $1.05\times$, Coffee $0.8\times$).
> - **Persistence**: Synced via local storage with reactive Firestore persistence under `users/{uid}/hydrationLogs/{logId}` when user authentication is active.

---

## 1. Overview & Core Concept

### What It Does
The **Hydration Tracker** provides predictive fluid balance tracking tailored to environmental and biometric strain. Rather than relying on a static $2,000\text{ ml}$ recommendation, LifeSphere AI-X integrates live environmental sensors (temperature, humidity, UV index) and wearable telemetry (heart rate, body temperature, active steps) to calculate a personalized, fluid-loss-compensated daily goal. Users can log intake in one tap, inspect an animated liquid gauge, view their 24-hour hydration cadence, monitor a real-time dehydration risk score, and review a 7-day trend chart.

### Target Audience & Persona
- **Preventive Healthcare Patients & Athletes**: Individuals managing cardiac workload, asthma, or kidney health where dehydration exacerbates symptoms.
- **Urban Professionals & Field Workers**: Users exposed to ambient heat waves, high UV, or air-conditioned environments requiring active hydration pacing.

### Key Value Delivered
Eliminates arbitrary guessing by transforming hydration into a precision health metric directly coupled to heat-stress risk and cardiovascular resilience.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[Main Dashboard / Health Overview]
             │
             ├─► [Quick Log Pill / +250ml tap] ──► Instant Toast & Gauge Update
             │
             └─► [Click "Hydration Details"]
                           │
                           ▼
              ┌─────────────────────────────┐
              │   Hydration Tracker View    │
              │  - Dynamic Goal Breakdown   │
              │  - Liquid Level Gauge       │
              │  - Quick & Custom Loggers   │
              │  - Hourly Intake Timeline   │
              │  - 7-Day Hydration History  │
              │  - Clinical Dehydration Tip │
              └─────────────────────────────┘
```

1. **Dashboard Glance & 1-Tap Log**: From the main health dashboard, users see a dedicated Hydration Status card showing current intake (e.g., $1,750\text{ ml} / 2,840\text{ ml}$), current percentage, and a quick-tap `+250 ml` button for immediate logging without context switching.
2. **Deep-Dive Hydration Hub**: Selecting the module opens the full Hydration Intelligence view:
   - **Hero Gauge & Goal Breakdown**: A responsive cylindrical/radial liquid level gauge with fluid wave motion indicating current volume, percentage, and remaining deficit.
   - **Dynamic Adjustment Formula Panel**: Transparently explains the math: Base Goal ($2,590\text{ ml}$) + Heat Stress Adjustment ($+250\text{ ml}$) + Activity Buffer ($+150\text{ ml}$) = Dynamic Goal ($2,990\text{ ml}$).
   - **Quick Intake Bar**: 4 quick-tap vessels ($150\text{ ml}$, $250\text{ ml}$, $500\text{ ml}$, $750\text{ ml}$) and a "Custom Log" button.
   - **Custom Log Drawer**: Select exact volume, timestamp, beverage category, and hydration coefficient.
   - **Today's Timeline & History**: Chronological log with time-stamps, beverage icon, volume, and delete/undo affordance.
   - **7-Day Analytics Chart**: Bar graph comparing actual intake against each day's dynamic goal with target-completion badges.

### Visual Identity & Theme (conforming to SaaS & Dashboard Guidelines)
- **Aesthetic Direction**: High-density medical/environmental intelligence dashboard. Deep dark slate canvas with cyan/azure hydration accents and emerald status signals.
- **Color Palette**:
  - Neutral Canvas: `#020617` (Slate 950)
  - Card & Structural Surfaces: `#0F172A` (Slate 900), `#1E293B` (Slate 800) with hairline borders (`border-slate-800`)
  - Water & Hydration Accent: Cyan `#06B6D4` / Sky `#38BDF8` / Blue `#3B82F6`
  - Nominal / Optimal Target: Emerald `#10B981`
  - Dehydration / Heat-Stress Warning: Amber `#F59E0B` / Rose `#F43F5E`
- **Typography & Tabular Discipline**:
  - Headlines: Plus Jakarta Sans / Outfit for crisp section headers.
  - Metrics & Telemetry: Monospace tabular numerals (`font-mono tabular-nums`) for all volumes, percentages, and timestamps.
  - Zero-Pill Rule: Metadata (timestamps, beverage types, environmental factors) rendered as clean unboxed text separated by subtle middots (`·`).
- **Interactive Feedback**: Liquid fill level animates with CSS keyframe transitions; quick-logging triggers haptic-style visual pulses and dismissible confirmation banners.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dynamic Goal Formula vs. Static Target**:
  - *Chosen Approach*: Dynamic formula that re-evaluates in real time whenever ambient temperature, humidity, step count, or body temperature changes.
  - *Why*: In preventive health and heat-stress management, fluid requirements in $32^\circ\text{C}$ heat during physical exertion can be $40\%\text{--}70\%$ higher than in an air-conditioned room.
  - *Alternatives Considered*: Static 8-glasses-a-day rule (discarded as medically oversimplified for an academic AI health system).
- **Decision 2: Dual Access Pattern (Dedicated View + Dashboard Card)**:
  - *Chosen Approach*: Add `hydration` to `ScreenModule` in the sidebar and place an interactive summary card on the Dashboard and Measurements screens.
  - *Why*: Allows rapid daily micro-logging (under 2 seconds) while preserving deep analytical capability for detailed hydration reviews.
- **Decision 3: Offline-First Local Storage with Firestore Sync**:
  - *Chosen Approach*: Local storage acts as immediate cache; logs sync reactively to Firestore `users/{uid}/hydrationLogs` when authenticated.
  - *Why*: Guarantees instant sub-50ms UI updates even on intermittent network connections.

---

## 4. Technical Architecture & Data Strategy

### System Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LifeSphere AI-X Frontend                        │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│   ┌──────────────────────────┐         ┌───────────────────────────┐   │
│   │   HealthMetrics State    │         │  EnvironmentalData State  │   │
│   │ (Weight, HR, Temp, Steps)│         │(Ambient Temp, Humid, AQI) │   │
│   └─────────────┬────────────┘         └─────────────┬─────────────┘   │
│                 │                                    │                 │
│                 └─────────────────┬──────────────────┘                 │
│                                   ▼                                    │
│                 ┌───────────────────────────────────┐                  │
│                 │     Dynamic Goal Engine Service   │                  │
│                 │  calculateDynamicHydrationGoal()  │                  │
│                 └─────────────────┬─────────────────┘                  │
│                                   │                                    │
│         ┌─────────────────────────┴────────────────────────┐           │
│         ▼                                                  ▼           │
│   ┌───────────────────────────────┐          ┌─────────────────────┐   │
│   │ HydrationTrackerView.tsx      │          │ HydrationCard.tsx   │   │
│   │ - LiquidWaveGauge             │          │ (Dashboard & Health)│   │
│   │ - QuickTapLoggers (150/250/..)│          │ - Mini gauge        │   │
│   │ - CustomLogModal              │          │ - Quick +250ml tap  │   │
│   │ - IntakeTimelineTable         │          │ - Deep-link button  │   │
│   │ - 7DayTrendChart              │          └─────────────────────┘   │
│   └──────────────┬────────────────┘                                    │
│                  │                                                     │
│                  ▼                                                     │
│   ┌──────────────────────────────────────────────┐                     │
│   │ hydrationService.ts (Storage & Calculations) │                     │
│   └──────────────────────┬───────────────────────┘                     │
│                          │                                             │
│                          ▼                                             │
│   ┌──────────────────────────────────────────────┐                     │
│   │ firebaseSyncService / Cloud Firestore Sync   │                     │
│   │ Collection: users/{uid}/hydrationLogs        │                     │
│   └──────────────────────────────────────────────┘                     │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models (`src/types/hydration.ts` & `src/types/index.ts`)

```typescript
export type BeverageType = 'water' | 'electrolyte' | 'herbal_tea' | 'coconut_water' | 'coffee' | 'juice';

export interface HydrationLogEntry {
  id: string;
  timestamp: string;      // ISO string
  volumeMl: number;       // raw volume logged
  effectiveMl: number;    // volume adjusted by hydration coefficient
  beverageType: BeverageType;
  source: 'quick_preset' | 'custom_entry' | 'wearable_prompt';
  notes?: string;
}

export interface DynamicGoalFactors {
  baseWeightMl: number;        // e.g. 74kg * 35ml = 2590ml
  temperatureAdjustmentMl: number; // e.g. +250ml if > 25°C
  humidityAdjustmentMl: number;    // e.g. +100ml if dry (<35% RH)
  activityAdjustmentMl: number;    // e.g. +200ml for high steps/calories
  vitalStrainAdjustmentMl: number;// e.g. +150ml for elevated heart rate / temp
  totalGoalMl: number;
}

export interface DayHydrationSummary {
  date: string;           // YYYY-MM-DD
  totalIntakeMl: number;
  goalMl: number;
  percentage: number;
  logCount: number;
}
```

### Component & State Plan
1. **`src/services/hydrationService.ts`**:
   - `calculateDynamicGoal(user, vitals, environment): DynamicGoalFactors`
   - `getTodayLogs(): HydrationLogEntry[]`
   - `logIntake(volumeMl, beverageType, source, notes): HydrationLogEntry`
   - `deleteLog(id: string): void`
   - `getPastWeekSummaries(): DayHydrationSummary[]`
   - `getDehydrationRisk(intakeMl, goalMl, vitals, environment): { riskScore: number; status: string; advice: string }`
2. **`src/components/views/HydrationTrackerView.tsx`**:
   - Primary view with full layout: liquid gauge, dynamic breakdown cards, intake controls, timeline, and 7-day trend chart.
3. **`src/components/hydration/HydrationCard.tsx`**:
   - Reusable compact card for Main Dashboard and Health Overview with visual progress and 1-tap logging.
4. **Integration**:
   - Update `ScreenModule` in `src/types/index.ts` to include `'hydration'`.
   - Update `AuthenticatedWebLayout.tsx` navigation sidebar with the new module.
   - Update `App.tsx` routing and state handlers.
   - Mount `HydrationCard` into `DashboardView.tsx` and `MeasurementsScreen.tsx`.
   - Sync logs with Firestore in `firebaseSyncService.ts`.

---

## 5. Verification & Acceptance Criteria
- **Dynamic Math**: Changing ambient temperature in the environment simulator instantly shifts the daily target up/down with live formula breakdown.
- **Logging Responsiveness**: Quick-tap buttons immediately update the total intake, liquid fill gauge, and recent log list.
- **Undo / Deletion**: Any logged item can be removed with immediate recalculation.
- **Navigation & Responsiveness**: Accessible via sidebar nav on Desktop, Tablet, and Mobile layouts; verified with `compile_applet` and `lint_applet`.
