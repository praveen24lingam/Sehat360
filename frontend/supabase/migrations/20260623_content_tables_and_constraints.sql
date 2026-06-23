-- Health Articles table (queried by awareness page)
CREATE TABLE IF NOT EXISTS public.health_articles (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en        text        NOT NULL,
  title_hi        text        NOT NULL,
  summary_en      text        NOT NULL DEFAULT '',
  summary_hi      text        NOT NULL DEFAULT '',
  content_en      text[]      NOT NULL DEFAULT '{}',
  content_hi      text[]      NOT NULL DEFAULT '{}',
  category        text        NOT NULL,
  read_time_minutes integer   DEFAULT 5,
  thumbnail_url   text,
  tone            text        DEFAULT 'green',
  icon            text        DEFAULT 'BookOpen',
  author          text        DEFAULT 'SehatMitra Team',
  source_url      text,
  created_at      timestamptz DEFAULT now()
);

-- Health Videos table (queried by awareness page)
CREATE TABLE IF NOT EXISTS public.health_videos (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en        text        NOT NULL,
  title_hi        text        NOT NULL,
  youtube_id      text        NOT NULL,
  category        text        NOT NULL,
  description_en  text        DEFAULT '',
  description_hi  text        DEFAULT '',
  source_url      text,
  created_at      timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.health_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_videos   ENABLE ROW LEVEL SECURITY;

-- Public read-only for both content tables
CREATE POLICY "health_articles_public_read" ON public.health_articles
  FOR SELECT USING (true);

CREATE POLICY "health_videos_public_read" ON public.health_videos
  FOR SELECT USING (true);

-- Indexes for content tables
CREATE INDEX IF NOT EXISTS idx_health_articles_category ON public.health_articles(category);
CREATE INDEX IF NOT EXISTS idx_health_videos_category   ON public.health_videos(category);

-- Unique constraint on vaccinations so UPDATE by (member_id, vaccine_name) is safe
ALTER TABLE public.vaccinations
  ADD CONSTRAINT IF NOT EXISTS vaccinations_member_vaccine_unique
  UNIQUE (member_id, vaccine_name);

-- Trigger: auto-update profiles.updated_at on row update
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
