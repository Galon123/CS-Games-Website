-- ==============================================================================
-- CS DEPARTMENT SPORTS & GAMING EVENT: CS GAMES 2026
-- Supabase Migration: Badminton Doubles Tournament Bracket & Schedule
-- Compatible with PostgreSQL 13+ / Supabase
-- ==============================================================================

-- 1. Create 'badminton_bracket_matches' table
CREATE TABLE IF NOT EXISTS badminton_bracket_matches (
    id TEXT PRIMARY KEY,
    match_code TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('mens', 'womens')),
    round TEXT NOT NULL CHECK (round IN ('preliminary', 'round_of_16', 'quarter_finals', 'semi_finals', 'finals')),
    round_title TEXT NOT NULL,
    team1_name TEXT NOT NULL,
    team1_is_placeholder BOOLEAN DEFAULT FALSE,
    team1_source_match_id TEXT,
    team1_score INTEGER DEFAULT 0,
    team2_name TEXT NOT NULL,
    team2_is_placeholder BOOLEAN DEFAULT FALSE,
    team2_source_match_id TEXT,
    team2_score INTEGER DEFAULT 0,
    winner_team INTEGER CHECK (winner_team IN (1, 2)),
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'live', 'completed')),
    scheduled_date TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    venue TEXT NOT NULL DEFAULT 'Indoor Badminton Arena',
    court TEXT DEFAULT 'Court 1',
    next_match_id TEXT,
    next_match_slot TEXT CHECK (next_match_slot IN ('team1', 'team2')),
    notes TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Indexes for fast category and round lookups
CREATE INDEX IF NOT EXISTS idx_badminton_bracket_cat ON badminton_bracket_matches(category);
CREATE INDEX IF NOT EXISTS idx_badminton_bracket_round ON badminton_bracket_matches(round);
CREATE INDEX IF NOT EXISTS idx_badminton_bracket_status ON badminton_bracket_matches(status);

-- 3. Grant table privileges to standard Supabase roles
GRANT ALL ON TABLE badminton_bracket_matches TO postgres, anon, authenticated, service_role;

-- 4. Enable Row Level Security (RLS)
ALTER TABLE badminton_bracket_matches ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
DROP POLICY IF EXISTS "Allow All Access on badminton_bracket_matches" ON badminton_bracket_matches;
CREATE POLICY "Allow All Access on badminton_bracket_matches" 
ON badminton_bracket_matches 
FOR ALL 
TO anon, authenticated 
USING (true) 
WITH CHECK (true);

-- 6. Enable Realtime updates
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'badminton_bracket_matches'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE badminton_bracket_matches;
  END IF;
END $$;

-- 7. Seed Official Tournament Draw from CS GAMES Badminton PDF
INSERT INTO badminton_bracket_matches (
    id, match_code, category, round, round_title, 
    team1_name, team1_is_placeholder, team1_source_match_id, team1_score,
    team2_name, team2_is_placeholder, team2_source_match_id, team2_score,
    winner_team, status, scheduled_date, scheduled_time, venue, court,
    next_match_id, next_match_slot, notes, display_order
) VALUES
-- ==============================================================================
-- MEN'S DOUBLES DRAW
-- ==============================================================================
('M-P1', 'P1', 'mens', 'preliminary', 'Preliminary Round', 'Sabith', false, NULL, 0, 'Shivas Seagal', false, NULL, 0, NULL, 'upcoming', '23 Sep 2026', '4:30 PM', 'Indoor Badminton Arena', 'Court 1', 'M-R16-1', 'team1', 'Start match at 4:30 PM', 1),
('M-P2', 'P2', 'mens', 'preliminary', 'Preliminary Round', 'R Abhinav', false, NULL, 0, 'Nabeel K P', false, NULL, 0, NULL, 'upcoming', '23 Sep 2026', '4:55 PM', 'Indoor Badminton Arena', 'Court 1', 'M-R16-5', 'team2', NULL, 2),
('M-P3', 'P3', 'mens', 'preliminary', 'Preliminary Round', 'Anirudh Shekhar', false, NULL, 0, 'Alan Ali', false, NULL, 0, NULL, 'upcoming', '23 Sep 2026', '5:20 PM', 'Indoor Badminton Arena', 'Court 1', 'M-R16-8', 'team2', NULL, 3),

