import express, { Request, Response } from 'express';
import cors from 'cors';
import { Book, CreateBookRequest, UpdateBookRequest } from './types.js';
import { initDatabase, getAllBooks, getBookById, createBook, updateBook, deleteBook } from './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// GET /api/books - Get all books
app.get('/api/books', async (_req: Request, res: Response) => {
    try {
        const books = await getAllBooks();
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// GET /api/books/:id - Get a single book
app.get('/api/books/:id', async (req: Request, res: Response) => {
    try {
        const book = await getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ error: 'Failed to fetch book' });
    }
});

// POST /api/books - Create a new book
app.post('/api/books', async (req: Request<{}, Book, CreateBookRequest>, res: Response) => {
    try {
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

        await createBook(newBook);
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ error: 'Failed to create book' });
    }
});

// PUT /api/books/:id - Update a book
app.put('/api/books/:id', async (req: Request<{ id: string }, Book, UpdateBookRequest>, res: Response) => {
    try {
        const updatedBook = await updateBook(req.params.id, req.body);
        if (!updatedBook) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json(updatedBook);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ error: 'Failed to update book' });
    }
});

// DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const deleted = await deleteBook(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

// Initialize database and start server
const startServer = async () => {
    try {
        await initDatabase();
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

