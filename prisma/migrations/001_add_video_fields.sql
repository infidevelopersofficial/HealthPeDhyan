-- Create migration for video URL and tags in articles
-- Migration: 001_add_video_and_tags_to_articles

-- Add videoUrl column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;

-- Add tags column to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS "tags" TEXT;
