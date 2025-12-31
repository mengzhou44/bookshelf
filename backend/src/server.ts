import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Book, CreateBookRequest, UpdateBookRequest } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, '..', 'data', 'books.json');

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize books.json if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read books
const readBooks = (): Book[] => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data) as Book[];
    } catch (error) {
        return [];
    }
};

// Helper function to write books
const writeBooks = (books: Book[]): void => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(books, null, 2));
};

// GET /api/books - Get all books
app.get('/api/books', (_req: Request, res: Response) => {
    const books = readBooks();
    res.json(books);
});

// GET /api/books/:id - Get a single book
app.get('/api/books/:id', (req: Request, res: Response) => {
    const books = readBooks();
    const book = books.find(b => b.id === req.params.id);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
});

// POST /api/books - Create a new book
app.post('/api/books', (req: Request<{}, Book, CreateBookRequest>, res: Response) => {
    const books = readBooks();
    const { title, author, status, notes } = req.body;

    if (!title || !author || !status) {
        return res.status(400).json({ error: 'Title, author, and status are required' });
    }

    const newBook: Book = {
        id: Date.now().toString(),
        title,
        author,
        status,
        notes: notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    books.push(newBook);
    writeBooks(books);
    res.status(201).json(newBook);
});

// PUT /api/books/:id - Update a book
app.put('/api/books/:id', (req: Request<{ id: string }, Book, UpdateBookRequest>, res: Response) => {
    const books = readBooks();
    const index = books.findIndex(b => b.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ error: 'Book not found' });
    }

    const { title, author, status, notes } = req.body;
    books[index] = {
        ...books[index],
        ...(title && { title }),
        ...(author && { author }),
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
        updatedAt: new Date().toISOString()
    };

    writeBooks(books);
    res.json(books[index]);
});

// DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', (req: Request<{ id: string }>, res: Response) => {
    const books = readBooks();
    const filteredBooks = books.filter(b => b.id !== req.params.id);

    if (books.length === filteredBooks.length) {
        return res.status(404).json({ error: 'Book not found' });
    }

    writeBooks(filteredBooks);
    res.json({ message: 'Book deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

