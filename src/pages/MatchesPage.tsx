import { useState } from 'react'
import { LeagueTabs } from '../components/LeagueTabs'
import { useMatches } from '../hooks/useMatches'
import type { LeagueKey } from '../lib/constants'
import type { Match } from '../lib/types'

export function MatchesPage() {
  const [league, setLeague] = useState<LeagueKey>('epl')
  const { matches, loading, error } = useMatches(league)

  // Group by matchday
  const grouped = matches.reduce<Record<number, Match[]>>((acc, match) => {
    const day = match.matchday
    if (!acc[day]) acc[day] = []
    acc[day].push(match)
    return acc
  }, {})

  return (
    <div>
      <div className="lg:hidden">
        <LeagueTabs selected={league} onSelect={setLeague} />
      </div>
      <div className="px-4 lg:px-0 py-4">
        <div className="hidden lg:block mb-4">
          <LeagueTabs selected={league} onSelect={setLeague} />
        </div>

        <h1 className="text-lg font-bold text-[#111] mb-4">경기 일정</h1>

        {loading && <div className="py-8 text-center text-gray-400 text-sm">경기 일정을 불러오는 중...</div>}
        {error && <div className="py-8 text-center text-red-500 text-sm">오류: {error}</div>}

        {!loading && !error && Object.keys(grouped).length === 0 && (
          <div className="py-8 text-center text-gray-400 text-sm">경기 일정이 없습니다.</div>
        )}

        {Object.entries(grouped)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([matchday, dayMatches]) => (
          <div key={matchday} className="mb-6">
            <h2 className="text-sm font-semibold text-gray-500 mb-2">라운드 {matchday}</h2>
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              {dayMatches.map((match, i) => (
                <MatchRow key={match.id} match={match} showBorder={i < dayMatches.length - 1} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MatchRow({ match, showBorder }: { match: Match; showBorder: boolean }) {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isFinished = match.status === 'FINISHED'
  const date = new Date(match.utcDate)

  return (
    <div className={`flex items-center py-3 px-4 ${showBorder ? 'border-b border-gray-50' : ''}`}>
      {/* Home team */}
      <div className="flex-1 flex items-center justify-end gap-2">
        <span className="text-sm text-[#111] text-right">{match.homeTeam.shortName}</span>
        {match.homeTeam.crest && (
          <img src={match.homeTeam.crest} alt="" className="w-5 h-5 object-contain" />
        )}
      </div>

      {/* Score / Time */}
      <div className="w-24 text-center mx-2">
        {isLive ? (
          <div>
            <span className="text-sm font-bold text-[#111]">
              {match.score.fullTime.home} - {match.score.fullTime.away}
            </span>
            <span className="block text-[10px] text-red-500 font-semibold animate-pulse">진행중</span>
          </div>
        ) : isFinished ? (
          <span className="text-sm font-bold text-[#111]">
            {match.score.fullTime.home} - {match.score.fullTime.away}
          </span>
        ) : (
          <div>
            <span className="text-xs text-gray-500">
              {date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
            </span>
            <span className="block text-xs text-gray-400">
              {date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      {/* Away team */}
      <div className="flex-1 flex items-center gap-2">
        {match.awayTeam.crest && (
          <img src={match.awayTeam.crest} alt="" className="w-5 h-5 object-contain" />
        )}
        <span className="text-sm text-[#111]">{match.awayTeam.shortName}</span>
      </div>
    </div>
  )
}
