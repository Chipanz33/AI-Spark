export default function ErrorBanner({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 rounded-xl p-4 mt-4 flex gap-3">
      <svg
        className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path
          strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div>
        <p className="font-semibold text-sm">Submission failed</p>
        <p className="text-sm mt-0.5">
          {message || 'Something went wrong. Please try again or contact IT support.'}
        </p>
      </div>
    </div>
  );
}
