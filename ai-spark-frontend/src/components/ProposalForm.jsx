import { useState } from 'react';
import { WEBHOOK_URL, FIELD_LIMITS, EMPTY_FIELDS } from '../constants';
import FormField from './FormField';
import SuccessBanner from './SuccessBanner';
import ErrorBanner from './ErrorBanner';

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function ProposalForm() {
  const [fields, setFields] = useState(EMPTY_FIELDS);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errMsg,  setErrMsg]  = useState('');

  function update(key, val) {
    setFields(prev => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
  }

  function validate() {
    const e = {};
    if (!fields.employee_name.trim())     e.employee_name     = 'Your name is required.';
    if (!fields.department.trim())        e.department        = 'Department is required.';
    if (!fields.proposal.trim())          e.proposal          = 'Proposal text is required.';
    if (!fields.expected_benefits.trim()) e.expected_benefits = 'Expected benefits are required.';
    for (const [key, max] of Object.entries(FIELD_LIMITS)) {
      if (!e[key] && fields[key].length > max) e[key] = `Maximum ${max} characters.`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    setErrMsg('');
    try {
      const res = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (res.ok) {
        setStatus('success');
        setFields(EMPTY_FIELDS);
      } else {
        throw new Error(`Server responded with ${res.status}`);
      }
    } catch (err) {
      setStatus('error');
      setErrMsg(err.message);
    }
  }

  if (status === 'success') {
    return <SuccessBanner onReset={() => setStatus('idle')} />;
  }

  const loading = status === 'loading';

  return (
    <form onSubmit={handleSubmit} noValidate>
      <FormField
        id="employee_name" label="Your Name" required
        value={fields.employee_name} onChange={v => update('employee_name', v)}
        maxLength={FIELD_LIMITS.employee_name}
        placeholder="Your full name"
        error={errors.employee_name} disabled={loading}
      />
      <FormField
        id="department" label="Department" required
        value={fields.department} onChange={v => update('department', v)}
        maxLength={FIELD_LIMITS.department}
        placeholder="e.g. Engineering, HR, or 'everyone'"
        error={errors.department} disabled={loading}
      />
      <FormField
        id="proposal" label="Your Proposal" required rows={6}
        value={fields.proposal} onChange={v => update('proposal', v)}
        maxLength={FIELD_LIMITS.proposal}
        placeholder="Describe your proposal in detail…"
        error={errors.proposal} disabled={loading}
      />
      <FormField
        id="expected_benefits" label="Expected Benefits" required rows={4}
        value={fields.expected_benefits} onChange={v => update('expected_benefits', v)}
        maxLength={FIELD_LIMITS.expected_benefits}
        placeholder="What outcomes or savings do you expect?"
        error={errors.expected_benefits} disabled={loading}
      />
      <FormField
        id="additional_info" label="Additional Info" rows={3}
        value={fields.additional_info} onChange={v => update('additional_info', v)}
        maxLength={FIELD_LIMITS.additional_info}
        placeholder="Any supporting context, links, or data"
        error={errors.additional_info} disabled={loading}
      />

      {status === 'error' && <ErrorBanner message={errMsg} />}

      <div className="mt-6">
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 font-semibold rounded-lg px-6 py-3 text-white transition-colors ${
            loading
              ? 'bg-brand opacity-60 cursor-not-allowed'
              : 'bg-brand hover:bg-brand-hover'
          }`}
        >
          {loading ? <><Spinner /> Submitting…</> : 'Submit Proposal →'}
        </button>
      </div>
    </form>
  );
}
