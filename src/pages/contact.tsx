import Head from 'next/head';
import Link from 'next/link';

export default function Contact() {
  return (
    <>
      <Head>
        <title>联系我</title>
        <meta name="description" content="联系方式" />
      </Head>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-3xl font-bold mb-6">联系我</h1>
            <div className="prose max-w-none">
              <p>你可以在下面找到我的联系方式：</p>
              <ul>
                <li>Email: example@example.com</li>
                <li>GitHub: github.com/yourusername</li>
                <li>Twitter: @yourusername</li>
              </ul>
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