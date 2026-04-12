import { useEffect, useRef, useState } from 'react'

interface AdBannerProps {
  slot: string
  format?: 'auto' | 'horizontal' | 'vertical' | 'rectangle'
  className?: string
}

export function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null)
  const pushed = useRef(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    if (pushed.current) return
    try {
      const adsbygoogle = (window as any).adsbygoogle
      if (!adsbygoogle) {
        setHidden(true)
        return
      }
      adsbygoogle.push({})
      pushed.current = true
    } catch {
      setHidden(true)
    }

    // Check if ad loaded after a delay
    const timer = setTimeout(() => {
      const ins = adRef.current?.querySelector('ins')
      if (ins && ins.getAttribute('data-ad-status') === 'unfilled') {
        setHidden(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (hidden) return null

  return (
    <div className={`ad-container overflow-hidden ${className}`} ref={adRef}>
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
