import { getPostData, getAllPosts } from '@/lib/posts'
import Comments from '../../components/Comments'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    id: post.id,
  }))
}

export default async function Post({ 
  params 
}: { 
  params: Promise<{ id: string }> | { id: string }
}) {
  const resolvedParams = await params
  const post = await getPostData(resolvedParams.id)
  
  if (!post) {
    return <div>文章不存在</div>
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{post.title}</h1>
        <div className="flex items-center text-gray-500 space-x-4">
          <time>{post.date}</time>
          <div className="flex items-center space-x-2">
            {post.tags.map(tag => (
              <span key={tag} className="bg-gray-100 px-2 py-1 rounded text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </header>
      
      <div 
        className="prose prose-lg prose-slate mx-auto"
        dangerouslySetInnerHTML={{ __html: post.content || '' }} 
      />
      <Comments />
    </article>
  )
} 