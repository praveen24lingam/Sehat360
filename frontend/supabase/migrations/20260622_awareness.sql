-- Supabase Migration for Health Articles and Videos

CREATE TABLE IF NOT EXISTS public.health_articles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title_hi text NOT NULL,
  title_en text NOT NULL,
  summary_hi text NOT NULL,
  summary_en text NOT NULL,
  content_hi text[] NOT NULL,
  content_en text[] NOT NULL,
  category text NOT NULL,
  read_time_minutes integer NOT NULL DEFAULT 5,
  thumbnail_url text,
  tone text DEFAULT 'green',
  icon text DEFAULT 'BookOpen',
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.health_videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title_hi text NOT NULL,
  title_en text NOT NULL,
  youtube_id text NOT NULL,
  category text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.health_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_videos ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on health_articles" ON public.health_articles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on health_videos" ON public.health_videos FOR SELECT USING (true);

-- For admin functionality, we allow all for now (In production, restrict to admin role)
CREATE POLICY "Allow authenticated full access on health_articles" ON public.health_articles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access on health_videos" ON public.health_videos FOR ALL USING (auth.role() = 'authenticated');
