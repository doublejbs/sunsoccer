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
