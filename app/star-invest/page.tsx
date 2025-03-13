"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Medal, UserIcon, Building, LineChartIcon as ChartLine, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header"
import PageBackground from "@/components/page-background"
import BottomNav from "@/components/bottom-nav"
import { useStore } from "@/lib/store"
import Image from "next/image"

export default function StarInvestPage() {
  const router = useRouter()
  const { 
    getStarInvestTotalProfit,
    starInvestBalance,
    tradeRecords
  } = useStore()

  const [totalProfit, setTotalProfit] = useState("0")
  const [latestReturnRate, setLatestReturnRate] = useState("0")

  useEffect(() => {
    // 获取星投累计收益
    const profit = getStarInvestTotalProfit()
    setTotalProfit(profit)

    // 获取最新的星投收益率
    const latestStarInvestRecord = tradeRecords
      .filter(record => 
        record.symbol?.startsWith('星投-') && 
        record.returnAmount && 
        record.returnRate
      )
      .sort((a, b) => 
        new Date(b.returnTime || '').getTime() - new Date(a.returnTime || '').getTime()
      )[0]

    if (latestStarInvestRecord?.returnRate) {
      setLatestReturnRate(latestStarInvestRecord.returnRate.toFixed(1))
    }
  }, [getStarInvestTotalProfit, tradeRecords])

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen pb-14">
        <Header title="星投" />

        <div className="px-4 py-4 space-y-4">
          {/* 账户概览 */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="mb-4">
                <div className="text-sm text-gray-500">星投资金</div>
                <div className="text-2xl font-bold">¥ {starInvestBalance.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-sm text-blue-700 mb-1">累计收益</div>
                  <div className="text-xl font-bold text-blue-700">¥ {totalProfit}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-green-700 mb-1">最新收益率</div>
                  <div className="text-xl font-bold text-green-700">{latestReturnRate}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 星辰导师卡片 */}
          <Card
            className="border-0 shadow-md overflow-hidden cursor-pointer bg-white"
            onClick={() => router.push("/star-invest/detail")}
          >
            <CardContent className="p-5">
              <div className="flex items-center text-lg font-semibold mb-4">
                <ChartLine className="h-5 w-5 text-blue-600 mr-2" />
                星辰导师
              </div>

              <div className="rounded-lg overflow-hidden">
                {/* 导师信息 */}
                <div className="flex mb-4">
                  <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-blue-600 mr-4">
                    <div className="w-full h-full relative">
                      <img 
                        src="/images/mentor/david-chen.jpg" 
                        alt="陈维德" 
                        className="absolute w-full h-full object-cover object-[center_20%]" 
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="font-semibold text-base">陈维德</div>
                      <div className="ml-2 text-xs bg-gradient-to-r from-blue-600 to-blue-500 text-white px-2 py-0.5 rounded-full flex items-center">
                        <Medal className="h-3 w-3 mr-1" />
                        金牌导师
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mb-1">@DavidChan</div>
                  </div>
                </div>

                {/* 导师简介 */}
                <div className="text-sm text-gray-700 leading-relaxed mb-4 pb-4 border-b border-gray-100">
                  陈维德(David Chen) 20多年国际证券市场操盘经验，精通各种短线博弈策略。
                </div>

                {/* 佣金标签 */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                    <UserIcon className="h-3 w-3 text-blue-600 mr-1" />
                    导师抽佣 15%
                  </div>
                  <div className="flex items-center text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full">
                    <Building className="h-3 w-3 text-blue-600 mr-1" />
                    平台抽佣 5%
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <BottomNav />
      </div>
    </PageBackground>
  )
}

