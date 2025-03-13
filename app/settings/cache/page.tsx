"use client"

import { useState } from "react"
import { ArrowLeft, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import { toast } from "@/hooks/use-toast"

export default function ClearCachePage() {
  const [isClearing, setIsClearing] = useState(false)
  const [cacheSize, setCacheSize] = useState("156.8 MB")

  // 模拟清除缓存
  const handleClearCache = () => {
    setIsClearing(true)

    // 模拟清除过程
    setTimeout(() => {
      setIsClearing(false)
      setCacheSize("0 MB")

      toast({
        title: "缓存已清除",
        description: "应用缓存已成功清除",
      })
    }, 2000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="清除缓存"
        centerTitle={true}
        showBell={false}
        showLogo={false}
        leftComponent={
          <Link href="/settings" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
      />

      <div className="px-4 py-4 flex-1">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Trash2 className="h-10 w-10 text-blue-600" />
              </div>

              <h2 className="text-xl font-semibold mb-2">清除应用缓存</h2>
              <p className="text-gray-500 text-center mb-6">当前缓存大小: {cacheSize}</p>
              <p className="text-sm text-gray-600 text-center mb-8 max-w-xs">
                清除缓存将删除应用临时文件，可能会导致应用短暂加载变慢，但不会删除您的个人数据和设置。
              </p>

              <Button className="w-full" onClick={handleClearCache} disabled={isClearing || cacheSize === "0 MB"}>
                {isClearing ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    正在清除...
                  </>
                ) : cacheSize === "0 MB" ? (
                  "缓存已清空"
                ) : (
                  "清除缓存"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

