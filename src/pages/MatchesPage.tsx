import { useState } from 'react'
import { LeagueTabs } from '../components/LeagueTabs'
import { useMatches } from '../hooks/useMatches'
import type { LeagueKey } from '../lib/constants'
import type { Match } from '../lib/types'

function formatDateKey(utcDate: string) {
  const d = new Date(utcDate)
  return d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function formatDateLabel(utcDate: string) {
  const d = new Date(utcDate)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  const dateStr = d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })

  if (d.toDateString() === today.toDateString()) return `오늘 · ${dateStr}`
  if (d.toDateString() === yesterday.toDateString()) return `어제 · ${dateStr}`
  if (d.toDateString() === tomorrow.toDateString()) return `내일 · ${dateStr}`
  return dateStr
}

export function MatchesPage() {
  const [league, setLeague] = useState<LeagueKey>('epl')
  const { matches, loading, error } = useMatches(league)

  // Sort matches by date descending (most recent first)
  const sorted = [...matches].sort((a, b) => new Date(b.utcDate).getTime() - new Date(a.utcDate).getTime())

  // Group by date
  const grouped: { dateKey: string; dateLabel: string; matchday: number; matches: Match[] }[] = []
  const seen = new Map<string, number>()

  for (const match of sorted) {
    const key = formatDateKey(match.utcDate)
    if (seen.has(key)) {
      grouped[seen.get(key)!].matches.push(match)
    } else {
      seen.set(key, grouped.length)
      grouped.push({
        dateKey: key,
        dateLabel: formatDateLabel(match.utcDate),
        matchday: match.matchday,
        matches: [match],
      })
    }
  }

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

        {!loading && !error && grouped.length === 0 && (
          <div className="py-8 text-center text-gray-400 text-sm">경기 일정이 없습니다.</div>
        )}

        {grouped.map((group) => (
          <div key={group.dateKey} className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-[#111]">{group.dateLabel}</h2>
              <span className="text-xs text-gray-400">라운드 {group.matchday}</span>
            </div>
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              {group.matches.map((match, i) => (
                <MatchRow key={match.id} match={match} showBorder={i < group.matches.length - 1} />
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
      <div className="w-20 text-center mx-2">
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
          <span className="text-xs text-gray-400">
            {date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </span>
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
