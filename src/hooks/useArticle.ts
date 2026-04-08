import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Article } from '../lib/types'

export function useArticle(id: string | undefined) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    async function fetchArticle() {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('articles').select('*').eq('id', id).single()
      if (fetchError) setError(fetchError.message)
      else setArticle(data)
      setLoading(false)
    }
    fetchArticle()
  }, [id])

  return { article, loading, error }
}
