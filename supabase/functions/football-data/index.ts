import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const API_KEY = Deno.env.get('FOOTBALL_DATA_API_KEY')!
const BASE_URL = 'https://api.football-data.org/v4'

// League codes for Football-Data.org
const LEAGUE_MAP: Record<string, string> = {
  epl: 'PL',
  laliga: 'PD',
  seriea: 'SA',
  bundesliga: 'BL1',
  ligue1: 'FL1',
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const league = url.searchParams.get('league') ?? 'epl'
  const type = url.searchParams.get('type') ?? 'matches' // 'matches' or 'standings'

  const competitionCode = LEAGUE_MAP[league]
  if (!competitionCode) {
    return new Response(JSON.stringify({ error: 'Invalid league' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  let endpoint = ''
  if (type === 'standings') {
    endpoint = `${BASE_URL}/competitions/${competitionCode}/standings`
  } else {
    // Get matches for current matchday and nearby
    endpoint = `${BASE_URL}/competitions/${competitionCode}/matches?status=SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED&limit=20`
  }

  try {
    const res = await fetch(endpoint, {
      headers: { 'X-Auth-Token': API_KEY }
    })

    if (!res.ok) {
      return new Response(JSON.stringify({ error: `API error: ${res.status}` }), {
        status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300'
      }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
