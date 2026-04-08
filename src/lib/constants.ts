export const LEAGUES = [
  { key: 'epl', label: 'EPL' },
  { key: 'laliga', label: '라리가' },
  { key: 'seriea', label: '세리에A' },
  { key: 'bundesliga', label: '분데스리가' },
  { key: 'ligue1', label: '리그앙' },
] as const

export type LeagueKey = typeof LEAGUES[number]['key']

export const COMMENTS_PER_PAGE = 20
export const BEST_COMMENT_THRESHOLD = 10
