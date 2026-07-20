import nextEnv from "@next/env";
import postgres from "postgres";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const email = process.argv[2]?.trim().toLowerCase();
const databaseUrl =
  process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL;

if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
  console.error("Usage: npm run db:make-admin -- admin@example.com");
  process.exit(1);
}

if (!databaseUrl) {
  console.error("MIGRATION_DATABASE_URL or DATABASE_URL is required");
  process.exit(1);
}

const sql = postgres(databaseUrl, {
  max: 1,
  ssl: "require",
  prepare: false,
});

try {
  const [user] = await sql`
    select id
    from auth.users
    where lower(email) = ${email}
    limit 1
  `;

  if (!user) {
    console.error(
      "Auth user not found. Create this email in Supabase Authentication > Users first.",
    );
    process.exitCode = 1;
  } else {
    await sql`
      insert into public.admin_profiles (id, role)
      values (${user.id}, 'admin')
      on conflict (id) do update set role = excluded.role
    `;
    console.log(`Admin access granted to ${email}`);
  }
} finally {
  await sql.end();
}