('M-R16-1', 'R16-1', 'mens', 'round_of_16', 'Round of 16', 'Winner P1', true, 'M-P1', 0, 'Neeraj U', false, NULL, 0, NULL, 'upcoming', '23 Sep 2026', '5:45 PM', 'Indoor Badminton Arena', 'Court 1', 'M-QF-1', 'team1', NULL, 4),
('M-R16-2', 'R16-2', 'mens', 'round_of_16', 'Round of 16', 'Sreejith S', false, NULL, 0, 'Ayush Raj', false, NULL, 0, NULL, 'upcoming', '23 Sep 2026', '6:10 PM', 'Indoor Badminton Arena', 'Court 1', 'M-QF-1', 'team2', NULL, 5),
('M-R16-3', 'R16-3', 'mens', 'round_of_16', 'Round of 16', 'Thanmai K', false, NULL, 0, 'Fasil Firose', false, NULL, 0, NULL, 'upcoming', '23 Sep 2026', '6:35 PM', 'Indoor Badminton Arena', 'Court 2', 'M-QF-2', 'team1', NULL, 6),
('M-R16-4', 'R16-4', 'mens', 'round_of_16', 'Round of 16', 'Krishnadas', false, NULL, 0, 'Ashwin D Sreenivas', false, NULL, 0, NULL, 'upcoming', '23 Sep 2026', '7:00 PM', 'Indoor Badminton Arena', 'Court 2', 'M-QF-2', 'team2', NULL, 7),
('M-R16-5', 'R16-5', 'mens', 'round_of_16', 'Round of 16', 'Govind Menon', false, NULL, 0, 'Winner P2', true, 'M-P2', 0, NULL, 'upcoming', '23 Sep 2026', '7:25 PM', 'Indoor Badminton Arena', 'Court 1', 'M-QF-3', 'team1', NULL, 8),
('M-R16-6', 'R16-6', 'mens', 'round_of_16', 'Round of 16', 'Prideson Petson', false, NULL, 0, 'Abhiram H', false, NULL, 0, NULL, 'upcoming', '23 Sep 2026', '7:50 PM', 'Indoor Badminton Arena', 'Court 1', 'M-QF-3', 'team2', NULL, 9),
('M-R16-7', 'R16-7', 'mens', 'round_of_16', 'Round of 16', 'Abin', false, NULL, 0, 'Harikrishnan R', false, NULL, 0, NULL, 'upcoming', '23 Sep 2026', '8:15 PM', 'Indoor Badminton Arena', 'Court 2', 'M-QF-4', 'team1', NULL, 10),
('M-R16-8', 'R16-8', 'mens', 'round_of_16', 'Round of 16', 'Ashit Debnath', false, NULL, 0, 'Winner P3', true, 'M-P3', 0, NULL, 'upcoming', '23 Sep 2026', '8:40 PM', 'Indoor Badminton Arena', 'Court 2', 'M-QF-4', 'team2', NULL, 11),

('M-QF-1', 'QF-1', 'mens', 'quarter_finals', 'Quarter Finals', 'Winner R16-1', true, 'M-R16-1', 0, 'Winner R16-2', true, 'M-R16-2', 0, NULL, 'upcoming', '24 Sep 2026', '4:00 PM', 'Indoor Badminton Arena', 'Court 1', 'M-SF-1', 'team1', NULL, 12),
('M-QF-2', 'QF-2', 'mens', 'quarter_finals', 'Quarter Finals', 'Winner R16-3', true, 'M-R16-3', 0, 'Winner R16-4', true, 'M-R16-4', 0, NULL, 'upcoming', '24 Sep 2026', '4:35 PM', 'Indoor Badminton Arena', 'Court 1', 'M-SF-1', 'team2', NULL, 13),
('M-QF-3', 'QF-3', 'mens', 'quarter_finals', 'Quarter Finals', 'Winner R16-5', true, 'M-R16-5', 0, 'Winner R16-6', true, 'M-R16-6', 0, NULL, 'upcoming', '24 Sep 2026', '5:10 PM', 'Indoor Badminton Arena', 'Court 2', 'M-SF-2', 'team1', NULL, 14),
('M-QF-4', 'QF-4', 'mens', 'quarter_finals', 'Quarter Finals', 'Winner R16-7', true, 'M-R16-7', 0, 'Winner R16-8', true, 'M-R16-8', 0, NULL, 'upcoming', '24 Sep 2026', '5:45 PM', 'Indoor Badminton Arena', 'Court 2', 'M-SF-2', 'team2', NULL, 15),

