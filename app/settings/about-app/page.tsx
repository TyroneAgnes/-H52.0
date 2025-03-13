"use client"

import { ArrowLeft, Info, Globe, Shield, Code, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Header from "@/components/header"
import StarCapitalLogo from "@/components/logo"

export default function AboutAppPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="关于应用"
        centerTitle={true}
        showBell={false}
        showLogo={false}
        leftComponent={
          <Link href="/settings" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
      />

      <div className="px-4 py-4 space-y-4">
        <div className="flex flex-col items-center justify-center py-6">
          <StarCapitalLogo size="lg" />
          <h1 className="text-xl font-bold mt-4">星辰资本</h1>
          <p className="text-sm text-gray-500 mt-1">版本 1.0.0</p>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">应用简介</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    星辰资本是一款专业的投资理财应用，为用户提供全球资产配置和财富管理服务。通过星投功能，用户可以跟随专业投资导师进行投资，分享投资收益。
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Globe className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">官方网站</h3>
                  <p className="text-sm text-gray-600 mt-1">www.starcapital.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <Shield className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">隐私政策</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <Link href="/about/privacy" className="text-blue-600">
                      查看隐私政策
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Code className="h-5 w-5 text-orange-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">服务条款</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    <Link href="/about/terms" className="text-blue-600">
                      查看服务条款
                    </Link>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Download className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <h3 className="font-medium">检查更新</h3>
                  <p className="text-sm text-gray-600 mt-1">当前已是最新版本</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-500 py-4">
          <p>© 2024 星辰资本集团 版权所有</p>
        </div>
      </div>
    </div>
  )
}

