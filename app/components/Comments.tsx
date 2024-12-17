'use client'
import { useEffect, useRef } from 'react'

export default function Comments() {
  const commentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'getfortune/blog')
    script.setAttribute('data-repo-id', '902749649')
    script.setAttribute('data-category', 'General ')
    script.setAttribute('data-category-id', '7697956')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute('data-theme', 'light')
    script.setAttribute('data-lang', 'zh-CN')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    commentsRef.current?.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])

  return (
    <div className="mt-8">
      <div ref={commentsRef} />
    </div>
  )
} 