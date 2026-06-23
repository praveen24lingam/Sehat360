-- Supabase Migration for Core Tables

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  city text,
  state text,
  age integer,
  language text default 'hi' check (language in ('hi', 'en')),
  features jsonb not null default '{"prescription":true,"schemes":true,"pregnancy":false,"vaccination":false,"awareness":true}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS public.family_members (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  relation text not null check (relation in ('self','spouse','child','parent','other')),
  dob date,
  gender text check (gender in ('male','female','other')),
  is_pregnant boolean default false,
  pregnancy_week integer,
  lmp_date date,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS public.prescriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  image_url text,
  raw_ocr_text text,
  medicines jsonb not null default '[]',
  total_monthly_saving numeric default 0,
  total_yearly_saving numeric default 0,
  created_at timestamptz default now()
);

CREATE TABLE IF NOT EXISTS public.vaccinations (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.family_members(id) on delete cascade,
  vaccine_name text not null,
  due_date date,
  done boolean default false,
  done_date date,
  created_at timestamptz default now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vaccinations ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "users own their profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "users own their family" ON public.family_members FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "users own their prescriptions" ON public.prescriptions FOR ALL USING (auth.uid() = user_id);

-- Vaccinations ownership goes through family_members
CREATE POLICY "users own their family vaccinations" ON public.vaccinations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.family_members fm 
    WHERE fm.id = vaccinations.member_id AND fm.user_id = auth.uid()
  )
);
