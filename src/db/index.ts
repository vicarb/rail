import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";
import "dotenv/config";

const connectionString = process.env.DATABASE_URL!;

// Setup postgres connection
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
