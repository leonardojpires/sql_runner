import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export function createPool(database?: string) {
    return mysql.createPool({
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        ...(database && { database }),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    })
}

export const pool = createPool(process.env.DB_NAME);
