"use client";

import { useActionState } from "react";
import {
  login,
  type LoginState,
} from "@/app/admin/login/actions";
import { LoginSubmitButton } from "@/app/admin/login/LoginSubmitButton";

export function LoginForm({ initialError }: { initialError: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {
    error: initialError,
  });

  return (
    <form action={formAction} className="mt-7 space-y-5">
      <label className="block space-y-2 text-sm font-medium text-stone-700">
        <span>邮箱</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-400"
        />
      </label>
      <label className="block space-y-2 text-sm font-medium text-stone-700">
        <span>密码</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full rounded-2xl border border-stone-200 px-4 py-3 outline-none focus:border-stone-400"
        />
      </label>
      {state.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      <LoginSubmitButton />
    </form>
  );
}
