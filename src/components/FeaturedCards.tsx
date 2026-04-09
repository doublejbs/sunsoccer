import { Link } from 'react-router-dom'
import { TimeAgo } from './TimeAgo'
import type { Article } from '../lib/types'

interface FeaturedCardsProps {
  articles: Article[]
}

export function FeaturedCards({ articles }: FeaturedCardsProps) {
  if (articles.length === 0) return null

  const [first, second] = articles

  return (
    <div className="px-4 lg:px-0 mb-2">
      {/* Single hero on mobile, side-by-side on PC */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <FeaturedCard article={first} priority />
        {second && <FeaturedCard article={second} />}
      </div>
    </div>
  )
}

function FeaturedCard({ article, priority }: { article: Article; priority?: boolean }) {
  return (
    <Link
      to={`/news/${article.id}`}
      className="group relative block rounded-none lg:rounded-lg overflow-hidden bg-gray-200"
    >
      {/* Image */}
      {article.image_url ? (
        <img
          src={article.image_url}
          alt=""
          loading={priority ? 'eager' : 'lazy'}
          className="w-full h-48 lg:h-56 object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
        />
      ) : (
        <div className="w-full h-48 lg:h-56 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]" />
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
        <h3 className="text-[15px] lg:text-lg font-bold text-white leading-snug mb-2 line-clamp-2 drop-shadow-sm">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-300">
          <span>{article.source}</span>
          <span className="opacity-50">·</span>
          <TimeAgo date={article.pub_date} />
          <span className="opacity-50">·</span>
          <span>💬 {article.comment_count}</span>
        </div>
      </div>
    </Link>
  )
}
