import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Article } from '../lib/types'
import type { LeagueKey } from '../lib/constants'

const PER_PAGE = 20

export function useArticles(league: LeagueKey, search?: string) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const fetchArticles = useCallback(async (pageNum: number, reset: boolean) => {
    setLoading(true)
    if (reset) setError(null)

    let query = supabase
      .from('articles')
      .select('*')
      .eq('league', league)
      .order('pub_date', { ascending: false })
      .range((pageNum - 1) * PER_PAGE, pageNum * PER_PAGE - 1)

    if (search) query = query.ilike('title', '%' + search + '%')

    const { data, error: fetchError } = await query

    if (fetchError) {
      setError(fetchError.message)
    } else {
      const newArticles = data ?? []
      setArticles(prev => reset ? newArticles : [...prev, ...newArticles])
      setHasMore(newArticles.length === PER_PAGE)
    }
    setLoading(false)
  }, [league, search])

  useEffect(() => {
    setPage(1)
    setArticles([])
    fetchArticles(1, true)
  }, [league, search, fetchArticles])

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    const nextPage = page + 1
    setPage(nextPage)
    fetchArticles(nextPage, false)
  }, [loading, hasMore, page, fetchArticles])

  return { articles, loading, error, hasMore, loadMore }
}
