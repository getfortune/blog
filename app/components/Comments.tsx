'use client'
import { useEffect, useRef } from 'react'

export default function Comments() {
  const commentsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    // 从 giscus.app 复制实际的配置值到这里
    script.setAttribute('data-repo', '实际的仓库名')
    script.setAttribute('data-repo-id', '实际的仓库ID')
    script.setAttribute('data-category', 'Announcements')
    script.setAttribute('data-category-id', '实际的分类ID')
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