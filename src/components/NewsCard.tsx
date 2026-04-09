import { Link } from 'react-router-dom'
import { TimeAgo } from './TimeAgo'
import type { Article } from '../lib/types'

interface NewsCardProps {
  article: Article
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link to={`/news/${article.id}`} className="flex gap-3 py-4 border-b border-[#222]">
      {article.image_url && (
        <img
          src={article.image_url}
          alt=""
          className="w-20 h-20 lg:w-[120px] lg:h-20 object-cover rounded-lg flex-shrink-0"
        />
      )}
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] lg:text-base font-semibold text-[#f0f0f0] leading-snug mb-1.5 line-clamp-2">
          {article.title}
        </h3>
        <p className="hidden lg:block text-sm text-gray-400 leading-relaxed mb-2 line-clamp-2">
          {article.description}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
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
