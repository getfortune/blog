import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchModal from './SearchModal';
import { Post } from '@/lib/types';

export default function Header({ posts }: { posts: Post[] }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // 添加快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 检查是否按下了 Ctrl+Shift+K
      if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      // ESC 键关闭搜索框
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/" className="text-2xl font-bold text-gray-800">
              我的博客
            </Link>
          </div>
          
          {/* 桌面端导航 */}
          <nav className="hidden md:block">
            <ul className="flex space-x-6">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900">
                  关于
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  联系
                </Link>
              </li>
              {/* 搜索按钮放在联系的右边 */}
              <li>
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="text-gray-600 hover:text-gray-900 flex items-center"
                >
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  搜索
                </button>
              </li>
            </ul>
          </nav>
          
          {/* 移动端菜单按钮 */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="text-gray-600 hover:text-gray-900 mr-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* 移动端导航菜单 */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <ul className="space-y-2">
              <li>
                <Link href="/" className="block text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                  首页
                </Link>
              </li>
              <li>
                <Link href="/about" className="block text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                  关于
                </Link>
              </li>
              <li>
                <Link href="/contact" className="block text-gray-600 hover:text-gray-900 py-2" onClick={() => setIsMenuOpen(false)}>
                  联系
                </Link>
              </li>
            </ul>
          </nav>
        )}
        
        {/* 搜索弹窗 */}
        {isSearchOpen && <SearchModal posts={posts || []} onClose={() => setIsSearchOpen(false)} />}
      </div>
    </header>
  );
}