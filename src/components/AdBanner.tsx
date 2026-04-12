import { useEffect, useRef, useState } from 'react'

interface AdBannerProps {
  slot: string
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle'
  className?: string
}

export function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      const adsbygoogle = (window as any).adsbygoogle
      if (!adsbygoogle) return
      adsbygoogle.push({})
      pushed.current = true
    } catch {
      return
    }

    // Poll to check if ad actually rendered with height
    let checks = 0
    const interval = setInterval(() => {
      checks++
      const container = adRef.current
      if (container && container.offsetHeight > 0) {
        setVisible(true)
        clearInterval(interval)
      }
      if (checks >= 10) clearInterval(interval)
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`ad-container overflow-hidden ${className}`}
      ref={adRef}
      style={{ display: visible ? 'block' : 'none' }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1953089301592534"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
