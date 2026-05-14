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

---

## Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 (Vite scaffold) |
| Styling | Tailwind CSS v3 |
| HTTP | Native `fetch` (no extra library) |
| Forms | Controlled components + `useState` |
| Build | Vite |
| Package manager | npm |

---

## Form Fields

| Field | Element | Required | Max length |
|---|---|---|---|
| `employee_name` | `<input type="text">` | Yes | 100 |
| `department` | `<input type="text">` | Yes | 100 |
| `proposal` | `<textarea rows={6}>` | Yes | 2000 |
| `expected_benefits` | `<textarea rows={4}>` | Yes | 1000 |
| `additional_info` | `<textarea rows={3}>` | No | 1000 |

---

## Application States

| State | Form inputs | Button | Banner shown |
|---|---|---|---|
| `idle` | Editable | "Submit Proposal" (orange) | None |
| `loading` | Disabled | Spinner + "Submitting…" | None |
| `success` | Cleared + hidden | Hidden | Green success banner |
| `error` | Editable (data preserved) | Re-enabled | Red error banner |

---

## Visual Design

```js
colors: {
  navy:  { DEFAULT: '#0D2249', light: '#1A3566', muted: '#6B7FA3' },
  brand: { DEFAULT: '#E8622A', hover: '#C94F1E', light: '#FDF0EB' },
}
```

---

## CORS Requirement

In n8n → Webhook node settings → **"Allowed Origins (CORS)"** → set to the deployed frontend origin or `*` during development.

---

## Build & Run

```bash
cd ai-spark-frontend
npm install
npm run dev      # development
npm run build    # production build → dist/
```
