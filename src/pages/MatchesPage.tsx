import { useState, useEffect, useRef } from 'react'
import { LeagueTabs } from '../components/LeagueTabs'
import { useMatches } from '../hooks/useMatches'
import type { LeagueKey } from '../lib/constants'
import type { Match } from '../lib/types'

function toDateKey(utcDate: string) {
  return new Date(utcDate).toISOString().split('T')[0]
}

function formatDateLabel(dateKey: string) {
  const d = new Date(dateKey + 'T12:00:00')
  const today = new Date()
  const todayKey = today.toISOString().split('T')[0]
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  const label = d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })

  if (dateKey === todayKey) return { label: '오늘', sub: label, isToday: true }
  if (dateKey === yesterday.toISOString().split('T')[0]) return { label: '어제', sub: label, isToday: false }
  if (dateKey === tomorrow.toISOString().split('T')[0]) return { label: '내일', sub: label, isToday: false }
  return { label, sub: '', isToday: false }
}

interface DateGroup {
  dateKey: string
  matchday: number
  matches: Match[]
}

export function MatchesPage() {
  const [league, setLeague] = useState<LeagueKey>('epl')
  const { matches, loading, loadingMore, error, hasEarlier, hasLater, loadEarlier, loadLater } = useMatches(league)
  const todayRef = useRef<HTMLDivElement>(null)
  const scrolledRef = useRef(false)

  // Sort ascending (past → future)
  const sorted = [...matches].sort((a, b) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())

  // Group by date
  const groups: DateGroup[] = []
  const seen = new Map<string, number>()
  for (const match of sorted) {
    const key = toDateKey(match.utcDate)
    if (seen.has(key)) {
      groups[seen.get(key)!].matches.push(match)
    } else {
      seen.set(key, groups.length)
      groups.push({ dateKey: key, matchday: match.matchday, matches: [match] })
    }
  }

  // Find today or closest future date for scroll target
  const todayKey = new Date().toISOString().split('T')[0]
  const todayIndex = groups.findIndex(g => g.dateKey >= todayKey)

  useEffect(() => {
    if (!loading && groups.length > 0 && todayRef.current && !scrolledRef.current) {
      scrolledRef.current = true
      setTimeout(() => {
        todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    }
  }, [loading, groups.length])

  useEffect(() => {
    scrolledRef.current = false
  }, [league])

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

        {loading && <div className="py-8 text-center text-gray-500 text-sm">경기 일정을 불러오는 중...</div>}
        {error && <div className="py-8 text-center text-red-400 text-sm">오류: {error}</div>}

        {!loading && !error && groups.length === 0 && (
          <div className="py-8 text-center text-gray-500 text-sm">경기 일정이 없습니다.</div>
        )}

        {!loading && !error && groups.length > 0 && (
          <>
            {/* Load earlier button */}
            {hasEarlier && (
              <div className="text-center mb-4">
                <button
                  onClick={loadEarlier}
                  disabled={loadingMore}
                  className="text-xs text-gray-500 border border-gray-200 px-5 py-2 rounded-lg hover:border-gray-400 disabled:opacity-40 transition-colors"
                >
                  {loadingMore ? '불러오는 중...' : '← 이전 경기 더보기'}
                </button>
              </div>
            )}

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-[7px] lg:left-[9px] top-0 bottom-0 w-px bg-gray-200" />

              {groups.map((group, idx) => {
                const { label, sub, isToday } = formatDateLabel(group.dateKey)
                const isTodayOrTarget = idx === todayIndex
                const isPast = idx < (todayIndex === -1 ? groups.length : todayIndex)

                return (
                  <div
                    key={group.dateKey}
                    ref={isTodayOrTarget ? todayRef : undefined}
                    className="relative pl-7 lg:pl-8 pb-5"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-1 w-[15px] h-[15px] lg:w-[19px] lg:h-[19px] rounded-full border-2 ${
                      isToday
                        ? 'bg-[#111] border-[#111] ring-4 ring-gray-200'
                        : isPast
                          ? 'bg-gray-300 border-gray-300'
                          : 'bg-white border-gray-300'
                    }`} />

                    {/* Date header */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className={`text-sm font-bold ${isToday ? 'text-[#111]' : isPast ? 'text-gray-400' : 'text-[#111]'}`}>
                        {label}
                      </span>
                      {sub && <span className="text-xs text-gray-400">{sub}</span>}
                      <span className="text-[11px] text-gray-400 ml-auto">R{group.matchday}</span>
                    </div>

                    {/* Match cards */}
                    <div className={`rounded-xl border overflow-hidden ${
                      isToday
                        ? 'bg-white border-gray-200 shadow-sm'
                        : isPast
                          ? 'bg-gray-50 border-gray-100'
                          : 'bg-white border-gray-100'
                    }`}>
                      {group.matches.map((match, i) => (
                        <MatchRow
                          key={match.id}
                          match={match}
                          dimmed={isPast}
                          showBorder={i < group.matches.length - 1}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Load later button */}
            {hasLater && (
              <div className="text-center mt-2 mb-4">
                <button
                  onClick={loadLater}
                  disabled={loadingMore}
                  className="text-xs text-gray-500 border border-gray-200 px-5 py-2 rounded-lg hover:border-gray-400 disabled:opacity-40 transition-colors"
                >
                  {loadingMore ? '불러오는 중...' : '다음 경기 더보기 →'}
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Scroll to today floating button */}
      {!loading && groups.length > 0 && (
        <button
          onClick={() => todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          className="fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#111] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg hover:bg-gray-800 transition-colors z-20"
        >
          최근
        </button>
      )}
    </div>
  )
}

function MatchRow({ match, dimmed, showBorder }: { match: Match; dimmed: boolean; showBorder: boolean }) {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PLAY' || match.status === 'PAUSED'
  const isFinished = match.status === 'FINISHED'
  const date = new Date(match.utcDate)

  return (
    <div className={`flex items-center py-3 px-3 lg:px-4 ${showBorder ? 'border-b border-gray-100' : ''} ${dimmed && !isLive ? 'opacity-60' : ''}`}>
      {/* Home team */}
      <div className="flex-1 flex items-center justify-end gap-1.5 min-w-0">
        <span className="text-sm text-[#111] text-right truncate">{match.homeTeam.shortName}</span>
        {match.homeTeam.crest && (
          <img src={match.homeTeam.crest} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
        )}
      </div>

      {/* Score / Time */}
      <div className="w-20 text-center mx-1.5 flex-shrink-0">
        {isLive ? (
          <div>
            <span className="text-sm font-bold text-[#111]">
              {match.score.fullTime.home} - {match.score.fullTime.away}
            </span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-red-500 font-semibold">LIVE</span>
            </div>
          </div>
        ) : isFinished ? (
          <div>
            <span className="text-sm font-bold text-[#111]">
              {match.score.fullTime.home} - {match.score.fullTime.away}
            </span>
            <span className="block text-[10px] text-gray-400">종료</span>
          </div>
        ) : (
          <div>
            <span className="text-sm font-semibold text-[#111]">
              {date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span className="block text-[10px] text-gray-400">예정</span>
          </div>
        )}
      </div>

      {/* Away team */}
      <div className="flex-1 flex items-center gap-1.5 min-w-0">
        {match.awayTeam.crest && (
          <img src={match.awayTeam.crest} alt="" className="w-5 h-5 object-contain flex-shrink-0" />
        )}
        <span className="text-sm text-[#111] truncate">{match.awayTeam.shortName}</span>
      </div>
    </div>
  )
}
