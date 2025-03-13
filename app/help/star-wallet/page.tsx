"use client"

import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import PageBackground from "@/components/page-background"

export default function StarWalletHelpPage() {
  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header
          title="星钱包帮助"
          leftComponent={
            <Link href="/help">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
          }
        />

        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3" id="q1">
              星钱包收益规则是什么?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>星钱包是我们平台提供的一种高收益理财产品，具有以下特点：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">固定收益率</span>：星钱包提供
                  <span className="text-blue-600 font-medium">固定收益</span>
                  ，每日收益率为1.2%。
                </li>
                <li>
                  <span className="font-medium">灵活存取</span>：用户可以随时向星钱包转入或转出资金。
                </li>
                <li>
                  <span className="font-medium">每日结算</span>
                  ：系统每日10:00结算前一日收益，并自动将本金和收益转出到用户余额。
                </li>
              </ul>
              <p className="bg-blue-50 p-3 rounded-lg text-blue-700">
                重要提示：用户需要在每日24:00前手动转入资金到星钱包，才能参与次日的收益计算。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3" id="q2">
              如何向星钱包转入资金?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>向星钱包转入资金非常简单：</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>在交易页面，点击星钱包卡片上的"转入"按钮</li>
                <li>输入您想要转入的金额</li>
                <li>确认转入</li>
              </ol>
              <p>转入操作会立即从您的余额中扣除相应金额，并添加到星钱包中。</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3" id="q3">
              星钱包收益何时结算?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>星钱包的收益结算规则如下：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>用户需要在每日24:00前手动转入资金到星钱包</li>
                <li>系统会在第二日10:00结算一次收益</li>
                <li>结算后，本金和利润会自动转出到用户余额</li>
              </ul>
              <p className="bg-yellow-50 p-3 rounded-lg text-yellow-700">
                示例：如果您在周一22:00向星钱包转入10,000元，系统会在周二10:00结算收益，您将获得10,000 × 1.2% =
                120元的收益，总计10,120元会自动转回您的余额。
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3" id="q4">
              星钱包的资金如何转出?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>星钱包的资金转出是自动进行的：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>系统会在每日10:00自动将星钱包中的本金和收益转出到您的余额</li>
                <li>您无需手动操作转出</li>
                <li>转出后，您可以选择再次转入或提现到您的银行账户</li>
              </ul>
              <p>如果您希望继续获得星钱包的高收益，需要在每日24:00前再次手动转入资金。</p>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

