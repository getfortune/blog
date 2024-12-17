import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Tags() {
  const posts = getAllPosts()
  const tags = Array.from(new Set(posts.flatMap(post => post.tags)))

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">标签</h1>
      <div className="flex flex-wrap gap-4">
        {tags.map(tag => {
          const tagPosts = posts.filter(post => post.tags.includes(tag))
          return (
            <Link
              key={tag}
              href={`/tags/${encodeURIComponent(tag)}`}
              className="bg-gray-100 px-4 py-2 rounded-full hover:bg-gray-200"
            >
              {tag} ({tagPosts.length})
            </Link>
          )
        })}
      </div>
    </div>
  )
} 