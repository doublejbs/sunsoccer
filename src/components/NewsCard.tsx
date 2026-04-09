import { Link } from 'react-router-dom'
import { TimeAgo } from './TimeAgo'
import type { Article } from '../lib/types'

interface NewsCardProps {
  article: Article
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link to={`/news/${article.id}`} className="block bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      {article.image_url && (
        <img src={article.image_url} alt="" className="w-full h-40 object-cover" />
      )}
      <div className="p-3">
        <span className="inline-block bg-[#111] text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide mb-2">{article.source}</span>
        <h3 className="font-headline font-bold text-[#111] leading-snug mb-1.5 line-clamp-3 text-sm lg:text-base">
          {article.title}
        </h3>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <TimeAgo date={article.pub_date} />
          <span>·</span>
          <span>💬 {article.comment_count}</span>
        </div>
      </div>
    </Link>
  )
}
