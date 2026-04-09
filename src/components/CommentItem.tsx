import { useState } from 'react'
import { BestBadge } from './BestBadge'
import { VoteButtons } from './VoteButtons'
import { CommentInput } from './CommentInput'
import { ReplyList } from './ReplyList'
import { TimeAgo } from './TimeAgo'
import type { Comment } from '../lib/types'
import { BEST_COMMENT_THRESHOLD } from '../lib/constants'

interface CommentItemProps { comment: Comment; onRefresh: () => void }

export function CommentItem({ comment, onRefresh }: CommentItemProps) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const isBest = comment.likes >= BEST_COMMENT_THRESHOLD

  return (
    <div className={`py-4 px-4 lg:px-5 border-b border-gray-100 ${isBest ? 'bg-gray-50' : ''}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <BestBadge likes={comment.likes} />
        <span className="text-sm font-semibold text-[#111]">{comment.profiles?.nickname ?? '알 수 없음'}</span>
        <span className="text-xs text-gray-400">·</span>
        <span className="text-xs text-gray-400"><TimeAgo date={comment.created_at} /></span>
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-2.5">{comment.content}</p>
      <div className="flex items-center gap-4">
        <VoteButtons commentId={comment.id} likes={comment.likes} dislikes={comment.dislikes} onVoted={onRefresh} />
        <button onClick={() => setShowReplyInput(!showReplyInput)} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          답글 {comment.replies && comment.replies.length > 0 ? comment.replies.length : ''}
        </button>
      </div>
      {showReplyInput && (
        <div className="mt-3 ml-6">
          <CommentInput articleId={comment.article_id} parentId={comment.id}
            onSubmitted={() => { setShowReplyInput(false); onRefresh() }} placeholder="답글을 입력해주세요..." />
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && (
        <ReplyList replies={comment.replies} articleId={comment.article_id} parentId={comment.id} onRefresh={onRefresh} />
      )}
    </div>
  )
}
