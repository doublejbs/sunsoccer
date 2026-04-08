import { useCommentVote } from '../hooks/useCommentVote'

interface VoteButtonsProps { commentId: string; likes: number; dislikes: number; onVoted: () => void }

export function VoteButtons({ commentId, likes, dislikes, onVoted }: VoteButtonsProps) {
  const { vote, loading } = useCommentVote()
  async function handleVote(type: 'like' | 'dislike') {
    const success = await vote(commentId, type)
    if (success) onVoted()
  }
  return (
    <div className="flex gap-4 text-xs text-gray-400">
      <button onClick={() => handleVote('like')} disabled={loading} className="hover:text-blue-500 transition-colors">👍 {likes}</button>
      <button onClick={() => handleVote('dislike')} disabled={loading} className="hover:text-red-500 transition-colors">👎 {dislikes}</button>
    </div>
  )
}
