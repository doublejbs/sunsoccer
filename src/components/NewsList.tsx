import { useEffect, useRef } from 'react'
import { NewsCard } from './NewsCard'
import { FeaturedCards } from './FeaturedCards'
import { AdBanner } from './AdBanner'
import type { Article } from '../lib/types'

interface NewsListProps {
  articles: Article[]
  loading: boolean
  error: string | null
  hasMore?: boolean
  onLoadMore?: () => void
}

export function NewsList({ articles, loading, error, hasMore, onLoadMore }: NewsListProps) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!hasMore || !onLoadMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore()
      },
      { threshold: 0.1 }
    )

    const sentinel = sentinelRef.current
    if (sentinel) observer.observe(sentinel)

    return () => { if (sentinel) observer.unobserve(sentinel) }
  }, [hasMore, onLoadMore])

  if (loading && articles.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 text-sm">
        뉴스를 불러오는 중...
      </div>
    )
  }

  if (error) {
    return (
      <div className="py-8 text-center text-red-500 text-sm">
        오류가 발생했습니다: {error}
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="py-8 text-center text-gray-400 text-sm">
        뉴스가 없습니다.
      </div>
    )
  }

  // Articles with images get featured treatment
  const featured = articles.filter(a => a.image_url).slice(0, 2)
  const featuredIds = new Set(featured.map(a => a.id))
  const rest = articles.filter(a => !featuredIds.has(a.id))

  return (
    <div>
      <FeaturedCards articles={featured} />
      <AdBanner slot="8401350370" className="my-3 px-4 lg:px-0" />
      <div className="px-4 lg:px-0">
        {rest.map((article, index) => (
          <div key={article.id}>
            <NewsCard article={article} />
            {index === 4 && <AdBanner slot="8630053260" className="my-3" />}
          </div>
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div ref={sentinelRef} className="py-6 text-center text-gray-400 text-sm">
          {loading ? '불러오는 중...' : ''}
        </div>
      )}
    </div>
  )
}
