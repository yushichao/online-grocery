import type { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  label: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        className="block text-sm font-medium text-stone-700"
      >
        {label}
      </label>
      <input
        id={inputId}
        className={`w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none transition-colors focus:border-stone-400 focus:ring-2 focus:ring-stone-200 ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
