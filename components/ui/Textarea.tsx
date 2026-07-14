import type { ComponentProps } from "react";

interface TextareaProps extends ComponentProps<"textarea"> {
  label: string;
  error?: string;
}

export function Textarea({
  label,
  error,
  id,
  className = "",
  ...props
}: TextareaProps) {
  const textareaId = id ?? label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-2">
      <label
        htmlFor={textareaId}
        className="block text-sm font-medium text-stone-700"
      >
        {label}
      </label>
      <textarea
        id={textareaId}
        className={`min-h-28 w-full resize-y rounded-2xl border border-stone-200 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 outline-none transition-colors focus:border-stone-400 focus:ring-2 focus:ring-stone-200 ${className}`}
        {...props}
      />
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
