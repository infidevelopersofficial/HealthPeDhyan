# HealthPeDhyan Production Deployment Guide

## 🎯 Quick Overview

You need to deploy 2 things:
1. **PostgreSQL Database** - Stores all your products, articles, users
2. **Next.js Web App** - Your backend API + admin panel + website

## 📋 Option 1: Easiest - Vercel + Neon (Recommended)

### Total Cost: FREE (for starter)

**Step 1: Deploy Database (Neon PostgreSQL)**

1. Go to https://neon.tech
2. Sign up (free account)
3. Create new project → "HealthPeDhyan"
4. Copy the connection string (looks like):
   ```
   postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/healthpedhyan?sslmode=require
   ```

**Step 2: Deploy Web App (Vercel)**

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Import Project"
4. Select your `CPdevop/Health` repository
5. Framework: Next.js (auto-detected)
6. Root Directory: `/` (leave as is)

**Step 3: Configure Environment Variables in Vercel**

Click "Environment Variables" and add these:

```env
# Database
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/healthpedhyan?sslmode=require

# NextAuth
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=<run this command: openssl rand -base64 32>

# Email (Gmail)
GMAIL_USER=cpmjha@gmail.com
GMAIL_APP_PASSWORD=<your-gmail-app-password>

# Optional
NODE_ENV=production
```

**Step 4: Get Gmail App Password**

1. Go to https://myaccount.google.com/apppasswords
2. Create app password for "HealthPeDhyan"
3. Copy the 16-character password
4. Use it in `GMAIL_APP_PASSWORD`

**Step 5: Deploy!**

1. Click "Deploy"
2. Wait 2-3 minutes
3. You get a URL like: `healthpedhyan.vercel.app`

**Step 6: Setup Database**

After deployment, run migrations:
```bash
# In Vercel dashboard, go to your project
# Settings → Functions → Add Build Command:
npx prisma migrate deploy
npx prisma db seed
```

---

## 📋 Option 2: Railway (One-Click Deploy)

### Cost: $5/month (includes PostgreSQL)

**Step 1: Deploy Everything Together**

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `CPdevop/Health`
5. Railway auto-detects:
   - Next.js app
   - Needs PostgreSQL
6. Click "Add PostgreSQL"

**Step 2: Configure Environment Variables**

Railway auto-creates `DATABASE_URL`. Add these manually:

```env
NEXTAUTH_URL=https://healthpedhyan.up.railway.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
GMAIL_USER=cpmjha@gmail.com
GMAIL_APP_PASSWORD=<your-gmail-app-password>
NODE_ENV=production
```

**Step 3: Custom Domain (Optional)**

1. Go to Settings → Domains
2. Add: `healthpedhyan.com`
3. Update DNS records (Railway provides instructions)

---

## 📋 Option 3: DigitalOcean App Platform

### Cost: $12/month (includes everything)

**Step 1: Create PostgreSQL Database**

1. Go to https://cloud.digitalocean.com
2. Create → Databases → PostgreSQL
3. Name: `healthpedhyan-db`
4. Plan: Basic ($12/month)
5. Copy connection string

**Step 2: Deploy App**

1. Create → Apps
2. Connect GitHub → Select `CPdevop/Health`
3. Detected as: Next.js
4. Environment Variables: (add all from above)

**Step 3: Custom Domain**

1. Settings → Domains
2. Add `healthpedhyan.com`
3. Update nameservers at your domain registrar

---

## 🔧 After Deployment - Essential Steps

### 1. Run Database Migrations

Connect to your database and run:

```sql
-- Create all tables
npx prisma migrate deploy

-- Or manually run the SQL from scripts/setup-production-db.sql
```

### 2. Create Admin User

```bash
# SSH into your server or use Vercel CLI
npx tsx scripts/create-admin.ts
```

Or manually in database:
```sql
INSERT INTO users (id, email, name, "passwordHash", role)
VALUES (
  'user_admin',
  'cpmjha@gmail.com',
  'Admin',
  -- Password: admin123 (change after first login!)
  '$2a$10$N9qo8uLOickgx2ZMRZkQCe3rbZJFtmAO6B6DKl7M6b9t2T9OM.VWK',
  'ADMIN'
);
```

