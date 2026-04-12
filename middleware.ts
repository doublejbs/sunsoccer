const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''

const BOT_PATTERNS = /kakaotalk|facebookexternalhit|twitterbot|slackbot|linkedinbot|discordbot|telegrambot|whatsapp|line-poker|Googlebot|bot|crawl|spider|preview/i

export default async function middleware(request: Request) {
  const url = new URL(request.url)
  const ua = request.headers.get('user-agent') || ''

  // Only intercept /news/:id for bots
  const match = url.pathname.match(/^\/news\/([a-f0-9-]+)$/)
  if (!match || !BOT_PATTERNS.test(ua)) {
    return undefined // pass through to SPA
  }

  const id = match[1]

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?id=eq.${id}&select=title,description,image_url`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    )

    const data = await response.json()
    const article = data?.[0]
    if (!article) return undefined

    const title = escapeHtml(article.title || 'Sun Chook')
    const description = escapeHtml(article.description || '해외축구 뉴스와 댓글 커뮤니티')
    const image = escapeHtml(article.image_url || `${url.origin}/og-image.png`)
    const canonical = `${url.origin}/news/${id}`

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<title>${title} - Sun Chook</title>
<meta property="og:type" content="article"/>
<meta property="og:title" content="${title}"/>
<meta property="og:description" content="${description}"/>
<meta property="og:image" content="${image}"/>
<meta property="og:url" content="${canonical}"/>
<meta property="og:site_name" content="Sun Chook"/>
<meta property="og:locale" content="ko_KR"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${title}"/>
<meta name="twitter:description" content="${description}"/>
<meta name="twitter:image" content="${image}"/>
</head>
<body></body>
</html>`

    return new Response(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return undefined
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&quot;/g, '"').replace(/&#0*39;/g, "'").replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_m: string, c: string) => String.fromCharCode(Number(c)))
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

export const config = {
  matcher: '/news/:id*',
}
