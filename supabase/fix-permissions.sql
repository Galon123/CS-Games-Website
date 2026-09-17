-- ==============================================================================
-- CS NEXUS ARENA: QUICK FIX FOR SUPABASE PERMISSIONS & RLS POLICIES
-- Run this in your Supabase SQL Editor to grant table access to anon and enable
-- full read/write capabilities for the Next.js frontend and admin panel.
-- ==============================================================================

-- 1. Grant schema and table permissions to Postgres roles
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;

-- 2. Ensure RLS is enabled on all tables
ALTER TABLE IF EXISTS sports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS players ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS leaderboards ENABLE ROW LEVEL SECURITY;

-- 3. Drop all previous restrictive policies
DROP POLICY IF EXISTS "Public Read Access on sports" ON sports;
DROP POLICY IF EXISTS "Public Read Access on teams" ON teams;
DROP POLICY IF EXISTS "Public Read Access on players" ON players;
DROP POLICY IF EXISTS "Public Read Access on matches" ON matches;
DROP POLICY IF EXISTS "Public Read Access on leaderboards" ON leaderboards;

DROP POLICY IF EXISTS "Authenticated Insert on sports" ON sports;
DROP POLICY IF EXISTS "Authenticated Update on sports" ON sports;
DROP POLICY IF EXISTS "Authenticated Delete on sports" ON sports;

DROP POLICY IF EXISTS "Authenticated Insert on teams" ON teams;
DROP POLICY IF EXISTS "Authenticated Update on teams" ON teams;
DROP POLICY IF EXISTS "Authenticated Delete on teams" ON teams;

DROP POLICY IF EXISTS "Authenticated Insert on players" ON players;
DROP POLICY IF EXISTS "Authenticated Update on players" ON players;
DROP POLICY IF EXISTS "Authenticated Delete on players" ON players;

DROP POLICY IF EXISTS "Authenticated Insert on matches" ON matches;
DROP POLICY IF EXISTS "Authenticated Update on matches" ON matches;
DROP POLICY IF EXISTS "Authenticated Delete on matches" ON matches;

DROP POLICY IF EXISTS "Authenticated Insert on leaderboards" ON leaderboards;
DROP POLICY IF EXISTS "Authenticated Update on leaderboards" ON leaderboards;
DROP POLICY IF EXISTS "Authenticated Delete on leaderboards" ON leaderboards;

DROP POLICY IF EXISTS "Allow read sports" ON sports;
DROP POLICY IF EXISTS "Allow read teams" ON teams;
DROP POLICY IF EXISTS "Allow read players" ON players;
DROP POLICY IF EXISTS "Allow read matches" ON matches;
DROP POLICY IF EXISTS "Allow read leaderboards" ON leaderboards;

DROP POLICY IF EXISTS "Allow write sports" ON sports;
DROP POLICY IF EXISTS "Allow write teams" ON teams;
DROP POLICY IF EXISTS "Allow write players" ON players;
DROP POLICY IF EXISTS "Allow write matches" ON matches;
DROP POLICY IF EXISTS "Allow write leaderboards" ON leaderboards;

DROP POLICY IF EXISTS "Allow All Access on sports" ON sports;
DROP POLICY IF EXISTS "Allow All Access on teams" ON teams;
DROP POLICY IF EXISTS "Allow All Access on players" ON players;
DROP POLICY IF EXISTS "Allow All Access on matches" ON matches;
DROP POLICY IF EXISTS "Allow All Access on leaderboards" ON leaderboards;

-- 4. Create permissive policies for anon & authenticated roles
CREATE POLICY "Allow All Access on sports" ON sports FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on teams" ON teams FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on players" ON players FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on matches" ON matches FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow All Access on leaderboards" ON leaderboards FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- 5. Safe idempotent Realtime publication registration
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
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'sports'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sports;
  END IF;
END $$;

