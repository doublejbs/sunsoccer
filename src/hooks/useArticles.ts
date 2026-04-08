import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Article } from '../lib/types'
import type { LeagueKey } from '../lib/constants'

export function useArticles(league: LeagueKey, page: number = 1, search?: string) {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const perPage = 20

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('articles')
        .select('*')
        .order('pub_date', { ascending: false })
        .range((page - 1) * perPage, page * perPage - 1)

      if (league !== 'all') {
        query = query.eq('league', league)
      }

      if (search) query = query.ilike('title', '%' + search + '%')

      const { data, error: fetchError } = await query

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setArticles(data ?? [])
      }
      setLoading(false)
    }

    fetchArticles()
  }, [league, page, search])

  return { articles, loading, error }
}
