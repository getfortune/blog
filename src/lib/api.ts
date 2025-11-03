import type { Post } from '@/lib/types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');

// 获取所有文章
export async function getAllPosts(): Promise<Post[]> {
  // 获取 posts 目录下所有文件
  const fileNames = fs.readdirSync(postsDirectory);
  
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md')) // 只处理 .md 文件
    .map(fileName => {
      // 读取 markdown 文件作为字符串
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      
      // 使用 gray-matter 解析 metadata
      const matterResult = matter(fileContents);
      
      // 结合数据成 Post 对象，确保 id 是字符串类型
      return {
        id: String(matterResult.data.id || fileName.replace(/\.md$/, '')),
        title: matterResult.data.title,
        date: matterResult.data.date,
        excerpt: matterResult.data.excerpt,
        tags: matterResult.data.tags || matterResult.data.labels || [],
        content: matterResult.content
      } as Post;
    });
  
  // 按日期排序，最新的在前面
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// 根据ID获取单篇文章
export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find(post => post.id === id);
}