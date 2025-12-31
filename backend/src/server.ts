import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { initDatabase } from './utils/connection.js';
import bookRoutes from './modules/book/book.routes.js';

const app = express();

// Middleware
// Allow CORS from frontend URL or localhost for development
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000'
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        console.log('CORS request from origin:', origin);
        console.log('FRONTEND_URL env var:', process.env.FRONTEND_URL);
        console.log('Allowed origins:', allowedOrigins);
        
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            console.log('No origin, allowing request');
            return callback(null, true);
        }
        
        // Check exact match first
        if (allowedOrigins.includes(origin)) {
            console.log('Origin allowed (exact match)');
            callback(null, true);
            return;
        }
        
        // For development, allow localhost
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            console.log('Localhost origin, allowing');
            callback(null, true);
            return;
        }
        
        // Allow Vercel preview deployments (they have different URLs)
        if (origin.includes('vercel.app')) {
            console.log('Vercel origin detected, allowing:', origin);
            callback(null, true);
            return;
        }
        
        console.log('Origin not allowed:', origin);
        callback(new Error('Not allowed by CORS'));
    },
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

