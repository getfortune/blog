import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>关于我</title>
        <meta name="description" content="关于我" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-6">关于我</h1>
            <div className="prose max-w-none">
              <p>这是一个关于我的页面。</p>
              <p>在这里你可以写一些关于你自己的信息。</p>
            </div>
            <div className="mt-6">
              <Link href="/" className="text-blue-500 hover:text-blue-700">
                ← 返回首页
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}