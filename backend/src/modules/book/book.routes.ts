import { Router, Request, Response } from 'express';
import { Book, CreateBookRequest, UpdateBookRequest } from '../../types.js';
import * as bookService from './book.service.js';

const router = Router();

// GET /api/books - Get all books
router.get('/', async (_req: Request, res: Response) => {
    try {
        const books = await bookService.getAllBooks();
        res.json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: 'Failed to fetch books' });
    }
});

// GET /api/books/:id - Get a single book
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const book = await bookService.getBookById(req.params.id);
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
router.post('/', async (req: Request<{}, Book, CreateBookRequest>, res: Response) => {
    try {
        const newBook = await bookService.createBook(req.body);
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Error creating book:', error);
        if (error instanceof Error && error.message.includes('required')) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to create book' });
    }
});

// PUT /api/books/:id - Update a book
router.put('/:id', async (req: Request<{ id: string }, Book, UpdateBookRequest>, res: Response) => {
    try {
        const updatedBook = await bookService.updateBook(req.params.id, req.body);
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
router.delete('/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const deleted = await bookService.deleteBook(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ error: 'Failed to delete book' });
    }
});

export default router;

