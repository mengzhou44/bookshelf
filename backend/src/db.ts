import mysql from 'mysql2/promise';
import { Book } from './types.js';
import { config } from './config.js';

const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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

// Book operations
export const getAllBooks = async (): Promise<Book[]> => {
  const [rows] = await pool.execute<mysql.RowDataPacket[]>(
    'SELECT * FROM books ORDER BY createdAt DESC'
  );
  return rows.map(row => ({
    id: row.id,
    title: row.title,
    author: row.author,
    status: row.status as Book['status'],
    notes: row.notes || '',
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString()
  }));
};

export const getBookById = async (id: string): Promise<Book | null> => {
  const [rows] = await pool.execute<mysql.RowDataPacket[]>(
    'SELECT * FROM books WHERE id = ?',
    [id]
  );
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    status: row.status as Book['status'],
    notes: row.notes || '',
    createdAt: new Date(row.createdAt).toISOString(),
    updatedAt: new Date(row.updatedAt).toISOString()
  };
};

export const createBook = async (book: Book): Promise<Book> => {
  await pool.execute(
    'INSERT INTO books (id, title, author, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      book.id,
      book.title,
      book.author,
      book.status,
      book.notes || '',
      new Date(book.createdAt),
      new Date(book.updatedAt)
    ]
  );
  return book;
};

export const updateBook = async (id: string, updates: Partial<Book>): Promise<Book | null> => {
  const setClause: string[] = [];
  const values: any[] = [];

  if (updates.title) {
    setClause.push('title = ?');
    values.push(updates.title);
  }
  if (updates.author) {
    setClause.push('author = ?');
    values.push(updates.author);
  }
  if (updates.status) {
    setClause.push('status = ?');
    values.push(updates.status);
  }
  if (updates.notes !== undefined) {
    setClause.push('notes = ?');
    values.push(updates.notes);
  }

  if (setClause.length === 0) {
    return getBookById(id);
  }

  setClause.push('updatedAt = ?');
  values.push(new Date());
  values.push(id);

  await pool.execute(
    `UPDATE books SET ${setClause.join(', ')} WHERE id = ?`,
    values
  );

  return getBookById(id);
};

export const deleteBook = async (id: string): Promise<boolean> => {
  const [result] = await pool.execute<mysql.ResultSetHeader>(
    'DELETE FROM books WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

export default pool;

