import { useState } from 'react'
import { supabase } from '../lib/supabase'

export function useCommentVote() {
  const [loading, setLoading] = useState(false)

  async function vote(commentId: string, voteType: 'like' | 'dislike') {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert('로그인이 필요합니다.'); return false }
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
