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
- JSON file storage

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
│   │   └── types.ts
│   └── package.json
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

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
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
   The backend will run on `http://localhost:3001`

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

**Option 1: Deploy backend separately (Recommended)**
- Deploy backend to a service like Railway, Render, or Heroku
- Update `VITE_API_URL` in frontend to point to your backend URL

**Option 2: Use Vercel Serverless Functions**
- Create `api/` directory in frontend
- Convert Express routes to Vercel serverless functions
- Deploy everything together on Vercel

**Option 3: Use Vercel with external backend**
- Keep backend on a separate service
- Configure CORS to allow frontend domain

### Example: Deploying Backend to Railway

1. Create a `railway.json` or use Railway's dashboard
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variable: `PORT=3001`
5. Deploy and get your backend URL
6. Update frontend `VITE_API_URL` to your Railway backend URL

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

