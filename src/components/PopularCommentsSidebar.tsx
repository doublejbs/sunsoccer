import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface PopularComment {
  id: string
  content: string
  likes: number
  article_id: string
  profiles: { nickname: string }
}

export function PopularCommentsSidebar() {
  const [comments, setComments] = useState<PopularComment[]>([])

  useEffect(() => {
    async function fetchPopular() {
      const { data } = await supabase
        .from('comments')
        .select('id, content, likes, article_id, profiles(nickname)')
        .gte('likes', 10)
        .order('likes', { ascending: false })
        .limit(5)

      if (data) setComments(data as unknown as PopularComment[])
    }
    fetchPopular()
  }, [])

  return (
    <div className="bg-[#141414] rounded-lg p-4">
      <h3 className="font-semibold text-sm text-[#f0f0f0] mb-3">🔥 인기 댓글</h3>
      {comments.length === 0 ? (
        <p className="text-xs text-gray-500">아직 인기 댓글이 없습니다.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="pb-3 border-b border-[#333] last:border-b-0">
              <Link to={`/news/${c.article_id}`} className="block hover:bg-[#1a1a1a] -mx-1 px-1 rounded transition-colors">
                <p className="text-xs text-gray-300 leading-relaxed">
                  "{c.content.length > 40 ? c.content.slice(0, 40) + '...' : c.content}"
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{c.profiles?.nickname}</span>
                  <span className="text-xs text-gray-500">👍 {c.likes}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
