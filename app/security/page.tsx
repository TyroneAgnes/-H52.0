"use client"

import { ChevronLeft, ChevronRight, Lock, Key, Shield, Bell } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import PageBackground from "@/components/page-background"

export default function SecurityPage() {
  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header
          title="安全中心"
          leftComponent={
            <Link href="/profile">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
          }
        />

        <div className="flex-1 p-4">
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-sm">
              <Link href="/security/login-password" className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <Lock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">登录密码</div>
                    <div className="text-xs text-gray-500 mt-0.5">用于账号登录的密码</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <div className="border-t border-gray-100"></div>

              <Link href="/security/trade-password" className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <Key className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">交易密码</div>
                    <div className="text-xs text-gray-500 mt-0.5">用于资金操作的密码</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
              <Link href="/security/account-protection" className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Shield className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium">账号保护</div>
                    <div className="text-xs text-gray-500 mt-0.5">设置账号安全保护措施</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>

              <div className="border-t border-gray-100"></div>

              <Link href="/security/login-notification" className="flex items-center justify-between p-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                    <Bell className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">登录通知</div>
                    <div className="text-xs text-gray-500 mt-0.5">设置异常登录通知</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-500">
                <p className="mb-2">安全提示：</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>定期修改密码，提高账号安全性</li>
                  <li>不要将密码告诉他人或在不安全的环境下登录</li>
                  <li>设置不同的登录密码和交易密码</li>
                  <li>如发现账号异常，请立即联系客服</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

