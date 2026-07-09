# ELISA Chest X-Ray Report — TDD Practice

## 1. Overview

**Project timeline:** ~3 months of active development on V2 (React + TypeScript frontend, FastAPI backend, ONNX-based ML engine).

**Methodology:** Test-driven development — red → green → review for every vertical slice. Tests drive the public interface, not implementation details.

**Why TDD here:** The ML calibration logic, GradCAM explainability, and API layer are all safety-critical paths where correctness matters. TDD keeps the feedback loop tight and the test suite trustworthy.

---

## 2. Seams Under Test

Tests live only at pre-agreed seams — public boundaries where we observe behavior without reaching inside.

| Seam | Boundary | Tooling | Status |
|---|---|---|---|
| ML classifier | `calibrateProbabilities(logits, config)` | Vitest | ✅ 2 tests |
| ML explainer | `computeGradCAM(activations, gradients, ...)` | Vitest | ✅ 2 tests |
| ML preprocessing | `preprocessChestXray(imageData, targetSize)` | Vitest | ✅ 2 tests |
| API client | `uploadAndPredict(file, signal?)` | Vitest + MSW / mock fetch | 🔲 planned |
| Zustand store | `useAppStore` state transitions | Vitest | 🔲 planned |
| React components | `RiskBar`, `UploadZone`, `PredictionPanel` | Vitest + Testing Library | 🔲 planned |
| FastAPI backend | `/predict`, `/health` | pytest + httpx | 🔲 planned |
| E2E flow | upload → predict → display | Playwright | 🔲 planned |

---

## 3. TDD Workflow

Each cycle follows three steps, one vertical slice at a time:

```
┌──────────────────────────────────────────────────┐
│  1. RED    Write a failing test at the seam      │
│  2. GREEN  Write minimal code to pass the test   │
│  3. REVIEW Refactor, then ship (code-review skill)│
└──────────────────────────────────────────────────┘
```

**Rules:**
- Never write a test without first agreeing the seam with the team.
- One cycle = one test + one implementation. No bulk test writing (horizontal slicing).
- Don't anticipate future tests — write the simplest code that passes *this* test.
- Refactoring lives in the review step, not the red → green loop.

---

## 4. Testing Conventions

| Concern | Convention |
|---|---|
| Framework | Vitest (frontend), pytest (backend) |
| Component tests | `@testing-library/react` — query by role/text, never by class |
| Network mocking | MSW or inline `fetch` mock for API client |
| Test location | Co-located `__tests__/` directory beside source module |
| Naming | `describe("seam name")` / `it("should <behavior>")` |
| Fixtures | Factory functions, not shared mutable state |
| Async | `await` in test body, no `done` callback |

**What a good test looks like:**
- Verifies behavior through the **public interface**, never internal methods or state.
- Expected values come from an **independent source** — worked examples, known-good literals, the spec — not recomputed by the code under test.
- Survives refactors: if internal structure changes but behavior doesn't, the test still passes.

**Anti-patterns we avoid:**

| Anti-pattern | Why |
|---|---|
| Implementation-coupled | Mocks internal collaborators, tests private methods — breaks on refactor |
| Tautological | `expect(add(a, b)).toBe(a + b)` — passes by construction, tells you nothing |
| Horizontal slicing | All tests written before any implementation — tests verify *imagined* behavior |
| Snapshot-heavy | Large snapshots mask real changes and normalise incorrect output |

---

## 5. Current Test Inventory

```
v2/client/src/__tests__/
├── preprocessing.test.ts    ✅ 2 tests (normalize + range)
├── calibration.test.ts      ✅ 2 tests (calibrateProbabilities)
└── gradcam.test.ts          ✅ 2 tests (computeGradCAM)
```

**Total: 6 tests, all passing** (Vitest v4, jsdom env with ImageData polyfill).

**Next priority (in order):**
1. API client — `uploadAndPredict` error handling, response parsing
2. Zustand store — `addPrediction` appends, `toggleDarkMode` flips, `setUpload` transitions
3. `RiskBar` component — renders probability bar, shows "explain" button above threshold
4. FastAPI `/predict` — malformed input, missing file, successful response shape
5. Playwright E2E — upload DICOM → verify prediction panel renders

---

## 6. CI Integration

The test suite runs in two gates:

| Gate | Command | When |
|---|---|---|
| Pre-commit | `vitest run --changed` | lint-staged hook (only changed files) |
| Build | `vitest run` | Before `vite build`, blocks if any test fails |

Configuration is in `v2/client/vitest.config.ts` — jsdom environment, global setup file for ImageData polyfill, path aliases matching Vite config.
