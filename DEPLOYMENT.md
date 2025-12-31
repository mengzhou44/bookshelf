# Deployment Guide - Vercel

This guide covers deploying the Bookshelf app to Vercel.

## Architecture

- **Frontend**: Deploy to Vercel (React + Vite)
- **Backend**: Deploy separately (Render, Fly.io, or Railway)
- **Database**: SQLite (embedded, no separate service needed)

## Step 1: Deploy Backend First

### Option 1: Render (Recommended - Free Tier)

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

   (Update `FRONTEND_URL` after deploying frontend)

4. **Deploy**

   - Click "Create Web Service"
   - Render will build and deploy
   - Get your backend URL: `https://your-backend.onrender.com`

5. **Test Backend**
   - Visit: `https://your-backend.onrender.com/api/books`
   - Should return `[]` (empty array)

**Note**: Free tier services sleep after inactivity. First request after sleep takes ~30 seconds.

### Option 2: Fly.io (Free Tier)

1. **Install Fly CLI**:

   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login and Deploy**:

   ```bash
   fly auth login
   cd backend
   fly launch
   ```

3. **Create Volume** (for persistent storage):

   ```bash
   fly volumes create bookshelf_data --size 1
   ```

4. **Set Environment Variables**:

   ```bash
   fly secrets set DB_PATH=/data/bookshelf.db NODE_ENV=production PORT=3001
   ```

5. **Update fly.toml** to mount volume:

   ```toml
   [mounts]
     source = "bookshelf_data"
     destination = "/data"
   ```

6. **Deploy**:
   ```bash
   fly deploy
   ```

See `backend/DEPLOYMENT.md` for detailed backend deployment instructions.

---

## Step 2: Deploy Frontend to Vercel

### Prerequisites

- Backend deployed and running
- Backend URL (e.g., `https://your-backend.onrender.com`)

### Deployment Steps

1. **Install Vercel CLI** (if not already installed):

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Navigate to Frontend Directory**:

   ```bash
   cd frontend
   ```

4. **Deploy to Vercel**:

   ```bash
   vercel
   ```

   - Follow the prompts
   - Link to existing project or create new
   - Confirm settings

5. **Set Environment Variable**:

   - Go to Vercel Dashboard: https://vercel.com/dashboard
   - Select your project
   - Go to **Settings** → **Environment Variables**
   - Add:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://your-backend.onrender.com/api`
     - **Environment**: Production, Preview, Development (select all)
   - Click **Save**

6. **Redeploy** (to apply environment variable):
   ```bash
   vercel --prod
   ```
   Or trigger redeploy from Vercel dashboard

### Alternative: Deploy via Vercel Dashboard

1. **Go to https://vercel.com**
2. **Click "Add New..." → "Project"**
3. **Import Git Repository**:
   - Connect your GitHub account
   - Select your `bookshelf` repository
4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Add Environment Variable**:
   - **VITE_API_URL** = `https://your-backend.onrender.com/api`
6. **Deploy**

---

## Step 3: Update Backend CORS

After deploying frontend, update backend `FRONTEND_URL`:

1. **Go to Render/Fly.io dashboard**
2. **Update Environment Variable**:
   - `FRONTEND_URL` = `https://your-frontend.vercel.app`
3. **Redeploy backend** (or it will auto-redeploy)

---

## Environment Variables

### Frontend (Vercel)

- `VITE_API_URL` - Backend API URL (e.g., `https://your-backend.onrender.com/api`)

### Backend (Render/Fly.io)

- `NODE_ENV` - `production`
- `PORT` - `3001`
- `DB_PATH` - SQLite database file path
- `FRONTEND_URL` - Your Vercel frontend URL (for CORS)

---

## Testing Deployment

1. **Test Backend**:

   ```bash
   curl https://your-backend.onrender.com/api/books
   ```

   Should return: `[]`

2. **Test Frontend**:

   - Visit: `https://your-frontend.vercel.app`
   - Should load the app
   - Try adding a book

3. **Check Browser Console**:
   - Open DevTools (F12)
   - Check for any API errors
   - Verify API calls are going to correct backend URL

---

## Troubleshooting

### Frontend Can't Connect to Backend

1. **Check `VITE_API_URL`**:

   - Verify it's set in Vercel dashboard
   - Format: `https://your-backend.onrender.com/api` (no trailing slash)
   - Redeploy frontend after adding

2. **Check CORS**:

   - Verify `FRONTEND_URL` is set in backend
   - Should match your Vercel domain exactly

3. **Check Backend Logs**:
   - Render: Go to service → Logs
   - Fly.io: `fly logs`

### Backend Not Responding

1. **Check if service is awake**:

   - Free tier services sleep after inactivity
   - First request takes ~30 seconds
   - Subsequent requests are fast

2. **Check deployment logs**:
   - Look for errors in build/start process
   - Verify database file is created

### Database Issues

1. **SQLite file not persisting**:

   - Free tier: File may be lost on restart
   - Solution: Use persistent volumes (paid plans) or backup strategy

2. **Database locked**:
   - Normal for SQLite (handles one write at a time)
   - For high traffic, consider migrating to MySQL/PostgreSQL

---

## Cost Summary

### Free Tier (MVP)

- **Frontend (Vercel)**: Free
- **Backend (Render)**: Free (spins down after inactivity)
- **Database (SQLite)**: Free (embedded)
- **Total**: $0/month

### Production (Always On)

- **Frontend (Vercel)**: Free (or Pro $20/month)
- **Backend (Render)**: $7/month (Starter plan)
- **Database (SQLite)**: Free (embedded)
- **Total**: ~$7/month

---

## Quick Deploy Commands

### Backend (Render)

```bash
# Deploy via Render dashboard (GitHub integration)
# Or use Render API/CLI
```

### Frontend (Vercel)

```bash
cd frontend
vercel login
vercel
vercel --prod  # Production deployment
```

---

## Recommended Setup

For MVP:

- ✅ **Frontend**: Vercel (free, great for React)
- ✅ **Backend**: Render (free tier, easy setup)
- ✅ **Database**: SQLite (embedded, free)

This gives you:

- ✅ Fast frontend deployment
- ✅ Simple backend deployment
- ✅ No database service needed
- ✅ Free tier available

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Get backend URL
3. ✅ Deploy frontend to Vercel
4. ✅ Set `VITE_API_URL` in Vercel
5. ✅ Update `FRONTEND_URL` in backend
6. ✅ Test the full stack

Your Bookshelf app is now live! 🎉
