import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Match } from '../lib/types'
import type { LeagueKey } from '../lib/constants'

function formatDate(d: Date) {
  return d.toISOString().split('T')[0]
}

function getRange(centerOffset: number) {
  const center = new Date()
  center.setDate(center.getDate() + centerOffset)
  const from = new Date(center)
  from.setDate(center.getDate() - 30)
  const to = new Date(center)
  to.setDate(center.getDate() + 30)
  return { from: formatDate(from), to: formatDate(to) }
}

export function useMatches(league: LeagueKey) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [earlierOffset, setEarlierOffset] = useState(0)
  const [laterOffset, setLaterOffset] = useState(0)
  const [hasEarlier, setHasEarlier] = useState(true)
  const [hasLater, setHasLater] = useState(true)

  async function fetchRange(from: string, to: string) {
    const { data: { session } } = await supabase.auth.getSession()
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const res = await fetch(
      `${supabaseUrl}/functions/v1/football-data?league=${league}&type=matches&from=${from}&to=${to}`,
      { headers: { 'Authorization': `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_ANON_KEY}` } }
    )
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    return (data.matches ?? []) as Match[]
  }

  // Initial load
  useEffect(() => {
    async function init() {
      setLoading(true)
      setError(null)
      setMatches([])
      setEarlierOffset(0)
      setLaterOffset(0)
      setHasEarlier(true)
      setHasLater(true)
      try {
        const { from, to } = getRange(0)
        const data = await fetchRange(from, to)
        setMatches(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch matches')
      }
      setLoading(false)
    }
    init()
  }, [league])

  const loadEarlier = useCallback(async () => {
    if (loadingMore) return
    setLoadingMore(true)
    try {
      const newOffset = earlierOffset - 30
      const { from, to } = getRange(newOffset)
      const data = await fetchRange(from, to)
      setMatches(prev => {
        const existingIds = new Set(prev.map(m => m.id))
        const newMatches = data.filter(m => !existingIds.has(m.id))
        if (newMatches.length === 0) setHasEarlier(false)
        return [...newMatches, ...prev]
      })
      setEarlierOffset(newOffset)
    } catch { /* ignore */ }
    setLoadingMore(false)
  }, [loadingMore, earlierOffset, league])

  const loadLater = useCallback(async () => {
    if (loadingMore) return
    setLoadingMore(true)
    try {
      const newOffset = laterOffset + 30
      const { from, to } = getRange(newOffset)
      const data = await fetchRange(from, to)
      setMatches(prev => {
        const existingIds = new Set(prev.map(m => m.id))
        const newMatches = data.filter(m => !existingIds.has(m.id))
        if (newMatches.length === 0) setHasLater(false)
        return [...prev, ...newMatches]
      })
      setLaterOffset(newOffset)
    } catch { /* ignore */ }
    setLoadingMore(false)
  }, [loadingMore, laterOffset, league])

  return { matches, loading, loadingMore, error, hasEarlier, hasLater, loadEarlier, loadLater }
}
