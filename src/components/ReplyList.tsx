import { useState } from 'react'
import { TimeAgo } from './TimeAgo'
import { VoteButtons } from './VoteButtons'
import { CommentInput } from './CommentInput'
import type { Comment } from '../lib/types'

interface ReplyListProps {
  replies: Comment[]
  articleId: string
  parentId: string
  onRefresh: () => void
}

export function ReplyList({ replies, articleId, parentId, onRefresh }: ReplyListProps) {
  const [replyTo, setReplyTo] = useState<string | null>(null)

  return (
    <div className="mt-3 ml-6 space-y-0">
      {replies.map((reply) => (
        <div key={reply.id} className="py-3 px-3 bg-white rounded-lg border border-gray-100 mb-2">
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-sm font-semibold text-[#111]">{reply.profiles?.nickname ?? '알 수 없음'}</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400"><TimeAgo date={reply.created_at} /></span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed mb-2">
            {renderMention(reply.content)}
          </p>
          <div className="flex items-center gap-4">
            <VoteButtons commentId={reply.id} likes={reply.likes} dislikes={reply.dislikes} onVoted={onRefresh} />
            <button
              onClick={() => setReplyTo(replyTo === reply.id ? null : reply.id)}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              답글
            </button>
          </div>
          {replyTo === reply.id && (
            <div className="mt-2">
              <CommentInput
                articleId={articleId}
                parentId={parentId}
                initialValue={`@${reply.profiles?.nickname ?? ''} `}
                onSubmitted={() => { setReplyTo(null); onRefresh() }}
                placeholder="답글을 입력해주세요..."
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function renderMention(content: string) {
  const match = content.match(/^(@\S+)\s/)
  if (!match) return content

  const mention = match[1]
  const rest = content.slice(match[0].length)
  return (
    <>
      <span className="text-[#3b82f6] font-semibold">{mention}</span>{' '}{rest}
    </>
  )
}
