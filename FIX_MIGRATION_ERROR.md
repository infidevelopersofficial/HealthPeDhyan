# Fix: PostgreSQL Enum Migration Error

## Problem

The migration `20251103163720_add_user_features` is failing with:
```
ERROR: unsafe use of new value "USER" of enum type "UserRole"
HINT: New enum values must be committed before they can be used.
```

This happens because PostgreSQL requires enum value additions to be committed in a separate transaction before they can be used.

## Solution: Delete and Recreate Migrations (Recommended)

This is the cleanest solution for a fresh database.

### Step 1: Delete the problematic migration

```bash
# Delete the migration directory
Remove-Item -Recurse -Force prisma\migrations\20251103163720_add_user_features
```

### Step 2: Reset Prisma migrations tracking

```bash
# This marks all migrations as applied (use carefully!)
npx prisma migrate resolve --applied 20251103163720_add_user_features
```

### Step 3: Create a fresh migration

```bash
# Generate a new migration from current schema
npx prisma migrate dev --name add_user_features_fixed
```

### Step 4: Apply to database

```bash
npx prisma migrate deploy
```

---

## Alternative Solution: Manual Database Fix

If you want to keep the existing migration structure:

### Option A: Direct SQL Fix (Fastest)

Run this SQL directly on your Neon database:

```sql
-- Step 1: Add the USER enum value
BEGIN;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum
        WHERE enumlabel = 'USER'
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'UserRole')
    ) THEN
        ALTER TYPE "UserRole" ADD VALUE 'USER';
    END IF;
END $$;
COMMIT;

-- Step 2: Set the default (in separate transaction)
BEGIN;
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- Step 3: Mark migration as applied
-- (You'll need to do this via Prisma CLI)
```

Then tell Prisma the migration was applied:
```bash
npx prisma migrate resolve --applied 20251103163720_add_user_features
```

### Option B: Use Fix Script

I've created a fix script at `scripts/fix-enum-migration.sql`.

1. Connect to your Neon database:
   ```bash
   psql "YOUR_DATABASE_URL_FROM_NEON"
   ```

2. Run the fix script:
   ```bash
   \i scripts/fix-enum-migration.sql
   ```

3. Mark migration as applied:
   ```bash
   npx prisma migrate resolve --applied 20251103163720_add_user_features
   ```

---

## Option C: Start Fresh (For Development Only)

If this is a development database with no important data:

```bash
# Drop and recreate the entire database
npx prisma migrate reset --force

# This will:
# 1. Drop the database
# 2. Create it again
# 3. Run all migrations in order
# 4. Run the seed script
```

**⚠️ WARNING**: This deletes ALL data in your database!

---

## For Vercel/Neon Production Deployment

The migration fix I pushed to the repository should work automatically on Vercel because each migration runs in its own context. The changes I made to the migration file:

1. Wrapped the enum addition in a DO block
2. Separated the default value setting to the end
3. Added checks to prevent duplicate enum values

This should work on fresh Neon databases during Vercel deployment.

---

## Recommended Approach

**For local development database:**
```bash
# Simplest - just reset everything
npx prisma migrate reset --force
```

**For Vercel/Neon (new deployment):**
- The fixed migration file should work automatically
- No manual intervention needed

**For existing production database:**
- Use Option A (Direct SQL Fix)
- Or create a new migration with the fix

---

## Next Steps After Fix

1. Verify migrations are applied:
   ```bash
   npx prisma migrate status
   ```

2. Generate Prisma client:
   ```bash
   npx prisma generate
   ```

3. Test the application:
   ```bash
   npm run dev
   ```

4. Seed the database (optional):
   ```bash
   npm run db:seed
   ```

---

## Understanding the Fix

The modified migration file now:

1. **Creates new enums** (ContactMessageStatus, LabelScanStatus, etc.)
2. **Adds USER to UserRole** in a DO block with existence check
3. **Modifies tables** and adds columns
4. **Creates new tables**
5. **Adds indexes and constraints**
6. **Sets the default value** at the very end

By separating the enum addition from its usage and putting the default at the end, we ensure the enum value is available when needed.

---

## Prevention for Future

When creating migrations that modify enums:

1. Add enum values in one migration
2. Use enum values in a separate migration
3. Or use the DO block pattern with separated transactions

Prisma will handle this better in future versions, but for now, we need to be careful with enum alterations.
