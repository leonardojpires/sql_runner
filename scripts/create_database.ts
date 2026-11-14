import { createPool } from "../database/pool.ts";

const dbName = process.env.DB_NAME;

const adminPool = createPool();

const escapedName = `\`${dbName?.replace(/`/g, "``")}\``;

await adminPool.query(`CREATE DATABASE IF NOT EXISTS ${escapedName}`);
await adminPool.end();

console.log(`Created database: ${dbName}`);
