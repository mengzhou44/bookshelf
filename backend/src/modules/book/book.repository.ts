import { Book } from '../../types.js';
import db from '../../utils/connection.js';

// Book repository - handles all database operations
export const getAllBooks = async (): Promise<Book[]> => {
    try {
        const stmt = db.prepare('SELECT * FROM books ORDER BY createdAt DESC');
        const rows = stmt.all() as any[];
        return rows.map(row => ({
            id: row.id,
            title: row.title,
            author: row.author,
            status: row.status as Book['status'],
            notes: row.notes || '',
            createdAt: row.createdAt,
            updatedAt: row.updatedAt
        }));
    } catch (error) {
        console.error('Database error fetching books:', error);
        throw error;
    }
};

export const getBookById = async (id: string): Promise<Book | null> => {
    const row = db.prepare('SELECT * FROM books WHERE id = ?').get(id) as any;
    if (!row) return null;
    return {
        id: row.id,
        title: row.title,
        author: row.author,
        status: row.status as Book['status'],
        notes: row.notes || '',
        createdAt: row.createdAt,
        updatedAt: row.updatedAt
    };
};

export const createBook = async (book: Book): Promise<Book> => {
    try {
        const stmt = db.prepare(
            'INSERT INTO books (id, title, author, status, notes, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
        );
        stmt.run(
            book.id,
            book.title,
            book.author,
            book.status,
            book.notes || '',
            book.createdAt,
            book.updatedAt
        );
        return book;
    } catch (error) {
        console.error('Database error creating book:', error);
        throw error;
    }
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
    values.push(new Date().toISOString());
    values.push(id);

    db.prepare(`UPDATE books SET ${setClause.join(', ')} WHERE id = ?`).run(...values);

    return getBookById(id);
};

export const deleteBook = async (id: string): Promise<boolean> => {
    const result = db.prepare('DELETE FROM books WHERE id = ?').run(id);
    return result.changes > 0;
};
