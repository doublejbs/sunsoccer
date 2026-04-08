import { TimeAgo } from './TimeAgo'
import { VoteButtons } from './VoteButtons'
import type { Comment } from '../lib/types'

export function ReplyList({ replies, onRefresh }: { replies: Comment[]; onRefresh: () => void }) {
  return (
    <div className="mt-3 ml-6 space-y-0">
      {replies.map((reply) => (
        <div key={reply.id} className="py-3 px-3 bg-white rounded-lg border border-gray-100 mb-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-sm font-semibold text-[#111]">{reply.profiles?.nickname ?? '알 수 없음'}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400"><TimeAgo date={reply.created_at} /></span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">{reply.content}</p>
          <VoteButtons commentId={reply.id} likes={reply.likes} dislikes={reply.dislikes} onVoted={onRefresh} />
        </div>
      ))}
    </div>
  )
}
