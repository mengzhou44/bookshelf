# SQLite Deployment Guide

SQLite is an embedded database - no separate database server needed! Perfect for simple deployments.

## Benefits of SQLite

✅ **No separate database service** - just a file
✅ **Zero configuration** - works out of the box
✅ **Perfect for MVP** - simple and reliable
✅ **Free forever** - no database hosting costs
✅ **Fast** - great for single-user or low-traffic apps
✅ **Easy deployment** - just deploy the backend, database file included

## Local Development

The database file is automatically created at: `backend/data/bookshelf.db`

No configuration needed - just run:
```bash
cd backend
npm install
npm run dev
```

## Deployment Options

### Option 1: Render (Recommended)

1. **Deploy Backend to Render**
   - New + → Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build: `npm run build`
   - Start: `npm start`
   - **No database service needed!**

2. **Environment Variables** (optional):
   ```
   DB_PATH=/opt/render/project/src/data/bookshelf.db
   PORT=3001
   NODE_ENV=production
   ```

3. **Persistent Storage**
   - Render free tier: Database file persists during service lifetime
   - For production: Consider Render's disk storage or upgrade plan

### Option 2: Fly.io

1. **Deploy to Fly.io**:
   ```bash
   fly launch
   ```

2. **Add Volume** (for persistent storage):
   ```bash
   fly volumes create bookshelf_data --size 1
   ```

3. **Update fly.toml**:
   ```toml
   [mounts]
     source = "bookshelf_data"
     destination = "/data"
   ```

4. **Set Environment Variable**:
   ```bash
   fly secrets set DB_PATH=/data/bookshelf.db
   ```

### Option 3: Railway

1. **Deploy Backend**
   - No MySQL service needed!
   - Just deploy the backend service
   - Database file is stored in the service

2. **For Persistent Storage**:
   - Use Railway's volume feature (paid)
   - Or database file persists during service lifetime

### Option 4: Vercel (Serverless Functions)

SQLite works with Vercel serverless functions, but:
- ⚠️ File system is read-only in serverless
- ⚠️ Need to use `/tmp` directory (ephemeral)
- ⚠️ Data lost between function invocations
- ✅ Better to use external database for serverless

## Important Notes

### File Persistence

- **Free tier services**: Database file may be lost on service restart/redeploy
- **Solution**: Use persistent volumes or upgrade to paid plan
- **For MVP**: File persistence during service lifetime is usually fine

### Backup Strategy

Since it's a file-based database:
1. **Regular backups**: Copy `bookshelf.db` file
2. **Export data**: Use SQLite tools to export
3. **Version control**: Don't commit `.db` files (already in .gitignore)

### Limitations

- ⚠️ **Single writer**: SQLite handles one write at a time
- ⚠️ **Not for high concurrency**: Better for single-user or low-traffic
- ✅ **Perfect for MVP**: Handles hundreds of requests/second easily
- ✅ **Can migrate later**: Easy to switch to MySQL/PostgreSQL if needed

## Migration from MySQL

If you already have MySQL data:

1. **Export from MySQL**:
   ```sql
   SELECT * FROM books;
   ```

2. **Import to SQLite**:
   ```bash
   sqlite3 bookshelf.db
   .mode csv
   .import books.csv books
   ```

## Database File Location

- **Local**: `backend/data/bookshelf.db`
- **Production**: Set via `DB_PATH` environment variable
- **Default**: `./data/bookshelf.db` (relative to backend root)

## Backup Commands

```bash
# Backup database
cp backend/data/bookshelf.db backend/data/bookshelf.db.backup

# Export to SQL
sqlite3 backend/data/bookshelf.db .dump > backup.sql

# Restore from SQL
sqlite3 backend/data/bookshelf.db < backup.sql
```

## Troubleshooting

### Database locked error
- SQLite handles one write at a time
- Normal for low-traffic apps
- If frequent, consider MySQL/PostgreSQL

### File not found
- Ensure `data/` directory exists
- Check `DB_PATH` environment variable
- Verify file permissions

### Data lost after restart
- Free tier services may not persist files
- Use persistent volumes (paid plans)
- Or implement backup/restore strategy

