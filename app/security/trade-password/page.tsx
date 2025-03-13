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

export default function TradePasswordPage() {
  const router = useRouter()

  // 状态管理
  const [loginPassword, setLoginPassword] = useState("")
  const [tradePassword, setTradePassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showTradePassword, setShowTradePassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 表单提交
  const handleSubmit = (e) => {
    e.preventDefault()

    // 这里应该有验证逻辑
    if (tradePassword !== confirmPassword) {
      alert("交易密码与确认密码不一致")
      return
    }

    if (tradePassword.length !== 6) {
      alert("交易密码必须为6位数字")
      return
    }

    // 提交到服务器的逻辑
    // ...

    // 成功后跳转
    alert("交易密码设置成功")
    router.push("/profile")
  }

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header
          title="设置交易密码"
          leftComponent={
            <Link href="/security">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
          }
        />

        <div className="flex-1 p-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 登录密码 */}
            <div className="space-y-2">
              <Label htmlFor="loginPassword">登录密码</Label>
              <div className="relative">
                <Input
                  id="loginPassword"
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="请输入登录密码"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* 交易密码 */}
            <div className="space-y-2">
              <Label htmlFor="tradePassword">交易密码</Label>
              <div className="relative">
                <Input
                  id="tradePassword"
                  type={showTradePassword ? "text" : "password"}
                  value={tradePassword}
                  onChange={(e) => setTradePassword(e.target.value)}
                  placeholder="请输入6位数字交易密码"
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowTradePassword(!showTradePassword)}
                >
                  {showTradePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500">交易密码用于资金操作，请设置6位数字</p>
            </div>

            {/* 确认交易密码 */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">确认交易密码</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="请再次输入交易密码"
                  maxLength={6}
                  pattern="[0-9]*"
                  inputMode="numeric"
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

            <Button type="submit" className="w-full">
              确认
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              忘记登录密码？
              <Link href="/security/reset-password" className="text-blue-600">
                点击找回
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