('M-SF-1', 'SF-1', 'mens', 'semi_finals', 'Semi-Finals', 'Winner QF-1', true, 'M-QF-1', 0, 'Winner QF-2', true, 'M-QF-2', 0, NULL, 'upcoming', '25 Sep 2026', '3:00 PM', 'Indoor Badminton Arena', 'Court 1', 'M-FINAL', 'team1', NULL, 16),
('M-SF-2', 'SF-2', 'mens', 'semi_finals', 'Semi-Finals', 'Winner QF-3', true, 'M-QF-3', 0, 'Winner QF-4', true, 'M-QF-4', 0, NULL, 'upcoming', '25 Sep 2026', '3:45 PM', 'Indoor Badminton Arena', 'Court 1', 'M-FINAL', 'team2', NULL, 17),

('M-FINAL', 'FINAL', 'mens', 'finals', 'Championship Final', 'Winner SF-1', true, 'M-SF-1', 0, 'Winner SF-2', true, 'M-SF-2', 0, NULL, 'upcoming', '25 Sep 2026', '5:30 PM', 'Indoor Badminton Arena', 'Centre Court', NULL, NULL, 'Both Men and Women Finals on 25th Sept 2026', 18),

-- ==============================================================================
-- WOMEN'S DOUBLES DRAW
-- ==============================================================================
('W-P1', 'P1', 'womens', 'preliminary', 'Preliminary Round', 'Anagha B Kumar', false, NULL, 0, 'Glenys Gladson', false, NULL, 0, NULL, 'upcoming', '23 Sep 2026', '5:00 PM', 'Indoor Badminton Arena', 'Court 2', 'W-QF-2', 'team1', NULL, 19),

('W-QF-1', 'QF-1', 'womens', 'quarter_finals', 'Quarter Finals', 'Swetha Satheesh', false, NULL, 0, 'Devananda Jigeesh', false, NULL, 0, NULL, 'upcoming', '24 Sep 2026', '6:00 PM', 'Indoor Badminton Arena', 'Court 1', 'W-SF-1', 'team1', NULL, 20),
('W-QF-2', 'QF-2', 'womens', 'quarter_finals', 'Quarter Finals', 'Winner P1', true, 'W-P1', 0, 'Rose Mary KS', false, NULL, 0, NULL, 'upcoming', '24 Sep 2026', '6:30 PM', 'Indoor Badminton Arena', 'Court 1', 'W-SF-1', 'team2', NULL, 21),
('W-QF-3', 'QF-3', 'womens', 'quarter_finals', 'Quarter Finals', 'Parvathy Ajith', false, NULL, 0, 'Archana K', false, NULL, 0, NULL, 'upcoming', '24 Sep 2026', '7:00 PM', 'Indoor Badminton Arena', 'Court 2', 'W-SF-2', 'team1', NULL, 22),
('W-QF-4', 'QF-4', 'womens', 'quarter_finals', 'Quarter Finals', 'Avany Chandra', false, NULL, 0, 'Sushma Thapa', false, NULL, 0, NULL, 'upcoming', '24 Sep 2026', '7:30 PM', 'Indoor Badminton Arena', 'Court 2', 'W-SF-2', 'team2', NULL, 23),

('W-SF-1', 'SF-1', 'womens', 'semi_finals', 'Semi-Finals', 'Winner QF-1', true, 'W-QF-1', 0, 'Winner QF-2', true, 'W-QF-2', 0, NULL, 'upcoming', '25 Sep 2026', '4:15 PM', 'Indoor Badminton Arena', 'Court 2', 'W-FINAL', 'team1', NULL, 24),
('W-SF-2', 'SF-2', 'womens', 'semi_finals', 'Semi-Finals', 'Winner QF-3', true, 'W-QF-3', 0, 'Winner QF-4', true, 'W-QF-4', 0, NULL, 'upcoming', '25 Sep 2026', '4:45 PM', 'Indoor Badminton Arena', 'Court 2', 'W-FINAL', 'team2', NULL, 25),

('W-FINAL', 'FINAL', 'womens', 'finals', 'Championship Final', 'Winner SF-1', true, 'W-SF-1', 0, 'Winner SF-2', true, 'W-SF-2', 0, NULL, 'upcoming', '25 Sep 2026', '6:15 PM', 'Indoor Badminton Arena', 'Centre Court', NULL, NULL, 'Both Men and Women Finals on 25th Sept 2026', 26)

ON CONFLICT (id) DO UPDATE SET
    team1_name = EXCLUDED.team1_name,
    team2_name = EXCLUDED.team2_name,
    scheduled_date = EXCLUDED.scheduled_date,
    scheduled_time = EXCLUDED.scheduled_time,
    court = EXCLUDED.court,
    updated_at = NOW();

-- Confirmation output
SELECT count(*) AS total_badminton_matches_seeded FROM badminton_bracket_matches;
