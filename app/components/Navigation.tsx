import Link from 'next/link'
import Search from './Search'

export default function Navigation() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold">
            My Blog
          </Link>
          <div className="space-x-4">
            <Link href="/posts" className="hover:text-gray-600">
              博客
            </Link>
            <Link href="/categories" className="hover:text-gray-600">
              分类
            </Link>
            <Link href="/tags" className="hover:text-gray-600">
              标签
            </Link>
            <Link href="/about" className="hover:text-gray-600">
              关于
            </Link>
            <Search />
          </div>
        </div>
      </div>
    </nav>
  )
} 