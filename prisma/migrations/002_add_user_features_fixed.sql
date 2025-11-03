-- Fixed migration to add user features
-- This version properly adds columns instead of trying to alter non-existent ones

-- Step 1: Drop and recreate UserRole enum with all values
DROP TYPE IF EXISTS "UserRole" CASCADE;
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'USER');

-- Step 2: Add new columns to users table (using ADD COLUMN instead of ALTER)
ALTER TABLE "users"
  ALTER COLUMN "passwordHash" DROP NOT NULL,
  ADD COLUMN IF NOT EXISTS "role" "UserRole" NOT NULL DEFAULT 'USER',
  ADD COLUMN IF NOT EXISTS "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "verificationToken" TEXT,
  ADD COLUMN IF NOT EXISTS "resetToken" TEXT,
  ADD COLUMN IF NOT EXISTS "resetTokenExpiry" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "loginCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "provider" TEXT,
  ADD COLUMN IF NOT EXISTS "providerId" TEXT;

-- Step 3: Add unique indexes
CREATE UNIQUE INDEX IF NOT EXISTS "users_verificationToken_key" ON "users"("verificationToken");
CREATE UNIQUE INDEX IF NOT EXISTS "users_resetToken_key" ON "users"("resetToken");

-- Step 4: Create user_profiles table
CREATE TABLE IF NOT EXISTS "user_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
    "isVegan" BOOLEAN NOT NULL DEFAULT false,
    "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
    "isDairyFree" BOOLEAN NOT NULL DEFAULT false,
    "isNutFree" BOOLEAN NOT NULL DEFAULT false,
    "isKeto" BOOLEAN NOT NULL DEFAULT false,
    "isPaleo" BOOLEAN NOT NULL DEFAULT false,
    "healthGoals" JSONB,
    "allergies" JSONB,
    "favoriteBrands" JSONB,
    "avoidIngredients" JSONB,
    "preferredMerchant" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_profiles_userId_key" ON "user_profiles"("userId");
CREATE INDEX IF NOT EXISTS "user_profiles_userId_idx" ON "user_profiles"("userId");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_profiles_userId_fkey'
  ) THEN
    ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Step 5: Create bookmarks table
CREATE TABLE IF NOT EXISTS "bookmarks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "productId" TEXT,
    "articleId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "bookmarks_userId_productId_key" ON "bookmarks"("userId", "productId");
CREATE UNIQUE INDEX IF NOT EXISTS "bookmarks_userId_articleId_key" ON "bookmarks"("userId", "articleId");
CREATE INDEX IF NOT EXISTS "bookmarks_userId_idx" ON "bookmarks"("userId");
CREATE INDEX IF NOT EXISTS "bookmarks_productId_idx" ON "bookmarks"("productId");
CREATE INDEX IF NOT EXISTS "bookmarks_articleId_idx" ON "bookmarks"("articleId");
CREATE INDEX IF NOT EXISTS "bookmarks_createdAt_idx" ON "bookmarks"("createdAt");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookmarks_userId_fkey') THEN
    ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookmarks_productId_fkey') THEN
    ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'bookmarks_articleId_fkey') THEN
    ALTER TABLE "bookmarks" ADD CONSTRAINT "bookmarks_articleId_fkey"
      FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Step 6: Create user_lists table
CREATE TABLE IF NOT EXISTS "user_lists" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_lists_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "user_lists_userId_slug_key" ON "user_lists"("userId", "slug");
CREATE INDEX IF NOT EXISTS "user_lists_userId_idx" ON "user_lists"("userId");
CREATE INDEX IF NOT EXISTS "user_lists_isPublic_idx" ON "user_lists"("isPublic");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_lists_userId_fkey') THEN
    ALTER TABLE "user_lists" ADD CONSTRAINT "user_lists_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Step 7: Create list_items table
CREATE TABLE IF NOT EXISTS "list_items" (
    "id" TEXT NOT NULL,
    "listId" TEXT NOT NULL,
    "productId" TEXT,
    "articleId" TEXT,
    "notes" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "list_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "list_items_listId_idx" ON "list_items"("listId");
CREATE INDEX IF NOT EXISTS "list_items_productId_idx" ON "list_items"("productId");
CREATE INDEX IF NOT EXISTS "list_items_articleId_idx" ON "list_items"("articleId");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'list_items_listId_fkey') THEN
    ALTER TABLE "list_items" ADD CONSTRAINT "list_items_listId_fkey"
      FOREIGN KEY ("listId") REFERENCES "user_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'list_items_productId_fkey') THEN
    ALTER TABLE "list_items" ADD CONSTRAINT "list_items_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'list_items_articleId_fkey') THEN
    ALTER TABLE "list_items" ADD CONSTRAINT "list_items_articleId_fkey"
      FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Step 8: Create product_views table
CREATE TABLE IF NOT EXISTS "product_views" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "productId" TEXT NOT NULL,
    "sessionId" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_views_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "product_views_userId_idx" ON "product_views"("userId");
CREATE INDEX IF NOT EXISTS "product_views_productId_idx" ON "product_views"("productId");
CREATE INDEX IF NOT EXISTS "product_views_sessionId_idx" ON "product_views"("sessionId");
CREATE INDEX IF NOT EXISTS "product_views_viewedAt_idx" ON "product_views"("viewedAt");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_views_userId_fkey') THEN
    ALTER TABLE "product_views" ADD CONSTRAINT "product_views_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'product_views_productId_fkey') THEN
    ALTER TABLE "product_views" ADD CONSTRAINT "product_views_productId_fkey"
      FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- Step 9: Create search_history table
CREATE TABLE IF NOT EXISTS "search_history" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "filters" JSONB,
    "resultsCount" INTEGER NOT NULL,
    "searchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "search_history_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "search_history_userId_idx" ON "search_history"("userId");
CREATE INDEX IF NOT EXISTS "search_history_searchedAt_idx" ON "search_history"("searchedAt");

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'search_history_userId_fkey') THEN
    ALTER TABLE "search_history" ADD CONSTRAINT "search_history_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
