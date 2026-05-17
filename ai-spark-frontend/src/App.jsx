import ProposalForm from './components/ProposalForm';
import logoUrl from './assets/logo.js';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-xl">

        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <img src={logoUrl} alt="Q·nomy" className="h-10 mb-5" />
          <h1 className="text-navy text-2xl font-bold tracking-tight">AI Spark</h1>
          <p className="text-navy-muted text-sm mt-1">Employee Idea Submission Portal</p>
          <div className="border-b-2 border-brand mt-4" />
        </div>

        {/* ── Form card ──────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          <ProposalForm />
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <p className="text-center text-gray-400 text-xs mt-6">
          Powered by Q·nomy AI · Evaluated by GPT-4o
        </p>

      </div>
    </div>
  );
}
