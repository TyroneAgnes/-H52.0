import type React from "react"

interface PageBackgroundProps {
  children: React.ReactNode
}

export const PageBackground: React.FC<PageBackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* 背景图片和蓝色透明层 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundPosition: "bottom center",
          }}
        />
        <div className="absolute inset-0 bg-blue-100/15" />
      </div>

      {/* 页面内容 */}
      <div className="relative z-10 flex-1 flex flex-col">{children}</div>
    </div>
  )
}

export default PageBackground

