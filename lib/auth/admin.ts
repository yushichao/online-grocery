import "server-only";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db/client";
import { createClient } from "@/lib/supabase/server";

export async function isAdminUser(userId: string): Promise<boolean> {
  const [profile] = await sql`
    select id from public.admin_profiles
    where id = ${userId} and role = 'admin'
  `;
  return Boolean(profile);
}

export async function getAdminUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (typeof userId !== "string") return null;
  return (await isAdminUser(userId)) ? userId : null;
}

export async function requireAdmin(): Promise<string> {
  const userId = await getAdminUserId();
  if (!userId) redirect("/admin/login");
  return userId;
}
