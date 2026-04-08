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
  const { articles, loading, error } = useArticles(league, 1, search)

  return (
    <div>
      {/* Mobile league tabs (shown below header on mobile) */}
      <div className="lg:hidden">
        <LeagueTabs selected={league} onSelect={setLeague} />
      </div>

      <div className="lg:flex lg:gap-6 lg:py-6">
        {/* Main news list */}
        <div className="flex-1">
          {/* PC league tabs (shown inside main column on PC) */}
          <div className="hidden lg:block mb-4">
            <LeagueTabs selected={league} onSelect={setLeague} />
          </div>
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
