import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '@/components/Header';
import { getPostById, getAllPosts } from '@/lib/api';
// @ts-ignore
import { Post } from '@/lib/types';
import ReactMarkdown from 'react-markdown';

export default function Post({ post, allPosts }: { post: Post; allPosts: Post[] }) {
  const router = useRouter();

  // 如果页面还在加载中（例如在服务端渲染时）
  if (router.isFallback) {
    return <div>加载中...</div>;
  }

  // 如果没有找到文章
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header posts={allPosts} />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
            <p className="text-gray-600 mb-6">抱歉，您要查找的文章不存在。</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              返回首页
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="description" content={post.title} />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Header posts={allPosts} />
        <main className="container mx-auto px-4 py-8">
          <article className="bg-white rounded-lg shadow p-6">
            <button 
              onClick={() => router.back()} 
              className="mb-4 text-blue-500 hover:text-blue-700 flex items-center"
            >
              ← 返回
            </button>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <div className="text-gray-600 mb-6">{post.date}</div>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="prose max-w-none">
              <ReactMarkdown>{post.content || ''}</ReactMarkdown>
            </div>
          </article>
        </main>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }));

  // 在静态导出模式下，必须使用 fallback: false
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);
  const allPosts = await getAllPosts();

  return {
    props: {
      post: post || null,
      allPosts: allPosts || [],
    },
  };
}