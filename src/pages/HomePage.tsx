import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { LeagueTabs } from '../components/LeagueTabs'
import { NewsList } from '../components/NewsList'
import { PopularCommentsSidebar } from '../components/PopularCommentsSidebar'
import { useArticles } from '../hooks/useArticles'
import type { LeagueKey } from '../lib/constants'

export function HomePage() {
  const [league, setLeague] = useState<LeagueKey>('epl')
  const [searchParams] = useSearchParams()
  const search = searchParams.get('search') ?? undefined
  const { articles, loading, error, hasMore, loadMore } = useArticles(league, search)

  return (
    <div>
      {/* Mobile league tabs (shown below header on mobile) */}
      <div className="lg:hidden">
        <LeagueTabs selected={league} onSelect={setLeague} />
      </div>

      {/* Section title — The Sun style */}
      <div className="px-4 lg:px-0 pt-4 pb-2">
        <h1 className="font-headline font-bold text-2xl lg:text-3xl text-[#111] tracking-tight">FOOTBALL</h1>
      </div>

      <div className="lg:flex lg:gap-6 lg:pb-6">
        {/* Main news list */}
        <div className="flex-1">
          {/* PC league tabs (shown inside main column on PC) */}
          <div className="hidden lg:block mb-4 px-0">
            <LeagueTabs selected={league} onSelect={setLeague} />
          </div>
          <NewsList articles={articles} loading={loading} error={error} hasMore={hasMore} onLoadMore={loadMore} />
        </div>

        {/* Sidebar: PC only */}
        <div className="hidden lg:block w-60 flex-shrink-0">
          <PopularCommentsSidebar />
        </div>
      </div>
    </div>
  )
}
