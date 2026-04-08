import { NewsCard } from './NewsCard'
import { FeaturedCards } from './FeaturedCards'
import type { Article } from '../lib/types'

interface NewsListProps {
  articles: Article[]
  loading: boolean
  error: string | null
}

export function NewsList({ articles, loading, error }: NewsListProps) {
  if (loading) {
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
      <div className="px-4 lg:px-0">
        {rest.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}
