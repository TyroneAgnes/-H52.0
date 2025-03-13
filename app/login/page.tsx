"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import PageBackground from "@/components/page-background"
import { useStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    // 获取当前小时
    const hour = new Date().getHours()
    
    // 根据时间设置问候语
    if (hour >= 5 && hour < 12) {
      setGreeting("早上好")
    } else if (hour >= 12 && hour < 14) {
      setGreeting("中午好")
    } else if (hour >= 14 && hour < 18) {
      setGreeting("下午好")
    } else {
      setGreeting("晚上好")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await login(username, password)
      
      if (success) {
        toast({
          title: "登录成功",
          description: "欢迎回来",
        })
        router.push("/")
      } else {
        toast({
          title: "登录失败",
          description: "用户名或密码错误",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("登录失败", error)
      toast({
        title: "登录失败",
        description: "请稍后重试",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header title="登录" />

        <div className="flex-1 flex flex-col justify-center p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">星辰资本</h1>
            <p className="text-sm text-gray-500 mt-2">{greeting}，欢迎使用星投</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">账号</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入账号"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "登录中..." : "登录"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              还没有账号?{" "}
              <Link href="/register" className="text-blue-600">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

