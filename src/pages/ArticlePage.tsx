import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useArticle } from '../hooks/useArticle'
import { supabase } from '../lib/supabase'
import type { Article } from '../lib/types'
import { CommentSection } from '../components/CommentSection'
import { NewsCard } from '../components/NewsCard'
import { TimeAgo } from '../components/TimeAgo'
import { AdBanner } from '../components/AdBanner'

function useRelatedArticles(article: Article | null) {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    if (!article) return
    supabase
      .from('articles')
      .select('*')
      .eq('league', article.league)
      .neq('id', article.id)
      .order('pub_date', { ascending: false })
      .limit(5)
      .then(({ data }) => setArticles(data ?? []))
  }, [article])

  return articles
}

export function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const { article, loading, error } = useArticle(id)
  const related = useRelatedArticles(article)

  if (loading) return <div className="p-4 text-center text-gray-500">로딩 중...</div>
  if (error || !article) return <div className="p-4 text-center text-red-400">기사를 찾을 수 없습니다.</div>

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
            className="max-w-full max-h-64 rounded-lg mb-3 mx-auto block"
          />
        )}
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{article.description}</p>
        <div className="flex items-center gap-4">
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-sm text-[#111] font-semibold hover:underline">
            원문 기사 보기 →
          </a>
          <button
            onClick={() => {
              const shareUrl = `${window.location.origin}/news/${article.id}`
              navigator.clipboard.writeText(shareUrl)
              alert('공유 링크가 복사되었습니다.')
            }}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            공유
          </button>
        </div>
      </div>
      <AdBanner slot="8401350370" className="my-4" />
      <CommentSection articleId={article.id} commentCount={article.comment_count} />
      {related.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-bold text-[#111] mb-1">추천 기사</h2>
          {related.map((a) => <NewsCard key={a.id} article={a} />)}
        </div>
      )}
    </div>
  )
}
