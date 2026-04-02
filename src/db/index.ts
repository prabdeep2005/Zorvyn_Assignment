import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";

const { Pool } = pkg;

import * as schema from "./schema.ts";

// Core database connection logic
const connectionString =
	process.env.DATABASE_URL ||
	"postgres://user:password@localhost:5432/finance_db";

const pool = new Pool({
	connectionString,
});

export const db = drizzle(pool, { schema });
console.log("Database Connection Initialized");
