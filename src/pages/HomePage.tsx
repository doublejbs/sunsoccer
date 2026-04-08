import { useState } from 'react'
import { LeagueTabs } from '../components/LeagueTabs'
import { NewsList } from '../components/NewsList'
import { PopularCommentsSidebar } from '../components/PopularCommentsSidebar'
import { useArticles } from '../hooks/useArticles'
import type { LeagueKey } from '../lib/constants'

export function HomePage() {
  const [league, setLeague] = useState<LeagueKey>('all')
  const { articles, loading, error } = useArticles(league)

  return (
    <div>
      {/* Mobile league tabs (shown below header on mobile) */}
      <div className="lg:hidden">
        <LeagueTabs selected={league} onSelect={setLeague} />
      </div>

      <div className="lg:flex lg:gap-6 lg:py-6">
        {/* Main news list */}
        <div className="flex-1">
          <NewsList articles={articles} loading={loading} error={error} />
        </div>

        {/* Sidebar: PC only */}
        <div className="hidden lg:block w-60 flex-shrink-0">
          <PopularCommentsSidebar />
        </div>
      </div>
    </div>
  )
}
