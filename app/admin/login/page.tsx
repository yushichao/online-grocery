import { redirect } from "next/navigation";
import { getAdminUserId } from "@/lib/auth/admin";
import { LoginForm } from "@/app/admin/login/LoginForm";

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
        <LoginForm initialError={errorMessage} />
      </div>
    </div>
  );
}
