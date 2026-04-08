import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const NAVER_CLIENT_ID = Deno.env.get('NAVER_CLIENT_ID')!
const NAVER_CLIENT_SECRET = Deno.env.get('NAVER_CLIENT_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const SEARCH_QUERIES: Record<string, string> = {
  all: '해외축구',
  epl: '프리미어리그',
  laliga: '라리가',
  seriea: '세리에A',
  bundesliga: '분데스리가',
  ligue1: '리그앙',
}

interface NaverNewsItem {
  title: string
  originallink: string
  link: string
  description: string
  pubDate: string
}

async function fetchNaverNews(query: string): Promise<NaverNewsItem[]> {
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=20&sort=date`
  const res = await fetch(url, {
    headers: {
      'X-Naver-Client-Id': NAVER_CLIENT_ID,
      'X-Naver-Client-Secret': NAVER_CLIENT_SECRET,
    },
  })
  if (!res.ok) { console.error(`Naver API error for "${query}":`, res.status); return [] }
  const data = await res.json()
  return data.items ?? []
}

function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
}

function extractSource(link: string): string {
  try { return new URL(link).hostname.replace('www.', '').split('.')[0] }
  catch { return '알 수 없음' }
}

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    let totalInserted = 0

    for (const [league, query] of Object.entries(SEARCH_QUERIES)) {
      const items = await fetchNaverNews(query)
      for (const item of items) {
        const articleLink = item.originallink || item.link
        const { error } = await supabase.from('articles').upsert(
          {
            title: stripHtmlTags(item.title),
            description: stripHtmlTags(item.description),
            source: extractSource(articleLink),
            link: articleLink,
            league,
            pub_date: new Date(item.pubDate).toISOString(),
          },
          { onConflict: 'link', ignoreDuplicates: true }
        )
        if (!error) totalInserted++
      }
    }

    return new Response(JSON.stringify({ success: true, inserted: totalInserted }),
      { headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    console.error('fetch-news error:', err)
    return new Response(JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
