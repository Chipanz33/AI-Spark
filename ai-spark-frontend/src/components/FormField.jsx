export default function FormField({
  id, label, value, onChange, maxLength,
  required = false, rows, error, placeholder, disabled = false,
}) {
  const warn = maxLength && value.length / maxLength >= 0.9;

  const inputBase = [
    'w-full border rounded-lg px-3 py-2.5 text-gray-700 text-sm transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent',
    rows ? 'resize-none' : '',
    error   ? 'border-red-400'  : 'border-gray-200',
    disabled ? 'bg-gray-50 opacity-60 cursor-not-allowed' : 'bg-white',
  ].join(' ');

  return (
    <div className="mb-5">
      <div className="flex justify-between items-baseline mb-1.5">
        <label htmlFor={id} className="text-navy text-sm font-semibold">
          {label}
          {required && <span className="text-brand ml-0.5">*</span>}
        </label>
        {maxLength && (
          <span className={`text-xs ${warn ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            {value.length} / {maxLength}
          </span>
        )}
      </div>

      {rows ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          className={inputBase}
          aria-required={required}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      ) : (
        <input
          type="text"
          id={id}
          value={value}
          maxLength={maxLength}
          placeholder={placeholder}
          disabled={disabled}
          onChange={e => onChange(e.target.value)}
          className={inputBase}
          aria-required={required}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      )}

      {error && (
        <p id={`${id}-error`} className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}
