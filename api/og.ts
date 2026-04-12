import type { VercelRequest, VercelResponse } from '@vercel/node'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || ''

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.redirect('/')
  }

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

    if (!article) return res.redirect('/')

    const title = decode(article.title || 'Sun Chook')
    const description = decode(article.description || '해외축구 뉴스와 댓글 커뮤니티')
    const image = article.image_url || 'https://sunsoccer.vercel.app/og-image.png'
    const url = `https://sunsoccer.vercel.app/news/${id}`

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<title>${esc(title)} - Sun Chook</title>
<meta property="og:type" content="article"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${esc(description)}"/>
<meta property="og:image" content="${esc(image)}"/>
<meta property="og:url" content="${url}"/>
<meta property="og:site_name" content="Sun Chook"/>
<meta property="og:locale" content="ko_KR"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(description)}"/>
<meta name="twitter:image" content="${esc(image)}"/>
</head>
<body></body>
</html>`

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    return res.status(200).send(html)
  } catch {
    return res.redirect('/')
  }
}

function decode(str: string) {
  return str
    .replace(/&quot;/g, '"').replace(/&#0*39;/g, "'").replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&rarr;/g, '→')
    .replace(/&#(\d+);/g, (_: string, c: string) => String.fromCharCode(Number(c)))
}

function esc(str: string) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
