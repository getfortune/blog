import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import type { Post } from '@/lib/posts'

export async function generateStaticParams() {
  const posts = getAllPosts()
  const categories = Array.from(new Set(posts.map(post => post.category)))
  return categories.map((category) => ({
    category: encodeURIComponent(category),
  }))
}

interface PageProps {
    params: { category: string }
}

export default async function CategoryPage({ params }: PageProps) {
  const posts = getAllPosts()
  const category = decodeURIComponent(params.category); // 解码分类名称
  const categoryPosts = posts.filter(post => post.category === category)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">分类: {category}</h1>
      <div className="space-y-8">
        {categoryPosts.map((post: Post) => (
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