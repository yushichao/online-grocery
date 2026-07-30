"use client";

import { useFormStatus } from "react-dom";

export function LoginSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="space-y-3">
      <button
        type="submit"
        disabled={pending}
        aria-disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-stone-900 text-sm font-medium text-white transition-colors hover:bg-stone-800 disabled:cursor-wait disabled:bg-stone-700"
      >
        {pending ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white"
              aria-hidden="true"
            />
            登录处理中…
          </>
        ) : (
          "登录"
        )}
      </button>
      <p
        className={`text-center text-xs text-stone-500 transition-opacity ${
          pending ? "opacity-100" : "opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        正在验证管理员账号，请稍候…
      </p>
    </div>
  );
}
