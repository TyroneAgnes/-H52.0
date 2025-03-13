"use client"

import { useState, useEffect } from "react"
import { Wallet, Star, Calendar, Filter, ChevronRight, Plus, Download, Bell } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import PageBackground from "@/components/page-background"
import { useRouter } from "next/navigation"
import BottomNav from "@/components/bottom-nav"
import { useStore } from "@/lib/store"

// 定义交易记录类型
interface TradeRecord {
  id: string
  type: "buy" | "sell" | "deposit" | "withdraw"
  symbol: string
  amount: number
  total: number
  status: string
  createTime: string
  returnTime?: string
  returnAmount?: number
  returnRate?: number
}

export default function TradePage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState("7d")
  const [totalProfit, setTotalProfit] = useState("0")
  const [profitPercentage, setProfitPercentage] = useState("0")
  const [profitTrend, setProfitTrend] = useState<number[]>([])
  const router = useRouter()

  const { userBalance, starWalletBalance, tradeRecords } = useStore()

  // 移除模拟数据的useEffect
  useEffect(() => {
    setTotalProfit("0")
    setProfitPercentage("0")
    setProfitTrend([])
  }, [timeRange])

  // 处理交易记录数据
  const transactionData = {
    starInvest: tradeRecords.filter(record => 
      record.type === "buy" && record.symbol?.startsWith('星投-') && record.status === "completed"
    ).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()),
    starWallet: tradeRecords.filter(record => 
      record.type === "buy" && record.symbol?.startsWith('星钱包-') && record.status === "completed"
    ).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()),
    deposit: tradeRecords.filter(record => 
      record.type === "deposit" && record.status === "completed"
    ).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()),
    withdraw: tradeRecords.filter(record => 
      record.type === "withdraw" && record.status === "completed"
    ).sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
  }

  // 格式化日期时间
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      date: date.toLocaleDateString('zh-CN'),
      time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  }

  // 获取收益曲线数据点
  const getChartPath = () => {
    if (!profitTrend.length) return ""

    const maxValue = Math.max(...profitTrend)
    const minValue = Math.min(...profitTrend)
    const range = maxValue - minValue
    const height = 100
    const width = 100

    // 计算标准化后的点
    const points = profitTrend.map((value, index) => {
      const x = (index / (profitTrend.length - 1)) * width
      const y = height - ((value - minValue) / range) * height
      return `${x},${y}`
    })

    return `M0,${points[0].split(",")[1]} L${points.join(" L")} L100,${points[profitTrend.length - 1].split(",")[1]}`
  }

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen pb-14">
        {/* 使用Header组件 */}
        <Header title="交易" />

        {/* 内容区域 */}
        <div className="px-4 py-4 space-y-5">
          {/* 钱包卡片区域 - 全新设计 */}
          <div className="space-y-4">
            {/* 余额钱包卡片 - 优化零余额显示 */}
            <Card className="border-0 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="bg-blue-700 text-white p-4">
                  <div className="flex items-center mb-1">
                    <Wallet className="h-4 w-4 mr-2 opacity-80" />
                    <span className="text-sm font-medium">可用余额</span>
                  </div>
                  <div className="text-xl font-bold mb-1">¥{userBalance.toLocaleString()}</div>
                  {userBalance === 0 && (
                    <div className="text-xs text-blue-200 mb-2">新用户余额为0，请先充值</div>
                  )}
                  <div className="flex space-x-2 mt-2">
                    <Link href="/recharge" className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-white border-0">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        充值
                      </Button>
                    </Link>
                    <Link href="/withdraw" className="flex-1">
                      <Button variant="secondary" size="sm" className="w-full bg-blue-600 hover:bg-blue-500 text-white border-0">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        提现
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 星钱包卡片 - 匹配新设计 */}
            <Card className="border-0 shadow-sm overflow-hidden bg-white">
              <CardContent className="p-0">
                <div className="bg-purple-700 text-white p-4">
                  <div className="flex items-center mb-1">
                    <Star className="h-4 w-4 mr-2 opacity-80" />
                    <span className="text-sm font-medium">星钱包</span>
                  </div>
                  <div className="text-xl font-bold mb-1">¥{starWalletBalance.toLocaleString()}</div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <span className="text-xs text-purple-200 mr-2">收益</span>
                      <span className="text-xs bg-purple-600 text-white px-1.5 py-0.5 rounded">+{profitPercentage}%</span>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-purple-600 hover:bg-purple-500 text-white border-0"
                      onClick={() => router.push("/star-invest/transfer")}
                    >
                      转入
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 收益曲线 */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">收益曲线</h2>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-24 h-7 text-xs">
                    <SelectValue placeholder="时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">7天</SelectItem>
                    <SelectItem value="30d">30天</SelectItem>
                    <SelectItem value="90d">90天</SelectItem>
                    <SelectItem value="1y">1年</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-48 w-full relative">
                <div className="h-full w-full flex items-center justify-center text-gray-400">暂无数据</div>
                {/* 收益数据 */}
                <div className="absolute top-0 left-0 p-2">
                  <div className="text-sm text-gray-500">总收益</div>
                  <div className="text-xl font-bold text-green-600">+¥{totalProfit}</div>
                  <div className="text-sm text-green-600">+{profitPercentage}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 交易记录标签页 */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <Tabs defaultValue="starInvest" className="w-full">
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="starInvest">星投记录</TabsTrigger>
                  <TabsTrigger value="starWallet">星钱包</TabsTrigger>
                  <TabsTrigger value="deposit">充值</TabsTrigger>
                  <TabsTrigger value="withdraw">提现</TabsTrigger>
                </TabsList>

                {/* 星投记录 */}
                <TabsContent value="starInvest">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-sm">星投交易记录</h3>
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {transactionData.starInvest.map((item) => {
                      const { date, time } = formatDateTime(item.createTime)
                      return (
                        <div key={item.id} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                item.type === "buy" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
                              }`}>
                                {item.type === "buy" ? "买入" : "卖出"}
                              </span>
                              <span className="ml-2 font-medium text-sm">{item.symbol}</span>
                            </div>
                            <span className="text-xs text-gray-500">{date}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold">¥{item.total.toFixed(2)}</span>
                            {item.returnAmount && item.returnRate && (
                              <div className="flex items-center">
                                <span className="text-sm text-green-600 font-medium mr-2">
                                  +¥{item.returnAmount.toFixed(2)}
                                </span>
                                <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">
                                  +{item.returnRate.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>订单号: {item.id}</span>
                            <span>{time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Button variant="ghost" className="w-full mt-3 text-sm text-blue-600">
                    查看更多 <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </TabsContent>

                {/* 星钱包记录 */}
                <TabsContent value="starWallet">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-sm">星钱包交易记录</h3>
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {transactionData.starWallet.map((item) => {
                      const { date, time } = formatDateTime(item.createTime)
                      return (
                        <div key={item.id} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                item.type === "buy" ? "bg-purple-100 text-purple-600" : "bg-orange-100 text-orange-600"
                              }`}>
                                {item.type === "buy" ? "转入" : "返还"}
                              </span>
                              <span className="ml-2 font-medium text-sm">{item.symbol}</span>
                            </div>
                            <span className="text-xs text-gray-500">{date}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold">¥{item.total.toFixed(2)}</span>
                            {item.returnAmount && item.returnRate && (
                              <div className="flex items-center">
                                <span className="text-sm text-green-600 font-medium mr-2">
                                  +¥{item.returnAmount.toFixed(2)}
                                </span>
                                <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">
                                  +{item.returnRate.toFixed(1)}%
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>订单号: {item.id}</span>
                            <span>{time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Button variant="ghost" className="w-full mt-3 text-sm text-blue-600">
                    查看更多 <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </TabsContent>

                {/* 充值记录 */}
                <TabsContent value="deposit">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-sm">充值记录</h3>
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {transactionData.deposit.map((item) => {
                      const { date, time } = formatDateTime(item.createTime)
                      return (
                        <div key={item.id} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-600">充值</span>
                              <span className="ml-2 font-medium text-sm">¥{item.total.toFixed(2)}</span>
                            </div>
                            <span className="text-xs text-gray-500">{date}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item.symbol}</span>
                            <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">
                              {item.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>订单号: {item.id}</span>
                            <span>{time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Button variant="ghost" className="w-full mt-3 text-sm text-blue-600">
                    查看更多 <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </TabsContent>

                {/* 提现记录 */}
                <TabsContent value="withdraw">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium text-sm">提现记录</h3>
                    <div className="flex items-center">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Filter className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {transactionData.withdraw.map((item) => {
                      const { date, time } = formatDateTime(item.createTime)
                      return (
                        <div key={item.id} className="border border-gray-100 rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <span className="text-xs px-2 py-0.5 rounded bg-orange-100 text-orange-600">提现</span>
                              <span className="ml-2 font-medium text-sm">¥{item.total.toFixed(2)}</span>
                            </div>
                            <span className="text-xs text-gray-500">{date}</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">{item.symbol}</span>
                            <span className="text-xs bg-green-100 text-green-600 px-1.5 py-0.5 rounded">
                              {item.status}
                            </span>
                          </div>

                          <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                            <span>订单号: {item.id}</span>
                            <span>{time}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <Button variant="ghost" className="w-full mt-3 text-sm text-blue-600">
                    查看更多 <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* 底部标签栏 */}
        <BottomNav />
      </div>
    </PageBackground>
  )
}

