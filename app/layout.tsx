import type { Metadata } from 'next'
import { Toaster } from "@/components/ui/toaster"
import ReturnsProcessor from '@/components/returns-processor'
import './globals.css'

export const metadata: Metadata = {
  title: '星辰 H52.0',
  description: '星辰 H52.0 投资平台',
  generator: 'Next.js',
}

// 添加错误边界组件
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <div suppressHydrationWarning>
      {children}
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          <ReturnsProcessor />
          {children}
          <Toaster />
        </ErrorBoundary>
      </body>
    </html>
  )
}
