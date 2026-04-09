import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCommentVote } from '../hooks/useCommentVote'

interface VoteButtonsProps { commentId: string; likes: number; dislikes: number; onVoted: () => void }

export function VoteButtons({ commentId, likes, dislikes, onVoted }: VoteButtonsProps) {
  const { vote, loading } = useCommentVote()
  const navigate = useNavigate()
  const [showLogin, setShowLogin] = useState(false)

  async function handleVote(type: 'like' | 'dislike') {
    const result = await vote(commentId, type)
    if (result === 'login_required') {
      setShowLogin(true)
      setTimeout(() => setShowLogin(false), 3000)
      return
    }
    if (result) onVoted()
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex gap-4 text-xs text-gray-400">
        <button onClick={() => handleVote('like')} disabled={loading} className="hover:text-blue-500 transition-colors">👍 {likes}</button>
        <button onClick={() => handleVote('dislike')} disabled={loading} className="hover:text-red-500 transition-colors">👎 {dislikes}</button>
      </div>
      {showLogin && (
        <button onClick={() => navigate('/login')} className="text-xs text-[#111] hover:underline animate-pulse">
          로그인 필요
        </button>
      )}
    </div>
  )
}
