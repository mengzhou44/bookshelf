import mysql from 'mysql2/promise';
import { config } from '../config.js';

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: false,
  allowPublicKeyRetrieval: true
});

// Initialize database schema
export const initDatabase = async (): Promise<void> => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS books (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        author VARCHAR(255) NOT NULL,
        status ENUM('Read', 'Reading', 'Not Read') NOT NULL,
        notes TEXT,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL
      )
    `);
    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export default pool;

