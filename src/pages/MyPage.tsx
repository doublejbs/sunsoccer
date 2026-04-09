import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { TimeAgo } from '../components/TimeAgo'
import type { Comment } from '../lib/types'

export function MyPage() {
  const { user, profile, loading: authLoading, updateNickname } = useAuth()
  const navigate = useNavigate()
  const [comments, setComments] = useState<(Comment & { articles?: { id: string; title: string } })[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [nicknameError, setNicknameError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

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

  if (authLoading) return <div className="p-4 text-center text-gray-500">로딩 중...</div>

  return (
    <div className="px-4 lg:px-0 py-6">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-[#f0f0f0] mb-3">마이페이지</h1>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              value={nicknameInput}
              onChange={(e) => { setNicknameInput(e.target.value); setNicknameError(null) }}
              maxLength={20}
              className="bg-[#141414] border border-[#333] text-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-gray-500 w-48"
              placeholder="새 닉네임"
              autoFocus
            />
            <button
              onClick={async () => {
                setSaving(true)
                const { error } = await updateNickname(nicknameInput)
                if (error) setNicknameError(error)
                else setEditing(false)
                setSaving(false)
              }}
              disabled={saving}
              className="text-xs bg-[#e30613] text-white px-3 py-1.5 rounded-lg disabled:opacity-40 hover:bg-[#c00510] transition-colors"
            >
              {saving ? '저장 중...' : '저장'}
            </button>
            <button
              onClick={() => { setEditing(false); setNicknameError(null) }}
              className="text-xs text-gray-400 hover:text-gray-200"
            >
              취소
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-300">{profile?.nickname ?? '설정 필요'}</span>
            <button
              onClick={() => { setNicknameInput(profile?.nickname ?? ''); setEditing(true) }}
              className="text-xs text-[#e30613] hover:underline"
            >
              수정
            </button>
          </div>
        )}
        {nicknameError && <p className="text-xs text-red-400 mt-1">{nicknameError}</p>}
      </div>

      <h2 className="text-sm font-semibold text-[#f0f0f0] mb-3">내 댓글</h2>
      {loading ? (
        <div className="text-sm text-gray-500">불러오는 중...</div>
      ) : comments.length === 0 ? (
        <div className="text-sm text-gray-500">작성한 댓글이 없습니다.</div>
      ) : (
        <ul className="space-y-0">
          {comments.map((c) => (
            <li key={c.id} className="py-3 border-b border-[#222]">
              <Link to={`/news/${c.articles?.id}`} className="text-xs text-[#e30613] hover:underline mb-1 block">
                {c.articles?.title}
              </Link>
              <p className="text-sm text-gray-300 mb-1">{c.content}</p>
              <div className="text-xs text-gray-500 flex gap-2">
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
