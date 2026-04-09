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
    <div className="mb-4">
      {/* Hero — full width, The Sun style */}
      <Link
        to={`/news/${first.id}`}
        className="group relative block overflow-hidden"
      >
        {first.image_url ? (
          <img
            src={first.image_url}
            alt=""
            loading="eager"
            className="w-full h-64 lg:h-[400px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-64 lg:h-[400px] bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-8">
          <h2 className="font-headline font-bold text-white text-xl lg:text-3xl leading-tight mb-2 drop-shadow-lg line-clamp-3">
            {first.title}
          </h2>
          <div className="flex items-center gap-2 text-xs text-white/70">
            <span className="bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">{first.source}</span>
            <TimeAgo date={first.pub_date} />
            <span>·</span>
            <span>💬 {first.comment_count}</span>
          </div>
        </div>
      </Link>

      {/* Second article — smaller */}
      {second && (
        <Link
          to={`/news/${second.id}`}
          className="group relative block overflow-hidden mt-3 mx-4 lg:mx-0"
        >
          {second.image_url ? (
            <img
              src={second.image_url}
              alt=""
              loading="lazy"
              className="w-full h-40 lg:h-52 object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-40 lg:h-52 bg-gray-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6">
            <h3 className="font-headline font-bold text-white text-base lg:text-xl leading-tight mb-1.5 drop-shadow-lg line-clamp-2">
              {second.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-white/70">
              <span className="bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide">{second.source}</span>
              <TimeAgo date={second.pub_date} />
              <span>·</span>
              <span>💬 {second.comment_count}</span>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}
