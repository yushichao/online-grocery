"use server";

import { redirect } from "next/navigation";
import { isAdminUser } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";

export interface LoginState {
  error: string;
}

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "请输入有效的邮箱和密码" };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) {
      return { error: "邮箱或密码不正确" };
    }
    if (!(await isAdminUser(data.user.id))) {
      await supabase.auth.signOut();
      return { error: "该账号没有后台管理权限" };
    }
  } catch {
    return { error: "登录服务暂时无法连接，请稍后重试" };
  }

  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
