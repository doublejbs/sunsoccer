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
      `${SUPABASE_URL}/rest/v1/articles?id=eq.${id}&select=title,description,image_url,source`,
      {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
        },
      }
    )

    const data = await response.json()
    const article = data?.[0]

    if (!article) {
      return res.redirect(`/news/${id}`)
    }

    const title = article.title || 'Sun Chook'
    const description = article.description || '해외축구 뉴스와 댓글 커뮤니티'
    const image = article.image_url || 'https://sunsoccer.vercel.app/og-image.png'
    const url = `https://sunsoccer.vercel.app/news/${id}`

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)} - Sun Chook</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:site_name" content="Sun Chook" />
  <meta property="og:locale" content="ko_KR" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
  <meta http-equiv="refresh" content="0;url=/news/${id}" />
</head>
<body>
  <p>Redirecting...</p>
</body>
</html>`

    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, max-age=3600')
    return res.status(200).send(html)
  } catch {
    return res.redirect(`/news/${id}`)
  }
}

function escapeHtml(str: string) {
  // First decode any existing HTML entities, then re-escape for HTML attributes
  const decoded = str
    .replace(/&quot;/g, '"')
    .replace(/&#0*39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#(\d+);/g, (_m, c) => String.fromCharCode(Number(c)))
  return decoded
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}
