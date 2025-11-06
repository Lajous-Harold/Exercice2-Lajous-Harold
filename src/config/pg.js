import pg from "pg";
const { Pool } = pg;

let pool;

export function getPg() {
  if (pool) return pool;
  const url = process.env.POSTGRES_URL;
  if (!url) throw new Error("POSTGRES_URL is required for DB_CLIENT=postgres");
  pool = new Pool({ connectionString: url });
  return pool;
}

export async function initPg() {
  const p = getPg();
  // Extension uuid + table
  await p.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  await p.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ
    );
  `);
}
