import Link from 'next/link'
import {getAllPosts} from '@/lib/posts'
import type {Post} from '@/lib/posts'

export async function generateStaticParams() {
    const posts = getAllPosts()
    const tags = Array.from(new Set(posts.flatMap(post => post.tags)))
    return tags.map((tag) => ({
        tag: encodeURIComponent(tag),
    }))
}

interface PageProps {
    params: Promise<{ tag: string }>
}

export default async function TagPage({params}: PageProps) {
    const posts = await getAllPosts()
    const params1 = await params;
    const tag = decodeURIComponent(params1.tag);
    const tagPosts = posts.filter(post => post.tags.includes(tag))

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">标签: {tag}</h1>
            <div className="space-y-8">
                {tagPosts.map((post: Post) => (
                    <article key={post.id} className="border-b pb-8">
                        <h2 className="text-2xl font-semibold mb-2">
                            <Link href={`/posts/${post.id}`}>
                                {post.title}
                            </Link>
                        </h2>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <div className="flex items-center text-sm text-gray-500">
                            <time>{post.date}</time>
                            <span className="mx-2">•</span>
                            <span>{post.category}</span>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
} 