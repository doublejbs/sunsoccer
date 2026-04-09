import { useState } from 'react'
import { LeagueTabs } from '../components/LeagueTabs'
import { useStandings } from '../hooks/useStandings'
import type { LeagueKey } from '../lib/constants'

export function StandingsPage() {
  const [league, setLeague] = useState<LeagueKey>('epl')
  const { standings, loading, error } = useStandings(league)

  const totalTeams = standings.length

  return (
    <div>
      <div className="lg:hidden">
        <LeagueTabs selected={league} onSelect={setLeague} />
      </div>
      <div className="px-4 lg:px-0 py-4">
        <div className="hidden lg:block mb-4">
          <LeagueTabs selected={league} onSelect={setLeague} />
        </div>

        <h1 className="text-lg font-bold text-[#111] mb-4">순위표</h1>

        {loading && <div className="py-8 text-center text-gray-500 text-sm">순위표를 불러오는 중...</div>}
        {error && <div className="py-8 text-center text-red-400 text-sm">오류: {error}</div>}

        {!loading && !error && standings.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="flex items-center py-2 px-3 bg-gray-50 text-xs font-semibold text-gray-500 border-b border-gray-100">
              <span className="w-8 text-center">#</span>
              <span className="flex-1 pl-2">팀</span>
              <span className="w-8 text-center">경기</span>
              <span className="w-8 text-center">승</span>
              <span className="w-8 text-center">무</span>
              <span className="w-8 text-center">패</span>
              <span className="w-10 text-center hidden lg:block">득실</span>
              <span className="w-10 text-center font-bold">승점</span>
            </div>

            {/* Rows */}
            {standings.map((row) => {
              const isChampionsLeague = row.position <= 4
              const isRelegation = row.position > totalTeams - 3

              return (
                <div
                  key={row.team.id}
                  className={`flex items-center py-2.5 px-3 border-b border-gray-50 last:border-b-0 text-sm ${
                    isChampionsLeague ? 'border-l-2 border-l-blue-500' :
                    isRelegation ? 'border-l-2 border-l-red-500' : ''
                  }`}
                >
                  <span className={`w-8 text-center text-xs font-semibold ${
                    isChampionsLeague ? 'text-blue-500' : isRelegation ? 'text-red-500' : 'text-gray-500'
                  }`}>
                    {row.position}
                  </span>
                  <div className="flex-1 flex items-center gap-2 pl-2 min-w-0">
                    {row.team.crest && (
                      <img src={row.team.crest} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
                    )}
                    <span className="text-[#111] truncate text-sm">{row.team.shortName}</span>
                  </div>
                  <span className="w-8 text-center text-gray-500 text-xs">{row.playedGames}</span>
                  <span className="w-8 text-center text-gray-500 text-xs">{row.won}</span>
                  <span className="w-8 text-center text-gray-500 text-xs">{row.draw}</span>
                  <span className="w-8 text-center text-gray-500 text-xs">{row.lost}</span>
                  <span className="w-10 text-center text-gray-500 text-xs hidden lg:block">
                    {row.goalDifference > 0 ? '+' : ''}{row.goalDifference}
                  </span>
                  <span className="w-10 text-center font-bold text-[#111] text-sm">{row.points}</span>
                </div>
              )
            })}
          </div>
        )}

        {!loading && !error && standings.length > 0 && (
          <div className="flex gap-4 mt-3 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-400 rounded-full"></span> 챔피언스리그
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span> 강등권
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
