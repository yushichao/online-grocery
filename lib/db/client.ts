import "server-only";
import postgres from "postgres";

const globalDatabase = globalThis as typeof globalThis & {
  onlineGrocerySql?: ReturnType<typeof postgres>;
};

let database = globalDatabase.onlineGrocerySql;

export function getSql(): ReturnType<typeof postgres> {
  if (database) return database;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
  }

  database = postgres(databaseUrl, {
    max: 3,
    connect_timeout: 10,
    idle_timeout: 20,
    ssl: "require",
    prepare: false,
  });

  if (process.env.NODE_ENV !== "production") {
    globalDatabase.onlineGrocerySql = database;
  }

  return database;
}
