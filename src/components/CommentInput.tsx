import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { LoginPrompt } from './LoginPrompt'

interface CommentInputProps {
  articleId: string
  parentId?: string
  onSubmitted: () => void
  placeholder?: string
  initialValue?: string
}

export function CommentInput({ articleId, parentId, onSubmitted, placeholder = '댓글을 입력해주세요...', initialValue = '' }: CommentInputProps) {
  const { user } = useAuth()
  const [content, setContent] = useState(initialValue)
  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    return <LoginPrompt message="댓글을 작성하려면 로그인이 필요합니다." />
  }

  async function handleSubmit() {
    if (!content.trim() || submitting) return

    setSubmitting(true)
    const { error } = await supabase.from('comments').insert({
      article_id: articleId, user_id: user!.id, parent_id: parentId ?? null, content: content.trim(),
    })
    if (error) alert('댓글 작성에 실패했습니다.')
    else { setContent(''); onSubmitted() }
    setSubmitting(false)
  }

  return (
    <div className="border border-gray-200 rounded-lg p-3">
      <textarea value={content} onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder} maxLength={1000} rows={3}
        className="w-full text-sm text-gray-700 placeholder-gray-400 resize-none outline-none bg-transparent" />
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-400">{content.length}/1000</span>
        <button onClick={handleSubmit} disabled={!content.trim() || submitting}
          className="bg-[#111] text-white px-4 py-1.5 rounded-md text-xs font-semibold disabled:opacity-40 hover:bg-gray-800 transition-colors">
          {submitting ? '등록 중...' : '등록'}
        </button>
      </div>
    </div>
  )
}
