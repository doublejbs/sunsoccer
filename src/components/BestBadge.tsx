import { BEST_COMMENT_THRESHOLD } from '../lib/constants'
export function BestBadge({ likes }: { likes: number }) {
  if (likes < BEST_COMMENT_THRESHOLD) return null
  return <span className="bg-[#e30613] text-white text-[10px] px-1.5 py-0.5 rounded font-bold">BEST</span>
}
