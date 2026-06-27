-- ─────────────────────────────────────────────────────────────────────────────
-- SEET Election System — Supabase Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  level TEXT NOT NULL,
  manifesto TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Voters table
CREATE TABLE IF NOT EXISTS voters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  matric_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  department TEXT NOT NULL,
  level TEXT NOT NULL,
  phone TEXT NOT NULL,
  token TEXT NOT NULL,
  token_used BOOLEAN DEFAULT FALSE,
  has_voted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Voter sessions (short-lived, after token verification)
CREATE TABLE IF NOT EXISTS voter_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voter_id UUID REFERENCES voters(id) ON DELETE CASCADE,
  session_token TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Votes table (anonymous — voter_id is stored but not linked publicly)
CREATE TABLE IF NOT EXISTS votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voter_id UUID REFERENCES voters(id) ON DELETE SET NULL,
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  position TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Prevent a voter from voting twice for the same position
  UNIQUE(voter_id, position)
);

-- 5. Election settings
CREATE TABLE IF NOT EXISTS election_settings (
  id INT PRIMARY KEY DEFAULT 1,
  election_open BOOLEAN DEFAULT FALSE,
  election_name TEXT DEFAULT 'SEET Student Union Elections 2025',
  faculty_name TEXT DEFAULT 'School of Engineering & Engineering Technology',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO election_settings (id, election_open) VALUES (1, FALSE)
ON CONFLICT (id) DO NOTHING;

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security (RLS)
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voters ENABLE ROW LEVEL SECURITY;
ALTER TABLE voter_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_settings ENABLE ROW LEVEL SECURITY;

-- Only service role (backend) can access everything
-- No public access — all queries go through our API routes using the service key

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed placeholder candidates
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO candidates (name, position, department, level, manifesto) VALUES
-- President
('Adeleke Tunde', 'President', 'Civil Engineering', '400', 'I will improve student welfare, create more industry partnerships, and ensure every SEET student has access to the tools they need to succeed.'),
('Okafor Chisom', 'President', 'Electrical Engineering', '500', 'My vision is a united SEET community with a strong voice, better facilities, and career support for every student.'),
-- Vice President
('Bello Fatima', 'Vice President', 'Mechanical Engineering', '400', 'I will work closely with the President to ensure smooth governance and represent your interests at every level.'),
('Nwosu Emmanuel', 'Vice President', 'Computer Engineering', '400', 'My focus will be on academic support, mentorship programs, and bridging the gap between students and faculty.'),
-- Secretary General
('Adeyemi Blessing', 'Secretary General', 'Civil Engineering', '300', 'Transparent record-keeping, efficient communication, and organized governance — that is my commitment to SEET.'),
('Ibrahim Musa', 'Secretary General', 'Chemical Engineering', '400', 'I will ensure every meeting, decision, and communication is properly documented and accessible to all students.'),
-- Assistant Secretary General
('Eze Chidimma', 'Assistant Secretary General', 'Electrical Engineering', '300', 'I will support the Secretary General and ensure no student voice is left unheard in our governance process.'),
('Lawal Abdullahi', 'Assistant Secretary General', 'Mechanical Engineering', '300', 'Accuracy, diligence, and integrity — these are the values I bring to this role.'),
-- Financial Secretary
('Oluwole Seun', 'Financial Secretary', 'Computer Engineering', '400', 'Every naira collected will be accounted for. I will publish clear financial reports and fight against mismanagement.'),
('Amadi Precious', 'Financial Secretary', 'Civil Engineering', '400', 'I will ensure our association finances are transparent, auditable, and used for the benefit of all students.'),
-- PRO
('Yakubu Sandra', 'PRO', 'Chemical Engineering', '300', 'I will build SEET presence online and offline — keeping students informed, engaged, and proud of their school.'),
('Obi Kelechi', 'PRO', 'Electrical Engineering', '300', 'My goal is to make SEET the most visible and respected engineering faculty in this university.'),
-- Director of Sports
('Garba Yusuf', 'Director of Sports', 'Mechanical Engineering', '400', 'Sports unify us. I will organize more inter-departmental competitions and get SEET back to the top of the university sports table.'),
('Nkem Uche', 'Director of Sports', 'Civil Engineering', '300', 'From football to chess, I will ensure every student has a sport to call their own within SEET.'),
-- Director of Social
('Abiodun Tobiloba', 'Director of Social', 'Computer Engineering', '300', 'More events, better vibes. I will create memorable social experiences that bring SEET students together throughout the year.'),
('Onyekachi Miriam', 'Director of Social', 'Chemical Engineering', '400', 'I will plan socials that every student wants to attend — inclusive, exciting, and truly SEET.');
