-- Supabase Migration for Performance Indexes

-- Create indexes on frequently queried categorical fields to prevent full table scans
CREATE INDEX IF NOT EXISTS idx_health_articles_category ON public.health_articles(category);
CREATE INDEX IF NOT EXISTS idx_health_videos_category ON public.health_videos(category);

-- Create indexes on date fields for queries like upcoming vaccinations or overdue items
CREATE INDEX IF NOT EXISTS idx_vaccinations_due_date ON public.vaccinations(due_date);
CREATE INDEX IF NOT EXISTS idx_vaccinations_member_id ON public.vaccinations(member_id);

-- Create indexes on relational foreign keys to speed up cascading deletes and joins
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON public.family_members(user_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_user_id ON public.prescriptions(user_id);
