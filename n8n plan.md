# Plan: AI Spark — Employee Proposal Evaluator (n8n Workflow)

## Context
Build an n8n workflow that receives employee improvement proposals via webhook, evaluates them using OpenAI GPT-4o, stores the results in Supabase, and notifies a fixed manager/HR email address.

> - Workflow ID: `FnwVQ5GoSoy9fEoT`
> - n8n instance: `https://automation.qnomy.com:5678`

---

## Workflow Chain
```
Webhook → Normalize/Validate → AI Agent (GPT-4o + Structured Parser) → Supabase Insert → Email Send
```

---

## Node Details

### 1. Webhook Trigger
- **Method:** POST
- **Path:** `/webhook/17efe5f2-249f-4f7b-bfca-16dad77e2511`
- **Fields:** `employee_name`, `department`, `proposal`, `expected_benefits`, `additional_info`

### 2. Normalize & Validate Input
- Trim whitespace, replace null/undefined with `""`
- Enforce max lengths: `proposal` → 2000, `expected_benefits`/`additional_info` → 1000
- Normalize department casing

### 3. AI Agent (GPT-4o) + Structured Output Parser
- System prompt instructs objective evaluation, treats user content as untrusted
- Structured output: `summary`, `roi_score`, `ease_of_implementation_score`, `innovation_score`, `overall_score`, `classification`, `ai_feedback`
- `classification`: `"valid"` | `"irrelevant"` | `"prompt_injection"`

### 4. Supabase Insert
- Table: `proposals`
- Inserts all webhook + AI fields

#### Table Schema:
```sql
CREATE TABLE proposals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_name text,
  department text,
  proposal text,
  expected_benefits text,
  additional_info text,
  summary text,
  roi_score int,
  ease_of_implementation_score int,
  innovation_score int,
  overall_score int,
  classification text,
  ai_feedback text,
  submitted_date date DEFAULT CURRENT_DATE,
  submitted_at timestamptz DEFAULT now()
);
```

### 5. Email Send
- **Subject:** `New Proposal from {{ employee_name }} — Score: {{ overall_score }}/100 [{{ classification }}]`
- HTML body with employee info, proposal, AI scores and feedback

---

## Pre-requisites
1. Create the `proposals` table in Supabase
2. OpenAI API key
3. SMTP credentials (or Gmail OAuth)
4. Manager/HR email address
