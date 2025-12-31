# Backend Deployment Guide

This guide covers deploying the Bookshelf backend with SQLite database.

## SQLite Benefits

✅ **No separate database service needed** - embedded database  
✅ **Zero configuration** - works out of the box  
✅ **Free forever** - no database hosting costs  
✅ **Simple deployment** - just deploy the backend  
✅ **Perfect for MVP** - fast and reliable

## Option 1: Render (Recommended - Free Tier Available)

Render offers free tier hosting perfect for MVP deployment.

### Quick Setup (Using render.yaml)

Since you have `render.yaml` in the `backend/` folder, you can use it as a reference for manual setup. The configuration is already defined, so you just need to copy the settings.

**Note**: Keeping `render.yaml` in `backend/` is good practice since it's backend-specific. Render Blueprints require it at the root, but manual setup is just as easy and keeps your repo organized.

#### Step 1: Deploy to Render

1. **Go to https://render.com and sign up/login**

2. **Create Web Service**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure (these match your `render.yaml`):
     - **Name**: `bookshelf-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`
     - **Plan**: **Free** (spins down after 15 min inactivity)

3. **Add Environment Variables** (from your render.yaml)

   ```
   NODE_ENV=production
   PORT=3001
   DB_PATH=/opt/render/project/src/data/bookshelf.db
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy
   - Get your backend URL: `https://your-backend.onrender.com`

**That's it!** Your `render.yaml` serves as documentation and ensures consistent configuration.

### Alternative: Automatic Blueprint Setup

If you prefer automatic setup, you can move `render.yaml` to the root and use Render Blueprints. However, keeping it in `backend/` is better for organization since it's backend-specific.

1. **Go to https://render.com and sign up/login**

2. **Create Web Service**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `bookshelf-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`
     - **Plan**: **Free** (spins down after 15 min inactivity)

3. **Add Environment Variables**

   ```
   NODE_ENV=production
   PORT=3001
   DB_PATH=/opt/render/project/src/data/bookshelf.db
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy
   - Get your backend URL: `https://your-backend.onrender.com`

### Step 3: Test Your Backend

1. **Check deployment logs** in Render dashboard
2. **Test API endpoint**: `https://your-backend.onrender.com/api/books`
3. **Database is automatically initialized** on first start (creates `books` table)

**Note**: Free tier services sleep after inactivity. First request after sleep takes ~30 seconds.

---

## Option 2: Fly.io (Free Tier Available)

Fly.io offers a generous free tier with persistent storage.

### Step 1: Install Fly CLI

```bash
curl -L https://fly.io/install.sh | sh
# Or on Windows: iwr https://fly.io/install.ps1 -useb | iex
```

### Step 2: Login and Setup

```bash
fly auth login
cd backend
fly launch
```

### Step 3: Create Volume for Database

```bash
fly volumes create bookshelf_data --size 1
```

### Step 4: Update fly.toml

Add volume mount:

```toml
[mounts]
  source = "bookshelf_data"
  destination = "/data"
```

### Step 5: Set Environment Variables

```bash
fly secrets set DB_PATH=/data/bookshelf.db NODE_ENV=production PORT=3001
```

### Step 6: Deploy

```bash
fly deploy
```

---

## Option 3: Railway (Paid)

Railway supports SQLite with persistent volumes.

1. **Deploy Backend Service**

   - New Project → Deploy from GitHub
   - Root Directory: `backend`
   - Build: `npm run build`
   - Start: `npm start`

2. **Add Volume** (for persistent storage)

   - Add volume in Railway dashboard
   - Mount to `/data`

3. **Set Environment Variables**
   ```
   DB_PATH=/data/bookshelf.db
   NODE_ENV=production
   PORT=3001
   ```

---

## Environment Variables Summary

Required environment variables for backend:

```bash
# Database (SQLite)
DB_PATH=./data/bookshelf.db  # Local development
# Or for production: /opt/render/project/src/data/bookshelf.db

# Server
PORT=3001
NODE_ENV=production

# CORS (for frontend)
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Database Initialization

The backend automatically creates the `books` table on first startup via `initDatabase()` function in `utils/connection.ts`.

The database file is created at the path specified in `DB_PATH` environment variable.

---

## Testing After Deployment

1. **Health Check**: `GET https://your-backend-url.com/api/books`

   - Should return `[]` (empty array) if no books

2. **Create Book**: `POST https://your-backend-url.com/api/books`

   ```json
   {
     "title": "Test Book",
     "author": "Test Author",
     "status": "Not Read",
     "notes": ""
   }
   ```

3. **Check Logs**: Monitor deployment logs for any errors

---

## Troubleshooting

1. **Database File Not Found**

   - Verify `DB_PATH` environment variable is set correctly
   - Check if directory exists (backend creates it automatically)
   - Verify file permissions

2. **Database Locked Error**

   - SQLite handles one write at a time (normal for low-traffic)
   - This is expected behavior for SQLite

3. **Data Lost After Restart**

   - Free tier services may not persist files
   - Use persistent volumes (paid plans) or implement backup strategy

4. **CORS Errors**

   - Ensure `FRONTEND_URL` is set correctly
   - Check backend CORS configuration

5. **Build Errors**
   - Ensure `npm run build` completes successfully
   - Check TypeScript compilation errors

---

## File Persistence

### Free Tier Services

- Database file persists during service lifetime
- May be lost on service restart/redeploy
- Perfect for MVP/testing

### Production (Paid Plans)

- Use persistent volumes for guaranteed file persistence
- Database file survives restarts and redeployments
- Recommended for production

---

## Backup Strategy

Since SQLite is file-based:

1. **Regular Backups**: Copy `bookshelf.db` file
2. **Export Data**: Use SQLite tools to export
3. **Version Control**: Don't commit `.db` files (already in .gitignore)

### Backup Commands

```bash
# Backup database
cp backend/data/bookshelf.db backend/data/bookshelf.db.backup

# Export to SQL
sqlite3 backend/data/bookshelf.db .dump > backup.sql

# Restore from SQL
sqlite3 backend/data/bookshelf.db < backup.sql
```

---

## Next Steps

After backend is deployed:

1. **Get your backend URL** (e.g., `https://your-backend.onrender.com`)
2. **Test the API** to ensure it's working
3. **Deploy frontend** to Vercel (see main DEPLOYMENT.md)
4. **Set `VITE_API_URL`** in Vercel to point to your backend

---

## Recommended: Render

For this project, **Render is recommended** because:

- ✅ Free tier available (perfect for MVP)
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ Simple setup (no database service needed)
- ✅ Good for Node.js/Express apps
- ✅ SQLite works perfectly on free tier
