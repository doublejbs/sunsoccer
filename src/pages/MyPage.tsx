import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { TimeAgo } from '../components/TimeAgo'
import type { Comment } from '../lib/types'

export function MyPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [comments, setComments] = useState<(Comment & { articles?: { id: string; title: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [user, authLoading, navigate])

  useEffect(() => {
    if (!user) return
    async function fetchMyComments() {
      const { data } = await supabase
        .from('comments')
        .select('*, articles(id, title)')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (data) setComments(data as any)
      setLoading(false)
    }
    fetchMyComments()
  }, [user])

  if (authLoading) return <div className="p-4 text-center text-gray-400">로딩 중...</div>

  return (
    <div className="px-4 lg:px-0 py-6">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[#111] mb-1">마이페이지</h1>
        <p className="text-sm text-gray-500">닉네임: {profile?.nickname ?? '설정 필요'}</p>
      </div>

      <h2 className="text-sm font-semibold text-[#111] mb-3">내 댓글</h2>
      {loading ? (
        <div className="text-sm text-gray-400">불러오는 중...</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-gray-400">작성한 댓글이 없습니다.</div>
      ) : (
        <ul className="space-y-0">
          {comments.map((c) => (
            <li key={c.id} className="py-3 border-b border-gray-100">
              <Link to={`/news/${c.articles?.id}`} className="text-xs text-[#3b82f6] hover:underline mb-1 block">
                {c.articles?.title}
              </Link>
              <p className="text-sm text-gray-700 mb-1">{c.content}</p>
              <div className="text-xs text-gray-400 flex gap-2">
                <span>👍 {c.likes}</span>
                <span>👎 {c.dislikes}</span>
                <TimeAgo date={c.created_at} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
