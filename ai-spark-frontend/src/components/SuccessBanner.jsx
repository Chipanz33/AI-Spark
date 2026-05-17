export default function SuccessBanner({ onReset }) {
  return (
    <div className="text-center py-4">
      <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h2 className="text-navy text-xl font-bold mb-2">Proposal Submitted!</h2>
      <p className="text-gray-500 text-sm mb-5">
        Our AI will evaluate your idea and notify your manager shortly.
      </p>

      <div className="bg-brand-light border border-orange-200 rounded-xl p-4 mb-6 text-brand text-sm font-medium">
        Thank you for contributing to Q·nomy's continuous improvement!
      </div>

      <button
        onClick={onReset}
        className="text-brand hover:text-brand-hover underline text-sm font-medium transition-colors"
      >
        Submit another proposal →
      </button>
    </div>
  );
}
