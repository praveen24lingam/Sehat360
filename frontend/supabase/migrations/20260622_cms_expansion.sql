-- Supabase Migration for CMS Expansion
-- Adding author, publish date, and source_url for future-proofing

ALTER TABLE public.health_articles 
ADD COLUMN IF NOT EXISTS author text DEFAULT 'SehatMitra Team',
ADD COLUMN IF NOT EXISTS publish_date timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS source_url text;

ALTER TABLE public.health_videos
ADD COLUMN IF NOT EXISTS description_en text,
ADD COLUMN IF NOT EXISTS description_hi text,
ADD COLUMN IF NOT EXISTS source_url text;
