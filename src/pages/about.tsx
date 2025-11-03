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
              <p>一个普普通通的小码农</p>
              <p>github：<a href="https://github.com/getfortune">https://github.com/getfortune</a> </p>
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