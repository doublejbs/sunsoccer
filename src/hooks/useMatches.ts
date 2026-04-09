import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Match } from '../lib/types'
import type { LeagueKey } from '../lib/constants'

function formatDate(d: Date) {
  return d.toISOString().split('T')[0]
}

export function useMatches(league: LeagueKey, from: string, to: string) {
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
          `${supabaseUrl}/functions/v1/football-data?league=${league}&type=matches&from=${from}&to=${to}`,
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
  }, [league, from, to])

  return { matches, loading, error }
}

export function getDateRange(offsetDays: number = 0) {
  const center = new Date()
  center.setDate(center.getDate() + offsetDays)
  const from = new Date(center)
  from.setDate(center.getDate() - 30)
  const to = new Date(center)
  to.setDate(center.getDate() + 30)
  return { from: formatDate(from), to: formatDate(to) }
}
