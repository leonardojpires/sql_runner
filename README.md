
# SQL Runner

A collection of scripts that brings Laravel-style database migrations system to Node.js and TypeScript enviornment.


## Project Goals

This project was created to simplify database interaction between Node.js and raw MySQL by managing SQL files through command-line scripts.
## Features

- Create migrations
- Run migrations
- Keep track of all ran migrations


# SQL Runner

A collection of scripts that brings Laravel-style database migrations system to Node.js and TypeScript enviornment, using MySQL.


## Project Goals

This project was created to simplify database interaction between Node.js and raw MySQL by managing SQL files through command-line scripts.
## Features

- Create migrations
- Run migrations
- Keep track of all ran migrations


## Project Structure

```text
run_sql/
├── database/
│   ├── migrations/
│   └── pool.ts
│
├── scripts/
│   ├── create_migration.ts
│   └── run_migrations.ts
├── .env
└── README.md
```

### Explaining Each File/Folder

**database/**: This is where database configuration is stored.
**migrations/**: Stores all migrations files.
**pool.ts**: Database configuration file.

**scripts/**: All database operation script files are stored here.
**create_migration.ts**: Creates a new migration (essentially a .sql).
**run_migration.ts**: This script has two function: one that runs all migrations and another that runs a specific migration.

## Migration System
Whenever a migration is ran, the 'migrations' table in the database stores its name, and everytime you ran a migration, the system checks if the migration has already been ran based on its name.

### RULES:
- Once a migration has been executed, it SHOULD NOT be modified an re-run.
- Any database change should be introduced through a new migration.
- When working with a team, all members should share the same migration files to ensure database consistency.
- This tool only supports raw MySQL.

## Usage and Configuration
If you want to use this scripts on your project, you must follow these instructions:

### Prerequisites
- Node.js v24.0+
- MySQL
- TypeScript
- MySQL2 Package
- dotenv Package
- ts-node Package

#### Commands
```
npm install typescript
```
```
npm install mysql2
```
```
npm install dotenv
```
```
npm install ts-node
```

### Getting Started
1. Create 'database/' and 'scripts/' folders in root folder of the project where you want to use these scripts
2. Inside 'database/', create a 'migrations/' folder and a 'pool.ts' file
3. Leave 'migrations/' empty
4. Inside 'pool.ts', add the following content:
```
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mydb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
```
(make sure to configure the .env file correctly with your database information, follow .env.example structure)\
5. Inside 'scripts/' folder, create 'create_migration.ts' and 'run_migrations.ts' file\
6. Copy and paste the contents from both scripts and paste them into the new files you just created, respectively
7. Add the following content to your package.json "scripts":
```
    "migrate:all": "ts-node ./scripts/run_migrations.ts all",
    "migrate:one": "ts-node ./scripts/run_migrations.ts one",
    "create:migration": "ts-node ./scripts/create_migration.ts"
```

### Usage
To use the database migration script, you can run the following commands:
```
npm run create:migration -- create <migration_name>: creates new migration with the specified name.

npm run migrate:all: runs all migrations.

npm run migrate:one <migration_name>.sql: runs a specific migration (don't forget to include .sql at the end).
```


## Future Improvements

- Command to run the last migration
- Migration rollback system
## License
This project is licensed under the [MIT](https://choosealicense.com/licenses/mit/) License.
