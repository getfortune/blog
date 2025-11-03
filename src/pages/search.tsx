import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Header from '@/components/Header';
import { getAllPosts } from '@/lib/api';
import { Post } from '@/lib/types';

interface SearchPageProps {
  allPosts: Post[];
}

export default function SearchPage({ allPosts }: SearchPageProps) {
  const router = useRouter();
  const { q } = router.query;
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (q) {
      setSearchTerm(q as string);
    }
  }, [q]);

  // 根据搜索词过滤文章
  const filteredPosts = searchTerm 
    ? allPosts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <>
      <Head>
        <title>搜索结果</title>
        <meta name="description" content="搜索博客文章" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <Header posts={allPosts} />
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-6">
              {searchTerm ? `搜索结果: "${searchTerm}"` : '搜索文章'}
            </h1>
            
            <div className="mb-6">
              <input
                type="text"
                placeholder="输入关键词搜索..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // 更新URL查询参数
                  const newQuery = e.target.value ? { q: e.target.value } : {};
                  router.push({
                    pathname: '/search',
                    query: newQuery,
                  }, undefined, { shallow: true });
                }}
              />
            </div>
            
            {searchTerm && (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  找到 {filteredPosts.length} 篇文章
                </h2>
                {filteredPosts.length > 0 ? (
                  <div className="space-y-4">
                    {filteredPosts.map((post) => (
                      <div key={post.id} className="border-b border-gray-200 pb-4">
                        <h3 className="text-lg font-semibold mb-2">
                          <Link href={`/posts/${post.id}`} className="text-blue-600 hover:text-blue-800">
                            {post.title}
                          </Link>
                        </h3>
                        <div className="prose max-w-none text-gray-600 mb-2">
                          {post.excerpt}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">{post.date}</span>
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {post.tags.map((tag, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">没有找到匹配的文章。</p>
                )}
              </div>
            )}
            
            {!searchTerm && (
              <div>
                <p className="text-gray-600 text-center py-8">请输入关键词开始搜索</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const allPosts = await getAllPosts();

  return {
    props: {
      allPosts: allPosts || [],
    },
  };
}