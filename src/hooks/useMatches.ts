import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Match } from '../lib/types'
import type { LeagueKey } from '../lib/constants'

export function useMatches(league: LeagueKey) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true)
      setError(null)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const res = await fetch(
          `${supabaseUrl}/functions/v1/football-data?league=${league}&type=matches`,
          { headers: { 'Authorization': `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY}` } }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        setMatches(data.matches ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches')
      }
      setLoading(false)
    }
    fetchMatches()
  }, [league])

  return { matches, loading, error }
}
