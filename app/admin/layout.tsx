"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  Star, 
  Settings, 
  LogOut,
  Menu,
  X,
  FileText,
  Bot,
  UserCog,
  MessageSquare,
  HeadphonesIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active: boolean
}

function SidebarItem({ icon, label, href, active }: SidebarItemProps) {
  return (
    <Link 
      href={href} 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
        active 
          ? "bg-blue-50 text-blue-600" 
          : "text-gray-600 hover:bg-gray-100"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  )
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sidebarItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "仪表盘",
      href: "/admin/dashboard",
    },
    {
      icon: <Users size={20} />,
      label: "用户管理",
      href: "/admin/users",
    },
    {
      icon: <CreditCard size={20} />,
      label: "充值提现",
      href: "/admin/recharge",
    },
    {
      icon: <Star size={20} />,
      label: "导师管理",
      href: "/admin/mentors",
    },
    {
      icon: <FileText size={20} />,
      label: "平台规则",
      href: "/admin/rules",
    },
    {
      icon: <Bot size={20} />,
      label: "爬虫管理",
      href: "/admin/crawler",
    },
    {
      icon: <UserCog size={20} />,
      label: "员工管理",
      href: "/admin/staff",
    },
    {
      icon: <MessageSquare size={20} />,
      label: "消息中心",
      href: "/admin/messages",
    },
    {
      icon: <HeadphonesIcon size={20} />,
      label: "客服中心",
      href: "/admin/support",
    },
    {
      icon: <Settings size={20} />,
      label: "系统设置",
      href: "/admin/settings",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 移动端侧边栏切换按钮 */}
      <button
        className="fixed z-50 p-2 bg-white rounded-full shadow-md md:hidden top-4 left-4"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* 侧边栏 */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transition-transform duration-300 md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* 侧边栏标题 */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-blue-600">星辰管理系统</h1>
          </div>

          {/* 侧边栏菜单 */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname === item.href}
              />
            ))}
          </nav>

          {/* 退出按钮 */}
          <div className="p-4 border-t border-gray-200">
            <Link 
              href="/login" 
              className="flex items-center gap-3 px-4 py-3 text-red-600 rounded-lg transition-colors hover:bg-red-50"
            >
              <LogOut size={20} />
              <span className="font-medium">退出登录</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className={cn(
        "flex-1 transition-all duration-300 md:ml-64",
        sidebarOpen ? "ml-64" : "ml-0"
      )}>
        {/* 顶部栏 */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <h2 className="text-lg font-semibold">后台管理系统</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">管理员</span>
          </div>
        </header>

        {/* 页面内容 */}
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
} 