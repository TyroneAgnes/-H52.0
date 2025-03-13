"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, ChevronDown, ChevronUp, Download } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/lib/store"

export default function StarInvestHistoryPage() {
  const [selectedMonth, setSelectedMonth] = useState("2024-03")
  const { getStarInvestHistory, getCurrentMonthStarInvestStats } = useStore()
  const [historyRecords, setHistoryRecords] = useState<ReturnType<typeof getStarInvestHistory>>([])
  const [monthlyStats, setMonthlyStats] = useState({ totalProfit: "0", averageRate: "0%" })

  useEffect(() => {
    // 获取历史记录
    const history = getStarInvestHistory()
    setHistoryRecords(history)

    // 获取当月统计数据
    const stats = getCurrentMonthStarInvestStats()
    setMonthlyStats(stats)
  }, [getStarInvestHistory, getCurrentMonthStarInvestStats])

  // 按月份筛选记录
  const currentMonthRecords = historyRecords.filter(record => 
    record.date.startsWith(selectedMonth)
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="星投历史" showBack />

      <div className="p-4 space-y-4">
        {/* 月份选择器 */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-full">
                  <SelectValue placeholder="选择月份" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-03">2024年3月</SelectItem>
                  <SelectItem value="2024-02">2024年2月</SelectItem>
                <SelectItem value="2024-01">2024年1月</SelectItem>
                </SelectContent>
              </Select>
          </CardContent>
        </Card>

        {/* 月度统计 */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-sm text-blue-700 mb-1">本月累计收益</div>
                <div className="text-xl font-bold text-blue-700">¥{monthlyStats.totalProfit}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-sm text-green-700 mb-1">平均日收益率</div>
                <div className="text-xl font-bold text-green-700">{monthlyStats.averageRate}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 日收益记录 */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-700 px-1">日收益记录</h3>

          {currentMonthRecords.length > 0 ? (
            currentMonthRecords.map((record, index) => (
              <Card key={index} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">{record.date}</div>
                    <div className="text-sm font-semibold text-green-600">+¥{record.profit}</div>
                      </div>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <div>投资金额: ¥{record.amount}</div>
                    <div className="text-green-600">+{record.profitRate}%</div>
                  </div>

                  {/* 导师交易记录 */}
                  {record.mentorTrades && record.mentorTrades.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="text-xs font-medium mb-2">导师当日交易记录</div>
                      <div className="space-y-2">
                        {record.mentorTrades.map((trade, tradeIndex) => (
                          <div key={tradeIndex} className="flex justify-between items-center text-xs">
                            <div className="flex items-center">
                              <span className={`${trade.type === '买入' ? 'text-red-500' : 'text-green-500'} mr-1`}>
                                {trade.type}
                              </span>
                              <span>{trade.stockName}</span>
                              <span className="text-gray-400 ml-1">{trade.stockCode}</span>
                            </div>
                            <div className="text-right">
                              <div>¥{trade.price.toFixed(2)}</div>
                              <div className="text-gray-400">{trade.volume}股</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 bg-white/60 rounded-lg shadow-sm">
              <p className="text-gray-500">该月暂无收益记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

