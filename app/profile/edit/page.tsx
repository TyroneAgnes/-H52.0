"use client"

import { useState } from "react"
import { ArrowLeft, Camera } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Header from "@/components/header"

export default function ProfileEditPage() {
  const [nickname, setNickname] = useState("张三")
  const [avatarUrl, setAvatarUrl] = useState(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&h=100&q=80",
  )

  // 模拟上传头像
  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // 在实际应用中，这里会上传文件到服务器
      // 这里仅做本地预览
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarUrl(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 模拟保存个人信息
  const handleSave = () => {
    // 在实际应用中，这里会发送请求到服务器保存信息
    alert("个人信息已保存")
    window.location.href = "/profile"
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 使用Header组件 */}
      <Header
        title="编辑个人信息"
        centerTitle={true}
        showBell={false}
        showLogo={false}
        leftComponent={
          <Link href="/profile" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
      />

      {/* 内容区域 */}
      <div className="px-4 py-6 space-y-6">
        {/* 头像上传 */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col items-center">
              <div className="text-base font-semibold mb-4">头像</div>

              <div className="relative mb-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <img src={avatarUrl || "/placeholder.svg"} alt="用户头像" className="w-full h-full object-cover" />
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                  <Camera className="h-4 w-4" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                </label>
              </div>

              <div className="text-sm text-gray-500">点击图标上传新头像</div>
            </div>
          </CardContent>
        </Card>

        {/* 基本信息 */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="请输入昵称"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户ID</label>
                <div className="flex items-center h-10 px-3 rounded-md border border-gray-300 bg-gray-100 text-gray-500">
                  123456789 <span className="text-xs ml-2">(不可修改)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 保存按钮 */}
        <div className="pt-4">
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6" onClick={handleSave}>
            保存
          </Button>
        </div>
      </div>
    </div>
  )
}

