import { Link } from 'react-router-dom'
import { TimeAgo } from './TimeAgo'
import type { Article } from '../lib/types'

interface NewsCardProps {
  article: Article
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link to={`/news/${article.id}`} className="block py-4 border-b border-gray-100">
      <h3 className="text-[15px] lg:text-base font-semibold text-[#111] leading-snug mb-1.5 line-clamp-2">
        {article.title}
      </h3>
      <p className="hidden lg:block text-sm text-gray-500 leading-relaxed mb-2 line-clamp-2">
        {article.description}
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>{article.source}</span>
        <span>·</span>
        <TimeAgo date={article.pub_date} />
        <span>·</span>
        <span>💬 {article.comment_count}</span>
      </div>
    </Link>
  )
}
