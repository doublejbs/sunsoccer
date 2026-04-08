import { useParams } from 'react-router-dom'
import { useArticle } from '../hooks/useArticle'
import { CommentSection } from '../components/CommentSection'
import { TimeAgo } from '../components/TimeAgo'

export function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const { article, loading, error } = useArticle(id)

  if (loading) return <div className="p-4 text-center text-gray-400">로딩 중...</div>
  if (error || !article) return <div className="p-4 text-center text-red-500">기사를 찾을 수 없습니다.</div>

  return (
    <div className="px-4 lg:px-0 py-4">
      <div className="pb-4 border-b-2 border-[#111]">
        <h1 className="text-lg font-bold text-[#111] leading-snug mb-2">{article.title}</h1>
        <div className="text-sm text-gray-500 mb-3">
          {article.source} · <TimeAgo date={article.pub_date} />
        </div>
        {article.image_url && (
          <img
            src={article.image_url}
            alt=""
            className="w-full rounded-lg mb-3"
          />
        )}
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{article.description}</p>
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[#3b82f6] hover:underline">
          원문 기사 보기 →
        </a>
      </div>
      <CommentSection articleId={article.id} commentCount={article.comment_count} />
    </div>
  )
}
