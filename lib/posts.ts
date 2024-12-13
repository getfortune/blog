import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export type Post = {
  id: string
  title: string
  date: string
  content?: string
  excerpt: string
  tags: string[]
  category: string
}

export function getAllPosts(): Post[] {
  try {
    // 添加调试日志
    console.log('Posts directory:', postsDirectory)
    
    if (!fs.existsSync(postsDirectory)) {
      console.warn('Posts directory does not exist:', postsDirectory)
      fs.mkdirSync(postsDirectory, { recursive: true })
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    console.log('Found files:', fileNames)  // 添加调试日志

    const allPosts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
        const id = fileName.replace(/\.md$/, '')
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const { data } = matter(fileContents)

        return {
          id,
          title: data.title || 'Untitled',
          date: data.date || new Date().toISOString(),
          excerpt: data.excerpt || '',
          tags: data.tags || [],
          category: data.category || 'Uncategorized'
        } as Post
      })

    return allPosts.sort((a, b) => (a.date < b.date ? 1 : -1))
  } catch (error) {
    console.error('Error reading posts:', error)
    return []
  }
}

export async function getPostData(id: string): Promise<Post | null> {
  try {
    const fullPath = path.join(postsDirectory, `${id}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    // 将 Markdown 转换为 HTML
    const processedContent = await remark()
      .use(html)
      .process(content)
    const contentHtml = processedContent.toString()

    return {
      id,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      content: contentHtml,
      excerpt: data.excerpt || content.slice(0, 200) + '...',
      tags: data.tags || [],
      category: data.category || 'Uncategorized'
    }
  } catch (error) {
    console.error('Error reading post:', error)
    return null
  }
} 