-- ==============================================================================
-- CS DEPARTMENT SPORTS & GAMING EVENT ("CYBER ATHLETIC ARENA")
-- Supabase Database Schema & Initial Seed Data
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables if re-running (Clean slate)
DROP TABLE IF EXISTS leaderboards CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS sports CASCADE;

-- 3. Create 'sports' Table
CREATE TABLE sports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('team', 'solo', 'duo')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create 'teams' Table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    logo_url TEXT,
    department TEXT NOT NULL DEFAULT 'Computer Science & Engineering',
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    formation TEXT DEFAULT '2-2-1',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create 'players' Table
CREATE TABLE players (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    photo_url TEXT,
    role TEXT NOT NULL,
    jersey_number INTEGER NOT NULL,
    position_x FLOAT DEFAULT 50.0,
    position_y FLOAT DEFAULT 50.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Create 'matches' Table
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    team_a_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    team_b_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    team_a_score INTEGER DEFAULT 0,
    team_b_score INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
    scheduled_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Create 'leaderboards' Table
CREATE TABLE leaderboards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport_id UUID NOT NULL REFERENCES sports(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    played INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    drawn INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_sport_team UNIQUE (sport_id, team_id)
);

-- ==============================================================================
-- 8. GRANT PRIVILEGES TO POSTGRES ROLES
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- ==============================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboards ENABLE ROW LEVEL SECURITY;

-- Allow full read and write access for both anon and authenticated roles
-- (Allows the CS Nexus frontend client and admin console to read, sync, and update scores/formations)
CREATE POLICY "Allow All Access on sports" ON sports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on teams" ON teams FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on players" ON players FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on matches" ON matches FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on leaderboards" ON leaderboards FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Enable Realtime for live UI updates safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'matches'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE matches;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'leaderboards'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE leaderboards;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'players'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE players;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'teams'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE teams;
  END IF;
END $$;

-- ==============================================================================
-- 9. SAMPLE DATA INSERTION (CS Department Themed)
-- ==============================================================================

-- 9.1 Insert Sports
INSERT INTO sports (id, name, type) VALUES
('11111111-1111-1111-1111-111111111111', 'Football', 'team'),
('22222222-2222-2222-2222-222222222222', 'Badminton', 'duo'),
('33333333-3333-3333-3333-333333333333', 'Chess', 'solo'),
('44444444-4444-4444-4444-444444444444', 'Carrom', 'duo');

-- Clean slate: No preset teams, players, matches, or leaderboards.
-- Add them via the Admin Console or your application.
