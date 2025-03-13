"use client"

import Link from "next/link"
import { Home, LineChart, Star, PenTool, User } from "lucide-react"
import { usePathname } from "next/navigation"

export default function BottomNav() {
  const pathname = usePathname()

  // 检查当前路径是否匹配导航项
  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 flex bg-white shadow-md z-50 h-14">
      <Link
        href="/"
        className={`flex-1 flex flex-col items-center justify-center ${isActive("/") ? "text-primary" : "text-gray-500"}`}
      >
        <Home className="h-5 w-5 mb-0.5" />
        <span className="text-xs">首页</span>
      </Link>
      <Link
        href="/market"
        className={`flex-1 flex flex-col items-center justify-center ${isActive("/market") ? "text-primary" : "text-gray-500"}`}
      >
        <LineChart className="h-5 w-5 mb-0.5" />
        <span className="text-xs">行情</span>
      </Link>
      <Link
        href="/star-invest"
        className={`flex-1 flex flex-col items-center justify-center ${isActive("/star-invest") ? "text-primary" : "text-gray-500"}`}
      >
        <Star className="h-5 w-5 mb-0.5" />
        <span className="text-xs">星投</span>
      </Link>
      <Link
        href="/trade"
        className={`flex-1 flex flex-col items-center justify-center ${isActive("/trade") ? "text-primary" : "text-gray-500"}`}
      >
        <PenTool className="h-5 w-5 mb-0.5" />
        <span className="text-xs">交易</span>
      </Link>
      <Link
        href="/profile"
        className={`flex-1 flex flex-col items-center justify-center ${isActive("/profile") ? "text-primary" : "text-gray-500"}`}
      >
        <User className="h-5 w-5 mb-0.5" />
        <span className="text-xs">我的</span>
      </Link>
    </div>
  )
}

