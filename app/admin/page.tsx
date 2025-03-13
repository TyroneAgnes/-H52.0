"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ADMIN_TOKEN_NAME } from "@/lib/constants"

export default function AdminRedirect() {
  const router = useRouter()

  useEffect(() => {
    // 检查管理员登录状态
    const hasAdminToken = document.cookie.includes(`${ADMIN_TOKEN_NAME}=`)
    
    if (hasAdminToken) {
      // 已登录，跳转到管理后台首页
      router.push('/admin/recharge')
    } else {
      // 未登录，跳转到管理员登录页
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">正在加载管理后台...</p>
    </div>
  )
} 