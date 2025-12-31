# 📚 Bookshelf - Reading Tracker MVP

A minimal, clean, and responsive web application for tracking your books and reading status. Built with React, TypeScript, and Node.js.

## Features

- ✅ Add books with title, author, status, and notes
- ✅ View books in a responsive card layout
- ✅ Filter books by status (All / Read / Reading / Not Read)
- ✅ Update reading status
- ✅ Add and edit notes for each book
- ✅ Delete books
- ✅ Color-coded status badges (Read → Green, Reading → Blue, Not Read → Gray)
- ✅ Clean, minimal UI with Tailwind CSS
- ✅ MySQL database with Docker Compose

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript
- SQLite (Embedded database)

## Project Structure

```
bookshelf/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── App.tsx
│   │   ├── api.ts
│   │   └── types.ts
│   └── package.json
├── backend/           # Express API server
│   ├── src/
│   │   ├── server.ts
│   │   ├── db.ts
│   │   └── types.ts
│   └── package.json
├── docker-compose.yml # MySQL database configuration
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bookshelf
   ```

2. **Set up backend environment**
   ```bash
   cd backend
   cp .env.example .env
   ```
   Edit `.env` if you need to change database credentials (defaults match docker-compose.yml).

4. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

5. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Running Locally

1. **Start the backend server**
   ```bash
   cd backend
   npm run build
   npm start
   ```
   The backend will run on `http://localhost:3001` and automatically initialize the database schema.

   For development with auto-reload:
   ```bash
   npm run dev
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

3. **Open your browser**
   Navigate to `http://localhost:5173` to see the application.

### Database Management

**SQLite database file location:**
- Local: `backend/data/bookshelf.db`
- Created automatically on first run

**Backup database:**
```bash
cp backend/data/bookshelf.db backend/data/bookshelf.db.backup
```

**View database:**
```bash
sqlite3 backend/data/bookshelf.db
.tables
SELECT * FROM books;
```

## API Endpoints

### GET `/api/books`
Get all books.

**Response:**
```json
[
  {
    "id": "1234567890",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "status": "Read",
    "notes": "A classic American novel",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### GET `/api/books/:id`
Get a single book by ID.

### POST `/api/books`
Create a new book.

**Request Body:**
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "status": "Not Read",
  "notes": "Optional notes"
}
```

### PUT `/api/books/:id`
Update a book.

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "Reading"
}
```

### DELETE `/api/books/:id`
Delete a book.

## Database Schema

The SQLite database automatically creates a `books` table with the following structure:

- `id` (TEXT) - Primary key
- `title` (TEXT) - Book title
- `author` (TEXT) - Book author
- `status` (TEXT) - Reading status: 'Read', 'Reading', 'Not Read'
- `notes` (TEXT) - Optional notes
- `createdAt` (TEXT) - Creation timestamp (ISO string)
- `updatedAt` (TEXT) - Last update timestamp (ISO string)

## Deployment to Vercel

### Frontend Deployment

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   - Install Vercel CLI: `npm i -g vercel`
   - Navigate to the frontend directory: `cd frontend`
   - Run: `vercel`
   - Follow the prompts

3. **Set environment variable**
   - In Vercel dashboard, go to your project settings
   - Add environment variable: `VITE_API_URL` = `https://your-backend-url.com/api`

### Backend Deployment

For the backend, you have a few options:

**Option 1: Deploy to Render (Recommended)**
- Deploy backend to Render (free tier available)
- SQLite database file is included with backend
- No separate database service needed
- Update `VITE_API_URL` in frontend to point to your backend URL

**Option 2: Deploy to Fly.io**
- Deploy backend to Fly.io (free tier available)
- Use persistent volume for database file
- Simple and reliable

**Option 3: Deploy to Railway**
- Deploy backend to Railway
- Use persistent volume for database file
- Good for production

### Database Deployment

SQLite is embedded - no separate database deployment needed!

- ✅ Database file is included with backend
- ✅ No database service required
- ✅ Free forever
- ✅ Perfect for MVP

For production with high traffic, consider migrating to MySQL/PostgreSQL later.

## Development

### Backend Development
- Source files are in `backend/src/`
- Compiled output goes to `backend/dist/`
- Run `npm run build` to compile TypeScript
- Run `npm run dev` for watch mode

### Frontend Development
- Source files are in `frontend/src/`
- Vite handles hot module replacement automatically
- The frontend proxies API requests to `http://localhost:3001` in development

## License

ISC

## Contributing

Feel free to submit issues and enhancement requests!
