export default function About() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">关于我</h1>
      <div className="prose lg:prose-xl">
        <p>
          你好！我是一名热爱技术和写作的开发者。这个博客是我用来分享技术见解、
          学习心得和生活感悟的地方。
        </p>
        <h2>技术栈</h2>
        <ul>
          <li>前端：React, Next.js, TypeScript</li>
          <li>后端：Node.js, Python</li>
          <li>其他：Docker, Git</li>
        </ul>
      </div>
    </div>
  )
} 