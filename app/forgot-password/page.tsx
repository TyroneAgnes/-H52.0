"use client"

import { useState } from "react"
import { Eye, EyeOff, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import PageBackground from "@/components/page-background"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      alert("两次输入的密码不一致")
      return
    }

    setIsLoading(true)

    // 模拟重置密码请求
    try {
      // 实际应用中这里会调用API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // 重置成功后跳转到登录页
      alert("密码重置成功，请使用新密码登录")
      router.push("/login")
    } catch (error) {
      console.error("密码重置失败", error)
      alert("密码重置失败，请稍后再试")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header
          title="找回密码"
          leftComponent={
            <Link href="/login">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
          }
        />

        <div className="flex-1 p-6">
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
              <Label htmlFor="newPassword">新密码</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="请设置新密码"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">密码长度为8-20个字符，必须包含字母和数字</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认新密码</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入新密码"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "重置中..." : "重置密码"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              记起密码了?{" "}
              <Link href="/login" className="text-blue-600">
                返回登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

