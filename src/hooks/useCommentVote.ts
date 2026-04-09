import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useCommentVote() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  async function vote(commentId: string, voteType: 'like' | 'dislike') {
    if (!user) return 'login_required' as const
    setLoading(true)
    const { error } = await supabase.rpc('handle_vote', {
      p_comment_id: commentId, p_user_id: user.id, p_vote_type: voteType,
    })
    setLoading(false)
    if (error) { console.error('Vote error:', error); return false }
    return true
  }

  return { vote, loading }
}
