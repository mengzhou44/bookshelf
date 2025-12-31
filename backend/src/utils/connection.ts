import Database from 'better-sqlite3';
import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SQLite database file path
const dbPath = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'bookshelf.db');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db: Database.Database = new Database(dbPath);

// Enable foreign keys and other SQLite optimizations
db.pragma('journal_mode = WAL'); // Write-Ahead Logging for better concurrency
db.pragma('foreign_keys = ON');

// Initialize database schema
export const initDatabase = async (): Promise<void> => {
    try {
        db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        status TEXT NOT NULL CHECK(status IN ('Read', 'Reading', 'Not Read')),
        notes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
        console.log('Database schema initialized successfully');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    }
};

export default db;
