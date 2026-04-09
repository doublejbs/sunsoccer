import { useSearchParams } from 'react-router-dom'
import { LeagueTabs } from '../components/LeagueTabs'
import { NewsList } from '../components/NewsList'
import { PopularCommentsSidebar } from '../components/PopularCommentsSidebar'
import { useArticles } from '../hooks/useArticles'
import { LEAGUES, type LeagueKey } from '../lib/constants'

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const leagueParam = searchParams.get('league') as LeagueKey | null
  const league: LeagueKey = LEAGUES.some(l => l.key === leagueParam) ? leagueParam! : 'epl'
  const search = searchParams.get('search') ?? undefined
  const { articles, loading, error, hasMore, loadMore } = useArticles(league, search)

  function handleLeagueSelect(key: LeagueKey) {
    const params = new URLSearchParams(searchParams)
    params.set('league', key)
    params.delete('search')
    setSearchParams(params)
  }

  return (
    <div>
      <div className="lg:hidden">
        <LeagueTabs selected={league} onSelect={handleLeagueSelect} />
      </div>

      <div className="lg:flex lg:gap-6 lg:py-4">
        <div className="flex-1">
          <div className="hidden lg:block mb-4 px-0">
            <LeagueTabs selected={league} onSelect={handleLeagueSelect} />
          </div>
          <NewsList articles={articles} loading={loading} error={error} hasMore={hasMore} onLoadMore={loadMore} />
        </div>

        <div className="hidden lg:block w-60 flex-shrink-0">
          <PopularCommentsSidebar />
        </div>
      </div>
    </div>
  )
}
