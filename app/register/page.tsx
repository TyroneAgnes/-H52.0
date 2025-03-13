"use client"

import { useState } from "react"
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

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [referralCode, setReferralCode] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast({
        title: "注册失败",
        description: "两次输入的密码不一致",
        variant: "destructive"
      })
      return
    }

    if (!referralCode) {
      toast({
        title: "注册失败",
        description: "请输入推荐码",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      // 验证账号格式
      if (username.length < 6 || username.length > 20 || !/^[a-zA-Z0-9_]+$/.test(username)) {
        toast({
          title: "注册失败",
          description: "账号格式错误，请使用6-20个字符，只能包含字母、数字和下划线",
          variant: "destructive"
        })
        setIsLoading(false)
        return
      }

      // 验证密码格式
      if (password.length < 8 || password.length > 20) {
        toast({
          title: "注册失败",
          description: "密码长度必须在8-20个字符之间",
          variant: "destructive"
        })
        setIsLoading(false)
        return
      }

      const success = await register(username, password, referralCode)
      
      if (success) {
        toast({
          title: "注册成功",
          description: "请使用新账号登录",
        })
        router.push("/login")
      } else {
        toast({
          title: "注册失败",
          description: "请检查推荐码是否正确",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error("注册失败", error)
      toast({
        title: "注册失败",
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
        <Header title="注册账号" />

        <div className="flex-1 flex flex-col justify-center p-6">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">创建新账号</h1>
            <p className="text-sm text-gray-500 mt-2">请填写以下信息完成注册</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">账号名称</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="请输入账号名称"
                required
              />
              <p className="text-xs text-gray-500">账号长度为6-20个字符，可包含字母、数字和下划线</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="referralCode">推荐码</Label>
              <Input
                id="referralCode"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="请输入推荐码"
                required
                className="uppercase"
              />
              <p className="text-xs text-gray-500">请输入有效的推荐码，注册后将与推荐人建立永久绑定关系</p>
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
                  minLength={8}
                  maxLength={20}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">密码长度为8-20个字符</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认密码</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入密码"
                  required
                  className="pr-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "注册中..." : "注册"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              已有账号?{" "}
              <Link href="/login" className="text-blue-600">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}


