"use client"

import { ChevronLeft, ChevronRight, Moon, Globe, Bell, Eye, Trash2, LogOut } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import Header from "@/components/header"
import { Switch } from "@/components/ui/switch"
import PageBackground from "@/components/page-background"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [biometricLogin, setBiometricLogin] = useState(false)
  const { logout } = useStore()

  // 处理退出登录
  const handleLogout = () => {
    logout()
    // 退出后跳转到登录页
    window.location.href = "/login"
  }

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header
          title="设置"
          leftComponent={
            <Link href="/profile">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
          }
        />

        <div className="flex-1 p-4">
          <div className="space-y-4">
            {/* 外观设置 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Moon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">深色模式</div>
                    <div className="text-xs text-gray-500 mt-0.5">切换应用外观</div>
                  </div>
                </div>
                <Switch checked={darkMode} onCheckedChange={setDarkMode} />
              </div>

              <div className="border-t border-gray-100"></div>

              <Link href="/settings/language" className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Globe className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">语言</div>
                    <div className="text-xs text-gray-500 mt-0.5">简体中文</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>

            {/* 通知设置 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">推送通知</div>
                    <div className="text-xs text-gray-500 mt-0.5">接收重要通知和提醒</div>
                  </div>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="border-t border-gray-100"></div>

              <Link href="/settings/notification-preferences" className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Bell className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">通知偏好</div>
                    <div className="text-xs text-gray-500 mt-0.5">自定义通知类型</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>

            {/* 安全设置 */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">生物识别登录</div>
                    <div className="text-xs text-gray-500 mt-0.5">使用指纹或面容登录</div>
                  </div>
                </div>
                <Switch checked={biometricLogin} onCheckedChange={setBiometricLogin} />
              </div>

              <div className="border-t border-gray-100"></div>

              <Link href="/settings/clear-cache" className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium">清除缓存</div>
                    <div className="text-xs text-gray-500 mt-0.5">释放设备存储空间</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>

            {/* 关于和法律 */}
            <div className="bg-white rounded-lg shadow-sm">
              <Link href="/about" className="flex items-center justify-between p-4">
                <div className="font-medium">关于我们</div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <div className="border-t border-gray-100"></div>

              <Link href="/terms" className="flex items-center justify-between p-4">
                <div className="font-medium">用户协议</div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <div className="border-t border-gray-100"></div>

              <Link href="/privacy" className="flex items-center justify-between p-4">
                <div className="font-medium">隐私政策</div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>

            {/* 版本信息 */}
            <div className="text-center text-xs text-gray-500 mt-6">
              <p>星辰资本 v1.0.0</p>
            </div>

            {/* 退出登录按钮 */}
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 mt-4"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              退出登录
            </Button>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

