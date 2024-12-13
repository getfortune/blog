import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'

export default function Home() {
  const posts = getAllPosts()
  console.log('Posts on homepage:', posts)
  
  return (
    <div className="space-y-8">
      <section className="text-center py-20 bg-gray-50">
        <h1 className="text-4xl font-bold mb-4">欢迎来到我的博客</h1>
        <p className="text-xl text-gray-600">分享技术、生活和思考</p>
      </section>
      
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">最新文章</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {posts && posts.length > 0 ? (
            posts.map(post => (
              <article key={post.id} className="border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2">
                  <Link href={`/posts/${post.id}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                <div className="text-sm text-gray-500">
                  发布于 {post.date}
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-2 text-center py-8">
              <p className="text-gray-600">暂无文章</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

// 替换原有的服务端数据获取逻辑
export async function generateStaticParams() {
  // 返回所有可能的路径参数
  return [
    { id: '1' },
    { id: '2' },
    // ...更多路径
  ]
}

// 页面组件保持不变 