import fs from "fs";
import { pool } from "../database/pool.ts";
import path from "path";

const MIGRATIONS_FOLDER = "./database/migrations";

async function verifyIfMigrationsTableExists(tableName: string = "migrations") {
  const sql = `SELECT COUNT(*) AS table_exists
                 FROM information_schema.TABLES
                 WHERE TABLE_SCHEMA = DATABASE()
                    AND TABLE_TYPE = 'BASE TABLE'
                    AND TABLE_NAME = ?;
               `;

  const [rows] = await pool.query(sql, [tableName]);

  return rows[0]?.table_exists > 0;
}

async function createMigrationsTable() {
  const migrationsTableExists = await verifyIfMigrationsTableExists();

  if (!migrationsTableExists) {
    const sql = `CREATE TABLE migrations(
            filename VARCHAR(255) NOT NULL PRIMARY KEY,
            ran_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
        )`;

    await pool.query(sql);
    console.log("'Migrations' table created successfuly");
  }
}

function readMySQLFiles() {
  const allSqlFiles = fs
    .readdirSync(MIGRATIONS_FOLDER)
    .filter((file) => file.endsWith(".sql"));

  return allSqlFiles;
}

async function addMigrationToDatabase(file: any) {
  const filename = path.basename(file);
  await pool.query(`INSERT INTO migrations (filename) VALUES (?)`, [filename]);
}

/* -- MAIN FUNCTIONS -- */
export async function runAllMigrations() {
  await createMigrationsTable();

  try {
    const allSqlFiles = readMySQLFiles();
    if (!allSqlFiles) return;

    for (const file of allSqlFiles) {
      const sql = fs.readFileSync(`${MIGRATIONS_FOLDER}/${file}`, "utf-8");
      console.log(`Running migration ${file}`);
      await pool.query(sql);

      await addMigrationToDatabase(file);
    }

    console.log("All migrations ran successfully!");
  } catch (err) {
    console.error("Error running migrations: ", err);
  }
}

export async function runSpecificMigration(migration: string) {
  await createMigrationsTable();

  const FILE = `${MIGRATIONS_FOLDER}/${migration}`;

  try {
    let isSqlFile = FILE.endsWith(".sql");

    if (!isSqlFile) {
      console.log("That file is not an SQL file.");
      return;
    }

    const sql = fs.readFileSync(FILE, "utf-8");
    console.log(`Running migration: ${FILE}`);
    await pool.query(sql);

    await addMigrationToDatabase(FILE);
  } catch (err) {
    console.error("Error running this migration: ", err);
  }
}

async function main() {
  const [, , command, migration] = process.argv;

  switch (command) {
    case "all":
      await runAllMigrations();
      break;
    case "one":
      if (!migration) return;
      await runSpecificMigration(migration);
      break;
    default:
      console.log("Usage:");
      console.log("  npm run migrate:all");
      console.log(
        "  npm run migrate:one -- 003_add_age_row_to_tests_table.sql",
      );
  }

  process.exit(1);
}

main().catch(console.error);
