import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createMigration(name: string): Promise<void> {
    const currentDate = getCurrentDate();
    const filename = `${currentDate}_${name}.sql`; 
    const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
    const filePath = path.join(migrationsDir, filename);

    fs.mkdirSync(migrationsDir, { recursive: true });
    fs.writeFileSync(filePath, '-- Write your SQL queries here');
}

function getCurrentDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

async function main() {
    const [, , command, name] = process.argv;

    if (command !== 'create' || !name) {
        console.error('Usage: npm run create:migration create <name)');
        process.exit(1);
    }

    try {
        await createMigration(name);
        console.log(`Created migration: ${name}`);
        process.exit(0);
    } catch(err) {
        console.error('Failed to create migration.', err);
    }
}

main().catch(console.error);
