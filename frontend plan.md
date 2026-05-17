# Plan: AI Spark — Frontend Single Page Application

## Context
Build a React + Tailwind CSS single-page application that employees use to submit improvement proposals. The form POSTs to the existing n8n webhook, which handles AI evaluation, Supabase storage, and manager email notification.

> **Webhook endpoint:** `POST https://automation.qnomy.com:5678/webhook/17efe5f2-249f-4f7b-bfca-16dad77e2511`
> **Content-Type:** `application/json`

## Brand Assets

| Asset | File | Usage |
|---|---|---|
| Logo | `Logo2026.png` | Header of the SPA — must use transparent-background version |
| Primary color | `#0D2249` (dark navy) | Headers, labels, borders, icon strokes |
| Accent color | `#E8622A` (burnt orange) | CTA button, active states, focus rings, highlights |
| Background | `transparent` / `#FFFFFF` | Page and card — light, clean, matching logo aesthetic |

> **Logo background:** Export / re-save `Logo2026.png` with a transparent background (remove white) so it sits cleanly on any page background. The design system is derived from the Q·nomy logo: dark navy + burnt orange on white.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 (Vite scaffold) |
| Styling | Tailwind CSS v3 |
| HTTP | Native `fetch` (no extra library) |
| Forms | Controlled components + `useState` (no form library — one form, no need for React Hook Form) |
| Build | Vite |
| Package manager | npm |

---

## File Structure

```
ai-spark-frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js          ← extend colors: navy, brand (orange)
├── postcss.config.js
├── public/
│   └── Logo2026.png            ← Q·nomy logo — transparent background PNG
└── src/
    ├── main.jsx                ← React root mount
    ├── index.css               ← Tailwind directives
    ├── App.jsx                 ← page shell: logo header + <ProposalForm />
    ├── constants.js            ← WEBHOOK_URL, field max-lengths
    └── components/
        ├── ProposalForm.jsx    ← form + state machine
        ├── FormField.jsx       ← reusable labeled input/textarea with counter & error
        ├── SuccessBanner.jsx   ← green confirmation card
        └── ErrorBanner.jsx     ← red error card with retry message
```

---

## Page Layout

```
┌──────────────────────────────────────────────┐
│  [●●●|● Q·nomy logo]    transparent bg       │
│  AI Spark — Employee Idea Submission Portal  │
│  ─────────────────── (navy divider) ──────── │
├──────────────────────────────────────────────┤
│                                              │
│  Your Name *                                 │
│  ┌────────────────────────────────────────┐  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Department *                                │
│  ┌────────────────────────────────────────┐  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Your Proposal *                             │
│  ┌────────────────────────────────────────┐  │
│  │  (textarea, 6 rows)         0 / 2000   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Expected Benefits *                         │
│  ┌────────────────────────────────────────┐  │
│  │  (textarea, 4 rows)         0 / 1000   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  Additional Info (optional)                  │
│  ┌────────────────────────────────────────┐  │
│  │  (textarea, 3 rows)         0 / 1000   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│         [ Submit Proposal  → ]               │
│                                              │
│  ✓ Success banner  /  ✗ Error banner         │
└──────────────────────────────────────────────┘
```

---

## Form Fields

| Field | Element | Required | Max length | Placeholder |
|---|---|---|---|---|
| `employee_name` | `<input type="text">` | Yes | 100 | "Your full name" |
| `department` | `<input type="text">` | Yes | 100 | "e.g. Engineering, HR, or 'everyone'" |
| `proposal` | `<textarea rows={6}>` | Yes | 2000 | "Describe your proposal in detail…" |
| `expected_benefits` | `<textarea rows={4}>` | Yes | 1000 | "What outcomes or savings do you expect?" |
| `additional_info` | `<textarea rows={3}>` | No | 1000 | "Any supporting context, links, or data" |

Character counters update live via `onChange` and turn red when ≥ 90 % of the limit is reached.

---

## Component Details

### `constants.js`
```js
export const WEBHOOK_URL =
  'https://automation.qnomy.com:5678/webhook/17efe5f2-249f-4f7b-bfca-16dad77e2511';

export const FIELD_LIMITS = {
  employee_name: 100,
  department: 100,
  proposal: 2000,
  expected_benefits: 1000,
  additional_info: 1000,
};
```

### `FormField.jsx`
Props: `id`, `label`, `value`, `onChange`, `maxLength`, `required`, `rows` (omit for `<input>`), `error`, `placeholder`

Renders:
- `<label>` linked via `htmlFor`
- `<input>` or `<textarea>` (determined by presence of `rows` prop)
- Live character counter (`{value.length} / {maxLength}`) — red text when near limit
- Inline `<p>` error message in red when `error` prop is set

### `ProposalForm.jsx`
State:
```js
const [fields, setFields] = useState({ employee_name, department, proposal,
                                        expected_benefits, additional_info })
const [errors, setErrors] = useState({})      // field-level validation messages
const [status, setStatus] = useState('idle')  // 'idle' | 'loading' | 'success' | 'error'
const [errorMessage, setErrorMessage] = useState('')
```

