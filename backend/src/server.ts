import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { initDatabase } from './utils/connection.js';
import bookRoutes from './modules/book/book.routes.js';

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/books', bookRoutes);

// Initialize database and start server
const startServer = async () => {
    try {
        await initDatabase();
        app.listen(config.server.port, () => {
            console.log(`Server is running on http://localhost:${config.server.port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

