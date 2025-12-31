# Free Deployment Options for Bookshelf Backend

Since Railway trial expired and PlanetScale requires paid plan, here are **truly free** alternatives:

## Option 1: Render (Free Tier) - RECOMMENDED

**Render offers both backend AND MySQL on free tier!**

### Backend + MySQL on Render (100% Free)

1. **Sign up at https://render.com**

2. **Create MySQL Database (Free)**
   - New + → MySQL
   - Name: `bookshelf-db`
   - Plan: **Free** (90 days free, then $7/month)
   - Note: Free tier sleeps after 90 days of inactivity
   - Get connection details

3. **Deploy Backend (Free)**
   - New + → Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build: `npm run build`
   - Start: `npm start`
   - Plan: **Free** (spins down after 15 min inactivity)
   - Add environment variables from MySQL service

**Limitations:**
- ⚠️ Services sleep after inactivity (free tier)
- ⚠️ First request after sleep takes ~30 seconds
- ✅ Perfect for MVP/demo
- ✅ Can upgrade later if needed

---

## Option 2: Fly.io (Free Tier) + Free MySQL

### Backend on Fly.io + External Free MySQL

**Fly.io Backend:**
- Free tier: 3 shared VMs
- 160GB outbound data/month
- Good for backend hosting

**Free MySQL Options:**

1. **Aiven MySQL** (Free Trial)
   - https://aiven.io
   - Free trial: 30 days
   - Then convert to free tier (limited)

2. **Supabase** (PostgreSQL - Free)
   - https://supabase.com
   - Free tier: 500MB database
   - PostgreSQL (not MySQL, but similar)
   - Would need to convert queries

3. **Neon** (PostgreSQL - Free)
   - https://neon.tech
   - Free tier: 0.5GB storage
   - PostgreSQL (would need conversion)

---

## Option 3: MongoDB Atlas (Free) + Convert to MongoDB

If you're open to using MongoDB instead of MySQL:

1. **MongoDB Atlas** (Free tier)
   - https://www.mongodb.com/cloud/atlas
   - Free tier: 512MB storage
   - No credit card required
   - Would need to convert backend to use MongoDB

---

## Option 4: SQLite + Fly.io (Simplest Free Option)

For MVP, you could use SQLite (file-based database):

1. **Deploy to Fly.io** (free)
2. **Use SQLite** instead of MySQL
3. **Pros**: Completely free, simple
4. **Cons**: Not suitable for production scale, no concurrent writes

---

## Option 5: Free Tier Cloud Services

### AWS Free Tier
- **RDS MySQL**: Free for 12 months (750 hours/month)
- **EC2**: Free tier for backend hosting
- **Requires credit card** (but won't charge if within limits)

### Google Cloud Free Tier
- **Cloud SQL**: Free tier available
- **Cloud Run**: Free tier for backend
- **$300 credit** for new users

### Azure Free Tier
- **Azure Database for MySQL**: Free tier available
- **App Service**: Free tier for backend
- **$200 credit** for new users

---

## Recommended: Render (Free Tier)

**Why Render is best for free deployment:**

✅ **Both backend AND MySQL** on one platform
✅ **No credit card required** for free tier
✅ **Easy setup** - GitHub integration
✅ **Automatic deployments**
✅ **Good documentation**

**Setup Time:** ~15 minutes

**Limitations:**
- Services sleep after inactivity (free tier)
- First request after sleep is slow (~30s)
- Perfect for MVP/demo/testing

**When to upgrade:**
- When you need always-on service
- When traffic increases
- Paid plan: $7/month per service

---

## Quick Start: Render Free Deployment

### Step 1: Create MySQL Database

1. Go to https://render.com
2. New + → MySQL
3. Name: `bookshelf-db`
4. Plan: **Free**
5. Create database
6. Copy connection details

### Step 2: Deploy Backend

1. New + → Web Service
2. Connect GitHub repo
3. Settings:
   - Name: `bookshelf-backend`
   - Root Directory: `backend`
   - Environment: `Node`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Plan: **Free**
4. Add Environment Variables:
   ```
   DB_HOST=<from MySQL>
   DB_PORT=3306
   DB_USER=<from MySQL>
   DB_PASSWORD=<from MySQL>
   DB_NAME=<from MySQL>
   PORT=3001
   NODE_ENV=production
   ```
5. Create Web Service

### Step 3: Test

- Wait for deployment (~5 minutes)
- Test: `https://your-backend.onrender.com/api/books`
- Should return `[]` (empty array)

---

## Cost Comparison

| Option | Monthly Cost | Database | Backend Hosting |
|--------|-------------|----------|-----------------|
| Render Free | $0 | ✅ Free (sleeps) | ✅ Free (sleeps) |
| Render Paid | $14 | ✅ $7 | ✅ $7 |
| Fly.io + Aiven | $0 | ⚠️ Trial only | ✅ Free |
| AWS Free Tier | $0* | ✅ 12 months | ✅ 12 months |
| PlanetScale | $15 | ✅ $15 | ❌ Separate |

*Requires credit card, free for 12 months

---

## My Recommendation

**For MVP/Testing:** Use **Render Free Tier**
- Quick setup
- No credit card needed
- Good enough for demo

**For Production:** Upgrade to **Render Paid** ($7/month each = $14 total)
- Always-on service
- Better performance
- Still affordable

