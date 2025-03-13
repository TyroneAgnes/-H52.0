"use client"

import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import PageBackground from "@/components/page-background"

export default function StarInvestHelpPage() {
  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header
          title="星投帮助"
          leftComponent={
            <Link href="/help">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
          }
        />

        <div className="flex-1 p-4">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3" id="q1">
              什么是星投?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                星投是我们平台的特色投资产品，由专业投资导师管理的投资组合。您可以跟随导师的投资策略，分享投资收益。
              </p>
              <p>通过星投，您可以：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>跟随专业投资导师进行投资</li>
                <li>无需自己研究市场和选股</li>
                <li>享受专业团队带来的稳定收益</li>
                <li>随时查看投资组合和收益情况</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3" id="q2">
              星投收益如何计算?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>星投收益计算公式：</p>
              <p className="bg-blue-50 p-3 rounded-lg text-blue-700 font-medium">
                星投收益 = 投资金额 × 收益率 × (1 - 导师抽佣比例 - 平台抽佣比例)
              </p>
              <p>其中：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>导师抽佣比例通常为15%</li>
                <li>平台抽佣比例通常为5%</li>
              </ul>
              <p>收益按日计算，每日更新。不同导师的收益率和抽佣比例可能不同。</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3" id="q3">
              如何选择星投导师?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>选择星投导师时，您可以考虑以下因素：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <span className="font-medium">历史业绩</span>：查看导师的历史收益率和稳定性
                </li>
                <li>
                  <span className="font-medium">投资风格</span>：了解导师的投资策略和风格是否符合您的风险偏好
                </li>
                <li>
                  <span className="font-medium">投资领域</span>：考虑导师专注的市场和行业
                </li>
                <li>
                  <span className="font-medium">用户评价</span>：参考其他投资者的评价和反馈
                </li>
              </ul>
              <p>您可以在星投页面查看每位导师的详细信息和业绩数据，帮助您做出明智的选择。</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <h2 className="text-lg font-semibold mb-3" id="q4">
              星投每日收益率是多少?
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                星投提供<span className="text-blue-600 font-medium">浮动收益</span>，根据市场情况和导师表现而变化。
              </p>
              <p>历史收益数据：</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>平均日收益率：0.8% - 1.5%</li>
              </ul>
              <p className="bg-yellow-50 p-3 rounded-lg text-yellow-700">
                请注意：历史收益不代表未来表现，投资有风险。实际收益会受到导师抽佣和平台抽佣的影响，最终到手收益约为收益的80%（假设导师抽佣15%，平台抽佣5%）。结算时间为次日9:00-11:30之间随机时间。
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

