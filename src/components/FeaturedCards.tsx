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
    <div className="px-4 lg:px-0 mb-4 grid grid-cols-2 gap-3">
      <FeaturedCard article={first} />
      {second && <FeaturedCard article={second} />}
    </div>
  )
}

function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link
      to={`/news/${article.id}`}
      className="group relative block overflow-hidden rounded-lg"
    >
      {article.image_url ? (
        <img
          src={article.image_url}
          alt=""
          className="w-full h-40 lg:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className="w-full h-40 lg:h-56 bg-gray-300" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4">
        <h3 className="font-bold text-white text-sm lg:text-base leading-snug mb-1 drop-shadow line-clamp-2">
          {article.title}
        </h3>
        <div className="flex items-center gap-1.5 text-[10px] lg:text-xs text-white/60">
          <span>{article.source}</span>
          <span>·</span>
          <TimeAgo date={article.pub_date} />
          <span>·</span>
          <span>💬 {article.comment_count}</span>
        </div>
      </div>
    </Link>
  )
}