On submit:
1. `validate()` — required fields non-empty after trim, within max lengths → sets `errors` state and returns false on failure
2. `setStatus('loading')` — disables all inputs and button
3. `fetch(WEBHOOK_URL, { method: 'POST', headers, body: JSON.stringify(fields) })`
4. `response.ok` → `setStatus('success')`, reset `fields`
5. Non-2xx or network error → `setStatus('error')`, set `errorMessage`

### `App.jsx` — Page Shell
Renders the full-page wrapper. Header contains:
- `<img src="/Logo2026.png" alt="Q·nomy" className="h-10" />` — logo with transparent background
- Page title `AI Spark` in `text-navy font-bold`
- Subtitle `Employee Idea Submission Portal` in muted navy
- Orange `border-b-2 border-brand` divider beneath the header bar

Page wrapper: `min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4`

### `SuccessBanner.jsx`
Green Tailwind card (`bg-emerald-50 border border-emerald-200`) with checkmark icon and message:
> "Your proposal has been submitted! Our AI will evaluate it and your manager will be notified shortly."

Includes a "Submit another" link in `text-brand` that resets the form to `idle`.

### `ErrorBanner.jsx`
Red Tailwind card (`bg-red-50 border border-red-200`) with the error message and generic fallback:
> "Something went wrong. Please try again or contact IT support."

Form stays filled so the user can retry without re-entering data.

---

## Application States

| State | Form inputs | Button | Banner shown |
|---|---|---|---|
| `idle` | Editable | "Submit Proposal" (orange) | None |
| `loading` | Disabled | Spinner + "Submitting…" (disabled, muted orange) | None |
| `success` | Cleared + hidden | Hidden | Green success banner |
| `error` | Editable (data preserved) | "Submit Proposal" (re-enabled) | Red error banner |

---

## Visual Design (Tailwind + Q·nomy Brand)

Colors are extended in `tailwind.config.js` under `theme.extend.colors` to match the logo exactly:

```js
// tailwind.config.js
colors: {
  navy:  { DEFAULT: '#0D2249', light: '#1A3566', muted: '#6B7FA3' },
  brand: { DEFAULT: '#E8622A', hover: '#C94F1E', light: '#FDF0EB' },
}
```

| Element | Tailwind class |
|---|---|
| Page background | `bg-transparent` → body uses `bg-white` or `bg-gray-50` |
| Page wrapper | `min-h-screen bg-gray-50` |
| Card | `bg-white rounded-2xl shadow-md border border-gray-100 max-w-xl mx-auto p-8` |
| Logo in header | `<img src="/Logo2026.png" alt="Q·nomy" className="h-10" />` — transparent PNG |
| Page title "AI Spark" | `text-navy font-bold text-xl` |
| Subtitle | `text-navy-muted text-sm` |
| Header divider | `border-b-2 border-brand mb-8` — orange rule under the logo/title bar |
| Form labels | `text-navy font-semibold text-sm` |
| Inputs / textareas | `border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand` |
| Character counter (normal) | `text-gray-400 text-xs` |
| Character counter (≥ 90%) | `text-red-500 text-xs font-medium` |
| Inline field error | `text-red-500 text-xs mt-1` |
| Primary button | `bg-brand hover:bg-brand-hover text-white font-semibold rounded-lg px-6 py-3 transition-colors` |
| Button (loading/disabled) | `bg-brand/50 cursor-not-allowed` |
| Success banner | `bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4` |
| Error banner | `bg-red-50 border border-red-200 text-red-800 rounded-xl p-4` |
| "Submit another" link | `text-brand hover:text-brand-hover underline` |
| Responsive | `w-full` on mobile, `max-w-xl` centered on desktop, `py-10 px-4` page padding |

**Typography:** `font-sans` system stack; labels `font-semibold text-navy`, body/input `text-gray-700`, muted `text-gray-400`.

**Orange accent rule** — a 2px `border-brand` bottom border beneath the header acts as the visual anchor that echoes the orange Q in the logo and ties the page header to the brand.

**No dark mode** — the logo is built for light backgrounds; keep the page white/gray-50.

---

## CORS Requirement

The n8n Webhook node must allow cross-origin requests from the frontend's domain.
In n8n → Webhook node settings → **"Allowed Origins (CORS)"** → set to the deployed frontend origin (e.g., `https://aispark.yourcompany.com`) or `*` during development.

---

## Build & Run

```bash
npm create vite@latest ai-spark-frontend -- --template react
cd ai-spark-frontend
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
# configure tailwind.config.js content paths
npm run dev      # development
npm run build    # production build → dist/
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, or your own web server).

---

## Build Order

1. Scaffold project with Vite React template
2. Configure Tailwind CSS
3. `constants.js` — webhook URL + field limits
4. `FormField.jsx` — reusable field component with counter and error
5. `SuccessBanner.jsx` + `ErrorBanner.jsx`
6. `ProposalForm.jsx` — form state, validation, fetch logic
7. `App.jsx` — page shell with header branding and `<ProposalForm />`
8. Manual test: run `npm run dev`, submit against the live webhook
9. Build and deploy

---

## Out of Scope

- Authentication / login (internal tool, URL access is sufficient)
- Viewing past submissions (Supabase dashboard handles this)
- File attachments
- Multi-language / i18n
