import type { ComponentProps } from "react";

interface SelectProps extends ComponentProps<"select"> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({
  label,
  error,
  options,
  id,
  className = "",
  ...props
}: SelectProps) {
  const selectId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <label
        htmlFor={selectId}
        className="block text-sm font-medium text-stone-700"
      >
        {label}
      </label>
      <select
        id={selectId}
        className={`w-full appearance-none rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-900 outline-none transition-colors focus:border-stone-400 focus:ring-2 focus:ring-stone-200 ${className}`}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
