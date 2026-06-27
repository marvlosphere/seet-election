// Types only — safe to import anywhere including frontend pages

export type Position =
  | 'President'
  | 'Vice President'
  | 'Secretary General'
  | 'Assistant Secretary General'
  | 'Financial Secretary'
  | 'PRO'
  | 'Director of Sports'
  | 'Director of Social'

export const POSITIONS: Position[] = [
  'President',
  'Vice President',
  'Secretary General',
  'Assistant Secretary General',
  'Financial Secretary',
  'PRO',
  'Director of Sports',
  'Director of Social',
]

export interface Candidate {
  id: string
  name: string
  position: Position
  department: string
  level: string
  manifesto: string
  created_at: string
}

export interface Voter {
  id: string
  matric_number: string
  full_name: string
  department: string
  level: string
  phone: string
  token: string
  token_used: boolean
  has_voted: boolean
  created_at: string
}

export interface Vote {
  id: string
  voter_id: string
  candidate_id: string
  position: Position
  created_at: string
}
