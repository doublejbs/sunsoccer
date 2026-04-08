import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Comment } from '../lib/types'
import { COMMENTS_PER_PAGE } from '../lib/constants'

type SortMode = 'best' | 'newest'

export function useComments(articleId: string) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [sortMode, setSortMode] = useState<SortMode>('best')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchComments = useCallback(async (reset: boolean = false) => {
    setLoading(true)
    const currentPage = reset ? 1 : page
    const orderCol = sortMode === 'best' ? 'likes' : 'created_at'
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles(nickname, avatar_url)')
      .eq('article_id', articleId)
      .is('parent_id', null)
      .order(orderCol, { ascending: false })
      .range((currentPage - 1) * COMMENTS_PER_PAGE, currentPage * COMMENTS_PER_PAGE - 1)

    if (!error && data) {
      const commentIds = data.map(c => c.id)
      const { data: replies } = await supabase
        .from('comments')
        .select('*, profiles(nickname, avatar_url)')
        .in('parent_id', commentIds)
        .order('created_at', { ascending: true })

      const commentsWithReplies = data.map(comment => ({
        ...comment,
        replies: (replies ?? []).filter(r => r.parent_id === comment.id)
      }))

      if (reset) setComments(commentsWithReplies)
      else setComments(prev => [...prev, ...commentsWithReplies])
      setHasMore(data.length === COMMENTS_PER_PAGE)
    }
    setLoading(false)
  }, [articleId, sortMode, page])

  useEffect(() => {
    setPage(1)
    fetchComments(true)
  }, [articleId, sortMode])

  const loadMore = () => { setPage(p => p + 1) }

  useEffect(() => {
    if (page > 1) fetchComments(false)
  }, [page])

  return { comments, loading, sortMode, setSortMode, hasMore, loadMore, refetch: () => fetchComments(true) }
}
