import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Categories() {
  const posts = getAllPosts()
  const categories = Array.from(new Set(posts.map(post => post.category)))

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">分类</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {categories.map(category => {
          const categoryPosts = posts.filter(post => post.category === category)
          return (
            <div key={category} className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">
                <Link href={`/categories/${category}`}>
                  {category}
                </Link>
              </h2>
              <p className="text-gray-600 mb-2">
                {categoryPosts.length} 篇文章
              </p>
              <ul className="space-y-2">
                {categoryPosts.slice(0, 3).map(post => (
                  <li key={post.id}>
                    <Link href={`/posts/${post.id}`} className="hover:text-gray-600">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
} 