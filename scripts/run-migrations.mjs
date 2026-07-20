import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import nextEnv from "@next/env";
import postgres from "postgres";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const databaseUrl = process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("MIGRATION_DATABASE_URL or DATABASE_URL is not configured");
}

const sql = postgres(databaseUrl, {
  max: 1,
  connect_timeout: 10,
  idle_timeout: 5,
  ssl: "require",
  prepare: false,
});

try {
  await sql`
    create table if not exists public.app_migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `;

  const migrationsDirectory = path.join(
    process.cwd(),
    "supabase",
    "migrations",
  );
  const migrationNames = (await readdir(migrationsDirectory))
    .filter((name) => name.endsWith(".sql"))
    .sort();

  for (const name of migrationNames) {
    const [existing] = await sql`
      select name from public.app_migrations where name = ${name}
    `;
    if (existing) {
      console.log(`skip ${name}`);
      continue;
    }

    const migration = await readFile(
      path.join(migrationsDirectory, name),
      "utf8",
    );
    await sql.begin(async (transaction) => {
      await transaction.unsafe(migration);
      await transaction`
        insert into public.app_migrations (name) values (${name})
      `;
    });
    console.log(`applied ${name}`);
  }
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error(`Migration failed: ${message}`);
  process.exitCode = 1;
} finally {
  await sql.end();
}
