# Deployment Guide - Vercel

This guide covers deploying the Bookshelf app to Vercel.

## Architecture

- **Frontend**: Deploy to Vercel (React + Vite)
- **Backend**: Deploy separately (Railway, Render, or Vercel Serverless Functions)
- **Database**: MySQL (Docker Compose locally, managed service in production)

## Option 1: Frontend on Vercel + Backend on Railway/Render (Recommended)

### Step 1: Deploy Backend

#### Using Railway (Recommended)

1. **Create Railway account** at https://railway.app
2. **Create new project** → "Deploy from GitHub repo"
3. **Add MySQL service**:
   - Click "+ New" → "Database" → "MySQL"
   - Railway will provide connection details
4. **Deploy backend**:
   - Click "+ New" → "GitHub Repo" → Select your backend
   - Set root directory: `backend`
   - Add environment variables:
     ```
     DB_HOST=<railway-mysql-host>
     DB_PORT=3306
     DB_USER=<railway-mysql-user>
     DB_PASSWORD=<railway-mysql-password>
     DB_NAME=railway
     PORT=3001
     NODE_ENV=production
     ```
   - Set build command: `npm run build`
   - Set start command: `npm start`
5. **Get backend URL** (e.g., `https://your-backend.railway.app`)

#### Using Render

1. **Create Render account** at https://render.com
2. **Create Web Service**:
   - Connect GitHub repo
   - Root directory: `backend`
   - Build command: `npm run build`
   - Start command: `npm start`
   - Add environment variables (same as Railway)
3. **Create MySQL database**:
   - New → PostgreSQL/MySQL → MySQL
   - Use provided connection details
4. **Get backend URL** (e.g., `https://your-backend.onrender.com`)

### Step 2: Deploy Frontend to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy from frontend directory**:
   ```bash
   cd frontend
   vercel
   ```

3. **Set environment variables** in Vercel dashboard:
   - Go to your project → Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

4. **Redeploy** after adding environment variables:
   ```bash
   vercel --prod
   ```

## Option 2: Full Stack on Vercel (Serverless Functions)

### Convert Backend to Vercel Serverless Functions

1. **Create API directory in frontend**:
   ```bash
   mkdir -p frontend/api/books
   ```

2. **Convert routes to serverless functions**:
   - Each route becomes a file in `frontend/api/`
   - Example: `frontend/api/books/index.ts` for GET `/api/books`
   - Example: `frontend/api/books/[id].ts` for GET `/api/books/:id`

3. **Deploy to Vercel**:
   ```bash
   cd frontend
   vercel
   ```

### Example Serverless Function Structure

```
frontend/
├── api/
│   └── books/
│       ├── index.ts          # GET, POST /api/books
│       └── [id].ts            # GET, PUT, DELETE /api/books/:id
├── src/
└── ...
```

## Option 3: Use Vercel with External Backend

1. **Deploy frontend to Vercel** (same as Option 1, Step 2)
2. **Deploy backend separately** (Railway/Render)
3. **Configure CORS** in backend to allow Vercel domain
4. **Set `VITE_API_URL`** in Vercel environment variables

## Environment Variables

### Frontend (Vercel)
- `VITE_API_URL` - Backend API URL (e.g., `https://your-backend.railway.app/api`)

### Backend (Railway/Render)
- `DB_HOST` - MySQL host
- `DB_PORT` - MySQL port (usually 3306)
- `DB_USER` - MySQL username
- `DB_PASSWORD` - MySQL password
- `DB_NAME` - MySQL database name
- `PORT` - Backend server port
- `NODE_ENV` - `production`

## Database Migration

After deploying, you need to initialize the database schema:

1. **Connect to production database** (via DBeaver or CLI)
2. **Run the schema creation** (happens automatically on first backend start)
3. **Or manually run**:
   ```sql
   CREATE TABLE IF NOT EXISTS books (
     id VARCHAR(255) PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     author VARCHAR(255) NOT NULL,
     status ENUM('Read', 'Reading', 'Not Read') NOT NULL,
     notes TEXT,
     createdAt DATETIME NOT NULL,
     updatedAt DATETIME NOT NULL
   );
   ```

## CORS Configuration

If frontend and backend are on different domains, update backend CORS:

```typescript
// backend/src/server.ts
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

## Quick Deploy Commands

### Frontend (Vercel)
```bash
cd frontend
vercel login
vercel
vercel --prod  # Production deployment
```

### Backend (Railway)
```bash
# Connect via Railway dashboard or CLI
railway login
railway init
railway up
```

## Troubleshooting

1. **API calls failing**: Check `VITE_API_URL` is set correctly
2. **CORS errors**: Update backend CORS to include Vercel domain
3. **Database connection**: Verify environment variables in backend
4. **Build errors**: Check Node.js version compatibility

## Recommended Setup

For MVP, I recommend **Option 1**:
- Frontend: Vercel (free tier, great for React)
- Backend: Railway (free tier, easy MySQL setup)
- Database: Railway MySQL (included)

This gives you:
- ✅ Fast frontend deployment
- ✅ Easy backend deployment
- ✅ Managed database
- ✅ Free tier available

