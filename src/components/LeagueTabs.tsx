import { LEAGUES, type LeagueKey } from '../lib/constants'

interface LeagueTabsProps {
  selected: LeagueKey
  onSelect: (league: LeagueKey) => void
}

export function LeagueTabs({ selected, onSelect }: LeagueTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 border-b border-gray-100 lg:px-0 lg:border-b-0 scrollbar-hide">
      {LEAGUES.map((league) => (
        <button
          key={league.key}
          onClick={() => onSelect(league.key)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selected === league.key
              ? 'bg-[#111] text-white'
              : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
          }`}
        >
          {league.label}
        </button>
      ))}
    </div>
  )
}
