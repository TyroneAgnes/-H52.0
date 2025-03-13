"use client"

import { useState } from "react"
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

export default function ChangePasswordPage() {
  const router = useRouter()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 密码强度检查
  const checkPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "请输入密码", color: "bg-gray-300" }

    let strength = 0

    // 长度检查
    if (password.length >= 8) strength += 1

    // 包含数字
    if (/\d/.test(password)) strength += 1

    // 包含小写字母
    if (/[a-z]/.test(password)) strength += 1

    // 包含大写字母
    if (/[A-Z]/.test(password)) strength += 1

    // 包含特殊字符
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    // 返回强度评级
    if (strength <= 2) return { strength: 20 * strength, text: "弱", color: "bg-red-500" }
    if (strength <= 3) return { strength: 20 * strength, text: "中", color: "bg-yellow-500" }
    return { strength: 20 * strength, text: "强", color: "bg-green-500" }
  }

  const passwordStrength = checkPasswordStrength(newPassword)

  // 提交表单
  const handleSubmit = (e) => {
    e.preventDefault()

    // 表单验证
    if (!currentPassword) {
      toast({
        title: "请输入当前密码",
        variant: "destructive",
      })
      return
    }

    if (!newPassword) {
      toast({
        title: "请输入新密码",
        variant: "destructive",
      })
      return
    }

    if (newPassword.length < 8) {
      toast({
        title: "密码长度不足",
        description: "新密码长度至少为8位",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "密码不匹配",
        description: "新密码与确认密码不一致",
        variant: "destructive",
      })
      return
    }

    // 模拟API请求
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      toast({
        title: "密码修改成功",
        description: "您的登录密码已成功更新",
      })

      // 重定向回安全中心
      router.push("/security")
    }, 1500)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="修改登录密码"
        centerTitle={true}
        showBell={false}
        showLogo={false}
        leftComponent={
          <Link href="/security" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
      />

      <div className="px-4 py-4 flex-1">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* 当前密码 */}
                <div>
                  <label className="block text-sm font-medium mb-1">当前密码</label>
                  <div className="relative">
                    <Input
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="请输入当前密码"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* 新密码 */}
                <div>
                  <label className="block text-sm font-medium mb-1">新密码</label>
                  <div className="relative">
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      placeholder="请输入新密码"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                  {/* 密码强度指示器 */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">密码强度</span>
                        <span className="text-xs">{passwordStrength.text}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">建议使用字母、数字和特殊字符的组合</div>
                    </div>
                  )}
                </div>

                {/* 确认新密码 */}
                <div>
                  <label className="block text-sm font-medium mb-1">确认新密码</label>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="请再次输入新密码"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                  {newPassword && confirmPassword && newPassword !== confirmPassword && (
                    <div className="mt-1 text-xs text-red-500">两次输入的密码不一致</div>
                  )}
                </div>

                {/* 提交按钮 */}
                <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      提交中...
                    </>
                  ) : (
                    "确认修改"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="mt-4 px-2">
          <div className="flex items-start">
            <Lock className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-xs text-gray-500 leading-relaxed">
              为了保障您的账户安全，请勿将密码设置为与其他网站相同的密码，也不要使用过于简单的密码组合。
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

