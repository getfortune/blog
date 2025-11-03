import { useState } from 'react';
import { Post } from '@/lib/types';
import Link from 'next/link';

interface SearchModalProps {
  posts: Post[];
  onClose: () => void;
}

export default function SearchModal({ posts, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 处理搜索
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // 处理键盘事件
  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // 确保 posts 是数组
  const safePosts = Array.isArray(posts) ? posts : [];
  
  // 计算搜索结果
  const searchResults = searchTerm.trim() !== '' 
    ? safePosts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
        <div className="border-b px-6 py-4 flex justify-between items-center">
          <h3 className="text-lg font-medium">搜索文章</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          <input
            type="text"
            placeholder="输入关键词搜索... (Ctrl+Shift+K)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            autoFocus
          />
        </div>
        
        <div className="px-6 pb-6 max-h-96 overflow-y-auto">
          {searchTerm && (
            <div>
              <h4 className="font-medium mb-2">
                搜索结果: {searchResults.length} 篇文章
              </h4>
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((post) => (
                    <Link 
                      key={post.id} 
                      href={`/posts/${post.id}`}
                      onClick={onClose}
                      className="border-b border-gray-200 pb-4 cursor-pointer hover:bg-gray-50 p-2 rounded block"
                    >
                      <h5 className="font-semibold mb-1">{post.title}</h5>
                      <div className="text-gray-600 text-sm mb-2">
                        {post.excerpt}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">{post.date}</span>
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
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">没有找到匹配的文章。</p>
              )}
            </div>
          )}
          
          {!searchTerm && (
            <div>
              <p className="text-gray-600 text-center py-4">输入关键词开始搜索</p>
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>快捷键: Ctrl+Shift+K 打开搜索</p>
                <p className="mt-1">ESC 关闭搜索</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}