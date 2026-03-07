-- RoadGuard AI - Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users/Profiles (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    city TEXT DEFAULT 'Chennai',
    district TEXT,
    bio TEXT,
    profile_photo TEXT,
    total_reports INT DEFAULT 0,
    verified_reports INT DEFAULT 0,
    total_points INT DEFAULT 0,
    role TEXT DEFAULT 'Citizen', -- 'Citizen', 'Moderator', 'Municipal Officer', 'Super Admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 2. HazardReports
CREATE TABLE IF NOT EXISTS public.hazard_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES public.profiles(id),
    image_url TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    hazard_type TEXT NOT NULL, -- Pothole, Broken road edge, Waterlogging, Missing manhole cover, Road cracks
    confidence_score FLOAT NOT NULL,
    severity_score INT NOT NULL, -- 1-10
    severity_level TEXT NOT NULL, -- Low, Medium, High
    status TEXT DEFAULT 'Pending', -- Pending, Inspection, Repair Scheduled, Resolved
    estimated_cost FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 3. HazardVerification
CREATE TABLE IF NOT EXISTS public.hazard_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hazard_id UUID REFERENCES public.hazard_reports(id) ON DELETE CASCADE,
    verifier_id UUID REFERENCES public.profiles(id),
    is_repaired BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    UNIQUE(hazard_id, verifier_id)
);

-- 4. RepairRecords
CREATE TABLE IF NOT EXISTS public.repair_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hazard_id UUID REFERENCES public.hazard_reports(id) ON DELETE CASCADE,
    contractor_name TEXT NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    estimated_cost FLOAT,
    actual_cost FLOAT,
    status TEXT DEFAULT 'Assigned',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 5. RoadHealthScores
CREATE TABLE IF NOT EXISTS public.road_health_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    road_name TEXT UNIQUE NOT NULL,
    health_score FLOAT NOT NULL,
    category TEXT NOT NULL, -- Good, Moderate, Poor
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- 6. Leaderboard (As a Materialized View or Standard View)
CREATE OR REPLACE VIEW public.leaderboard AS
SELECT 
    id,
    name,
    city,
    profile_photo,
    total_points,
    verified_reports,
    RANK() OVER (ORDER BY total_points DESC) as rank
FROM public.profiles;

-- Create Storage Bucket
-- (Run this in Supabase admin via UI, or via REST)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('hazards', 'hazards', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('profiles', 'profiles', true);
