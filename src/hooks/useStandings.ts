import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Standing } from '../lib/types'
import type { LeagueKey } from '../lib/constants'

export function useStandings(league: LeagueKey) {
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStandings() {
      setLoading(true)
      setError(null)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const res = await fetch(
          `${supabaseUrl}/functions/v1/football-data?league=${league}&type=standings`,
          { headers: { 'Authorization': `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY}` } }
        )
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data = await res.json()
        // Extract total standings from first table
        const table = data.standings?.find((s: any) => s.type === 'TOTAL')
        setStandings(table?.table ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch standings')
      }
      setLoading(false)
    }
    fetchStandings()
  }, [league])

  return { standings, loading, error }
}
