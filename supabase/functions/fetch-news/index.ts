import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const NAVER_CLIENT_ID = Deno.env.get('NAVER_CLIENT_ID')!
const NAVER_CLIENT_SECRET = Deno.env.get('NAVER_CLIENT_SECRET')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const SEARCH_QUERIES: Record<string, string> = {
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
  const url = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(query)}&display=100&sort=date`
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
  return str
    .replace(/<[^>]*>/g, '')
    .replace(/&#0*39;/g, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#0*34;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lsquo;/g, '\u2018')
    .replace(/&rsquo;/g, '\u2019')
    .replace(/&ldquo;/g, '\u201C')
    .replace(/&rdquo;/g, '\u201D')
    .replace(/&hellip;/g, '\u2026')
    .replace(/&middot;/g, '\u00B7')
    .replace(/&#(\d+);/g, (_m, c) => String.fromCharCode(Number(c)))
    .replace(/&#x([0-9a-f]+);/gi, (_m, c) => String.fromCharCode(parseInt(c, 16)))
}

function extractSource(link: string): string {
  try { return new URL(link).hostname.replace('www.', '').split('.')[0] }
  catch { return '알 수 없음' }
}

async function extractOgMeta(url: string): Promise<{ image: string | null; title: string | null; description: string | null }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    })
    clearTimeout(timeout)
    if (!res.ok) return { image: null, title: null, description: null }
    const html = await res.text()
    const imageMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i)
    const titleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i)
    const descMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i)
    const decode = (s: string) => stripHtmlTags(s)
    return {
      image: imageMatch ? imageMatch[1] : null,
      title: titleMatch ? decode(titleMatch[1]) : null,
      description: descMatch ? decode(descMatch[1]) : null,
    }
  } catch {
    return { image: null, title: null, description: null }
  }
}

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    let totalInserted = 0

    for (const [league, query] of Object.entries(SEARCH_QUERIES)) {
      const items = await fetchNaverNews(query)
      for (const item of items) {
        const articleLink = item.originallink || item.link
        const og = await extractOgMeta(articleLink)
        const { error } = await supabase.from('articles').upsert(
          {
            title: og.title || stripHtmlTags(item.title),
            description: og.description || stripHtmlTags(item.description),
            source: extractSource(articleLink),
            link: articleLink,
            league,
            pub_date: new Date(item.pubDate).toISOString(),
            image_url: og.image,
          },
          { onConflict: 'link', ignoreDuplicates: false }
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
