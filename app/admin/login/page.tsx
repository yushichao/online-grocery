import { redirect } from "next/navigation";
import { getAdminUserId } from "@/lib/auth/admin";
import { login } from "@/app/admin/login/actions";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  if (await getAdminUserId()) redirect("/admin");
  const { error } = await searchParams;
  const errorMessage =
    error === "forbidden"
      ? "该账号没有后台管理权限"
      : error
        ? "邮箱或密码不正确"
        : "";

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16 sm:px-6">
      <div className="w-full rounded-3xl bg-white p-7 shadow-[0_2px_24px_rgba(0,0,0,0.06)] sm:p-8">
        <h1 className="text-2xl font-semibold text-stone-900">后台登录</h1>
        <p className="mt-2 text-sm text-stone-500">
          使用已授权的 Supabase 管理员账号登录。
        </p>
        <form action={login} className="mt-7 space-y-5">
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
          {errorMessage ? (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <button
            type="submit"
            className="h-12 w-full rounded-full bg-stone-900 text-sm font-medium text-white hover:bg-stone-800"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  );
}
