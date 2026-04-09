export interface Article {
  id: string
  title: string
  description: string
  source: string
  link: string
  league: string
  pub_date: string
  created_at: string
  comment_count: number
  image_url: string | null
}

export interface Comment {
  id: string
  article_id: string
  user_id: string
  parent_id: string | null
  content: string
  likes: number
  dislikes: number
  created_at: string
  profiles?: Profile
  replies?: Comment[]
}

export interface CommentVote {
  id: string
  comment_id: string
  user_id: string
  vote_type: 'like' | 'dislike'
}

export interface Profile {
  id: string
  nickname: string
  avatar_url: string | null
  created_at: string
}

export interface Match {
  id: number
  utcDate: string
  status: 'SCHEDULED' | 'LIVE' | 'IN_PLAY' | 'PAUSED' | 'FINISHED' | 'POSTPONED' | 'CANCELLED'
  matchday: number
  homeTeam: { id: number; name: string; shortName: string; crest: string }
  awayTeam: { id: number; name: string; shortName: string; crest: string }
  score: {
    fullTime: { home: number | null; away: number | null }
  }
}

export interface Standing {
  position: number
  team: { id: number; name: string; shortName: string; crest: string }
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}
