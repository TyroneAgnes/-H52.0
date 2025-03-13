"use client"

import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import PageBackground from "@/components/page-background"

export default function AboutPage() {
  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header
          title="关于我们"
          leftComponent={
            <Link href="/profile">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
          }
        />

        <div className="flex-1 p-4">
          {/* 公司logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">SC</span>
            </div>
          </div>

          {/* 公司名称和版本 */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-bold">星辰资本</h1>
            <p className="text-sm text-gray-500 mt-1">版本 1.0.0</p>
          </div>

          {/* 公司简介 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3">公司简介</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              星辰资本成立于2015年，是一家专注于全球资产配置和财富管理的金融科技公司。我们致力于为客户提供专业、安全、高效的投资理财服务。
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mt-2">
              公司总部位于上海，在北京、深圳、香港等地设有分支机构，拥有一支由资深金融专家组成的专业团队，为客户提供全方位的财富管理解决方案。
            </p>
          </div>

          {/* 我们的使命 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3">我们的使命</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              让每个人都能享受专业的财富管理服务，实现财富增值和资产保值。
            </p>
          </div>

          {/* 我们的愿景 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3">我们的愿景</h2>
            <p className="text-sm text-gray-600 leading-relaxed">成为全球领先的财富管理平台，为千万用户创造价值。</p>
          </div>

          {/* 联系我们 */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3">联系我们</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>客服热线: 400-888-8888</p>
              <p>邮箱: support@starcapital.com</p>
              <p>地址: 上海市浦东新区陆家嘴金融贸易区</p>
            </div>
          </div>

          {/* 版权信息 */}
          <div className="text-center text-xs text-gray-500 mt-6 mb-4">
            <p>© 2024 星辰资本 版权所有</p>
            <p className="mt-1">沪ICP备XXXXXXXX号</p>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

