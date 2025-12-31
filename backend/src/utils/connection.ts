import mysql from 'mysql2/promise';
import { config } from '../config.js';

const poolConfig: mysql.PoolOptions = {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
};

// Only allow public key retrieval in development (for local MySQL connections)
// This is a security risk in production, so we only enable it locally
if (config.env === 'development') {
    (poolConfig as any).allowPublicKeyRetrieval = true;
}

const pool = mysql.createPool(poolConfig);

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