### 3. Add Sample Products

Either:
- Use admin panel at `/admin/products`
- Import CSV
- Add via API

### 4. Test the API

```bash
curl https://your-app.vercel.app/api/products
# Should return empty array or your products
```

---

## 📱 Connect Mobile App to Server

### Update Mobile App Configuration

**Option 1: Update app.json**

```json
// mobile/app.json
{
  "expo": {
    "extra": {
      "apiUrl": "https://healthpedhyan.vercel.app"  // Your live URL
    }
  }
}
```

**Option 2: Environment-based (Better)**

Create `mobile/.env`:
```env
API_URL=https://healthpedhyan.vercel.app
```

Update `mobile/src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.API_URL || Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';
```

### Rebuild Mobile App

```bash
cd mobile

# Update to production URL
# Edit app.json or .env

# Rebuild
eas build --profile production --platform android
```

---

## 🌐 Custom Domain Setup

### If you have `healthpedhyan.com`:

**For Vercel:**
1. Vercel Dashboard → Domains
2. Add `healthpedhyan.com`
3. Vercel gives you DNS records
4. Update at your domain registrar:
   ```
   A     @     76.76.21.21
   CNAME www   cname.vercel-dns.com
   ```

**For Railway:**
1. Settings → Domains → "Custom Domain"
2. Add `healthpedhyan.com`
3. Update DNS:
   ```
   CNAME @     your-app.up.railway.app
   CNAME www   your-app.up.railway.app
   ```

---

## 📊 My Recommendation

**Start with: Vercel + Neon (FREE)**

| Service | What | Cost |
|---------|------|------|
| Neon | PostgreSQL | FREE (up to 0.5GB) |
| Vercel | Next.js hosting | FREE (100GB bandwidth) |
| **Total** | | **$0/month** |

**When you grow: Railway ($5/month)**
- Everything in one place
- Easier to manage
- Built-in PostgreSQL
- Good performance

**Enterprise: DigitalOcean ($12/month)**
- More control
- Better for scaling
- Dedicated resources

---

## ✅ Deployment Checklist

- [ ] Create PostgreSQL database
- [ ] Get database connection string
- [ ] Deploy Next.js app to Vercel/Railway
- [ ] Add all environment variables
- [ ] Run database migrations
- [ ] Create admin user
- [ ] Test API endpoints
- [ ] Add sample products via admin
- [ ] Update mobile app.json with production URL
- [ ] Rebuild mobile app
- [ ] Test mobile app with live data
- [ ] Setup custom domain (optional)
- [ ] Configure SSL (auto on Vercel/Railway)

---

## 🆘 Troubleshooting

### "Database connection failed"
- Check `DATABASE_URL` has `?sslmode=require`
- Verify database is running
- Check firewall rules

### "NextAuth error"
- Ensure `NEXTAUTH_URL` matches your domain
- `NEXTAUTH_SECRET` must be set
- Check callback URLs

### "Gmail not sending"
- Use App Password, not regular password
- Enable "Less secure apps" if needed
- Check Gmail quota (500 emails/day)

### "Build failed on Vercel"
- Check build logs
- Ensure `package.json` has correct scripts
- Verify `prisma generate` runs in build

---

## 📝 Next Steps After Deployment

1. **Populate with real products** via admin panel
2. **Write blog articles** for SEO
3. **Test mobile app** with live data
4. **Monitor performance** (Vercel Analytics)
5. **Backup database** regularly

---

## 🎯 Quick Start Commands

```bash
# 1. Generate NextAuth secret
openssl rand -base64 32

# 2. Test database connection
npx prisma db pull

# 3. Run migrations
npx prisma migrate deploy

# 4. Create admin user
npm run create-admin

# 5. Test API
curl https://your-app.vercel.app/api/health
```

Ready to deploy? Start with Vercel + Neon (free) and let me know if you need help! 🚀
