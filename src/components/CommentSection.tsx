import { useComments } from '../hooks/useComments'
import { CommentInput } from './CommentInput'
import { CommentItem } from './CommentItem'

interface CommentSectionProps { articleId: string; commentCount: number }

export function CommentSection({ articleId, commentCount }: CommentSectionProps) {
  const { comments, loading, sortMode, setSortMode, hasMore, loadMore, refetch } = useComments(articleId)

  return (
    <div>
      <div className="flex justify-between items-center py-4 px-4 lg:px-0 border-b border-[#222]">
        <div className="font-semibold text-[15px] text-[#f0f0f0]">
          댓글 <span className="text-[#e30613]">{commentCount}</span>
        </div>
        <div className="flex gap-3 text-sm">
          <button onClick={() => setSortMode('best')}
            className={sortMode === 'best' ? 'font-semibold text-[#f0f0f0]' : 'text-gray-500'}>베스트순</button>
          <button onClick={() => setSortMode('newest')}
            className={sortMode === 'newest' ? 'font-semibold text-[#f0f0f0]' : 'text-gray-500'}>최신순</button>
        </div>
      </div>
      <div className="py-4 px-4 lg:px-0 border-b border-[#222]">
        <CommentInput articleId={articleId} onSubmitted={refetch} />
      </div>
      {loading && comments.length === 0 ? (
        <div className="py-8 text-center text-gray-500 text-sm">댓글을 불러오는 중...</div>
      ) : (
        <>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} onRefresh={refetch} />
          ))}
          {hasMore && (
            <div className="py-5 text-center">
              <button onClick={loadMore} disabled={loading}
                className="text-sm text-gray-400 border border-[#333] px-6 py-2 rounded-lg hover:border-[#555] transition-colors">
                {loading ? '불러오는 중...' : '댓글 더보기'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
