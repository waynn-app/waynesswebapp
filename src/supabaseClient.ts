import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Initialize client only if configurations are present
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Real-time integration utility schemas (users can copy/paste this into their Supabase dashboard)
export const SUPABASE_SQL_SCHEMA = `-- SQL Setup for Wayness Platform in Supabase

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT DEFAULT '',
  wpoints_balance INTEGER DEFAULT 500,
  total_calories INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read details" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow individual update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Workouts Table
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  calories_burned INTEGER NOT NULL,
  wpoints_earned INTEGER NOT NULL,
  heart_rate_avg INTEGER,
  distance_km NUMERIC,
  notes TEXT,
  workout_date TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to manage workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id);

-- 3. Posts Table
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL,
  user_avatar TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  workout_id UUID,
  workout_details JSONB,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read posts" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Allow user to manage posts" ON public.posts FOR ALL USING (auth.uid() = user_id);

-- 4. Redemptions Table
CREATE TABLE IF NOT EXISTS public.redemptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  reward_id TEXT NOT NULL,
  reward_name TEXT NOT NULL,
  reward_image_url TEXT NOT NULL,
  wpoints_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'approved' NOT NULL,
  discount_code TEXT NOT NULL,
  email_sent BOOLEAN DEFAULT TRUE NOT NULL,
  redeemed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.redemptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow user to see redemptions" ON public.redemptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Allow user to insert redemption" ON public.redemptions FOR INSERT WITH CHECK (auth.uid() = user_id);
`;
