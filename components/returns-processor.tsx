"use client"

import { useEffect } from "react"
import { useStore } from "@/lib/store"

export default function ReturnsProcessor() {
  const { processReturns } = useStore()

  // 每分钟检查一次是否需要返还收益
  useEffect(() => {
    // 确保只在客户端运行
    if (typeof window === 'undefined') return

    console.log('ReturnsProcessor 已启用')
    
    const interval = setInterval(() => {
      try {
        processReturns()
      } catch (error) {
        console.error('处理收益返还时出错:', error)
      }
    }, 60000) // 60秒

    return () => clearInterval(interval)
  }, [processReturns])

  return null
} 