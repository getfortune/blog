import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Posts() {
  const posts = getAllPosts()

  if (posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">所有文章</h1>
        <p className="text-gray-600">暂无文章</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">所有文章</h1>
      <div className="space-y-8">
        {posts.map(post => (
          <article key={post.id} className="border-b pb-8">
            <h2 className="text-2xl font-semibold mb-2">
              <Link href={`/posts/${post.id}`}>
                {post.title}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <time>{post.date}</time>
              <span>•</span>
              <span>{post.category}</span>
              {post.tags.map(tag => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
} 