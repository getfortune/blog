'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Search() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索文章..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2"
      >
        🔍
      </button>
    </form>
  )
} 