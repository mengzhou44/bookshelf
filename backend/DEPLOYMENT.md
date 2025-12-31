# Backend Deployment Guide

This guide covers deploying the Bookshelf backend with MySQL database.

## Option 1: Railway (Recommended - Easiest)

Railway makes it easy to deploy both backend and MySQL together.

### Step 1: Prepare Your Repository

1. **Ensure your backend code is in a GitHub repository**
2. **Make sure `backend/` folder is at the root of your repo**

### Step 2: Deploy to Railway

1. **Go to https://railway.app and sign up/login**

2. **Create New Project**

   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add MySQL Database**

   - In your project, click "+ New"
   - Select "Database" → "Add MySQL"
   - Railway will automatically create a MySQL database
   - **Note the connection details** (you'll need them)

4. **Deploy Backend Service**

   - Click "+ New" → "GitHub Repo"
   - Select your repository again
   - Railway will detect it's a Node.js project
   - **Set Root Directory**: `backend`
   - **Set Build Command**: `npm run build`
   - **Set Start Command**: `npm start`

5. **Configure Environment Variables**

   - Click on your backend service
   - Go to "Variables" tab
   - Add these variables (get values from MySQL service):
     ```
     DB_HOST=<from MySQL service>
     DB_PORT=3306
     DB_USER=<from MySQL service>
     DB_PASSWORD=<from MySQL service>
     DB_NAME=railway
     PORT=3001
     NODE_ENV=production
     FRONTEND_URL=https://your-frontend.vercel.app
     ```
   - Railway provides these in the MySQL service's "Variables" tab

6. **Link MySQL to Backend**

   - In backend service → "Variables" tab
   - Click "Reference Variable"
   - Select MySQL service variables (Railway will auto-link them)

7. **Deploy**

   - Railway will automatically deploy when you push to GitHub
   - Or click "Deploy" button
   - Wait for deployment to complete

8. **Get Your Backend URL**
   - Once deployed, Railway provides a URL like: `https://your-backend.railway.app`
   - This is your backend API URL

### Step 3: Test Your Backend

1. **Check deployment logs** in Railway dashboard
2. **Test API endpoint**: `https://your-backend.railway.app/api/books`
3. **Database is automatically initialized** on first start (creates `books` table)

---

## Option 2: Render

### Step 1: Deploy MySQL Database

1. **Go to https://render.com and sign up/login**

2. **Create MySQL Database**
   - Click "New +" → "PostgreSQL" (Render uses PostgreSQL, but we can use MySQL)
   - Actually, Render offers **MySQL** as well
   - Select "MySQL"
   - Choose plan (Free tier available)
   - Note connection details

### Step 2: Deploy Backend

1. **Create Web Service**

   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `bookshelf-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm run build`
     - **Start Command**: `npm start`

2. **Add Environment Variables**

   ```
   DB_HOST=<from MySQL database>
   DB_PORT=3306
   DB_USER=<from MySQL database>
   DB_PASSWORD=<from MySQL database>
   DB_NAME=<from MySQL database>
   PORT=3001
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

3. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy
   - Get your backend URL: `https://your-backend.onrender.com`

---

## Option 3: Fly.io

1. **Install Fly CLI**: `curl -L https://fly.io/install.sh | sh`

2. **Login**: `fly auth login`

3. **Create App**: `fly launch` (in backend directory)

4. **Add MySQL**: Use Fly's MySQL addon or external service

5. **Set Secrets**:

   ```bash
   fly secrets set DB_HOST=... DB_PORT=3306 DB_USER=... DB_PASSWORD=... DB_NAME=... NODE_ENV=production
   ```

6. **Deploy**: `fly deploy`

---

## Environment Variables Summary

Required environment variables for backend:

```bash
# Database
DB_HOST=your-mysql-host
DB_PORT=3306
DB_USER=your-mysql-user
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name

# Server
PORT=3001
NODE_ENV=production

# CORS (for frontend)
FRONTEND_URL=https://your-frontend.vercel.app
```

---

## Database Initialization

The backend automatically creates the `books` table on first startup via `initDatabase()` function in `utils/connection.ts`.

If you need to manually initialize:

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

1. **Database Connection Failed**

   - Verify all DB\_\* environment variables are correct
   - Check if MySQL service is running
   - Verify network connectivity

2. **Table Creation Failed**

   - Check database permissions
   - Verify user has CREATE TABLE permission

3. **CORS Errors**

   - Ensure `FRONTEND_URL` is set correctly
   - Check backend CORS configuration

4. **Build Errors**
   - Ensure `npm run build` completes successfully
   - Check TypeScript compilation errors

---

## Next Steps

After backend is deployed:

1. **Get your backend URL** (e.g., `https://your-backend.railway.app`)
2. **Test the API** to ensure it's working
3. **Deploy frontend** to Vercel (see main DEPLOYMENT.md)
4. **Set `VITE_API_URL`** in Vercel to point to your backend

---

## Recommended: Railway

For this project, **Railway is recommended** because:

- ✅ Easy MySQL setup (one click)
- ✅ Automatic environment variable linking
- ✅ Free tier available
- ✅ Simple deployment process
- ✅ Good for Node.js/Express apps
