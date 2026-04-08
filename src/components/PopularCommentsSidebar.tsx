import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Comment } from '../lib/types'

export function PopularCommentsSidebar() {
  const [comments, setComments] = useState<(Comment & { profiles: { nickname: string } })[]>([])

  useEffect(() => {
    async function fetchPopular() {
      const { data } = await supabase
        .from('comments')
        .select('id, content, likes, profiles(nickname)')
        .gte('likes', 10)
        .order('likes', { ascending: false })
        .limit(5)

      if (data) setComments(data as any)
    }
    fetchPopular()
  }, [])

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="font-semibold text-sm text-[#111] mb-3">🔥 인기 댓글</h3>
      {comments.length === 0 ? (
        <p className="text-xs text-gray-400">아직 인기 댓글이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="text-xs text-gray-700 leading-relaxed pb-3 border-b border-gray-200 last:border-b-0">
              "{c.content.length > 40 ? c.content.slice(0, 40) + '...' : c.content}"
              <span className="text-gray-400 ml-1">👍 {c.likes}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
