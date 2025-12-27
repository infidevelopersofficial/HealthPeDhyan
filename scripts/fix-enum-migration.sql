-- Fix for PostgreSQL enum migration error
-- Run this script directly on your database if you encounter enum errors

-- Drop the problematic migration if it was partially applied
-- (This is safe because we'll recreate everything)

BEGIN;

-- Add USER enum value if it doesn't exist
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

-- Now set the default in a separate transaction
BEGIN;

-- Update users table to use new default
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'USER';

COMMIT;
