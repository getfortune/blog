import './globals.css'
import Layout from './components/Layout'

export const metadata = {
  title: 'My Blog',
  description: '我的个人博客',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
} 