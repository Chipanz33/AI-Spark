# AI Spark

Employee Idea Submission Portal built with React + Vite + Tailwind CSS.

Submissions are sent to an n8n webhook which evaluates proposals with GPT-4o, stores results in Supabase, and notifies the manager by email.

## Structure

- `ai-spark-frontend/` — React SPA (Vite + Tailwind)
- `frontend plan.md` — Frontend architecture and design spec
- `n8n plan.md` — n8n workflow design spec

## Quick start

```bash
cd ai-spark-frontend
npm install
npm run dev
```
