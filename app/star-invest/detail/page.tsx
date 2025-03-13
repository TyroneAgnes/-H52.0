"use client"

import { useState } from "react"
import { ArrowLeft, ChevronRight, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Header from "@/components/header"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { useStore } from "@/lib/store"

function PerformanceChart({ data, height = "160px" }: { data: any[]; height?: string }) {
  return (
    <div style={{ height }} className="w-full">
      <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0.2)" />
            <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        <g className="grid-lines" stroke="rgba(0,0,0,0.1)" strokeDasharray="0.5,1">
          <line x1="0" y1="10" x2="100" y2="10" />
          <line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="30" x2="100" y2="30" />
        </g>

        {/* Line chart */}
        <path d={`M0,30 C20,28 40,15 60,18 S80,25 100,10`} fill="none" stroke="#2563eb" strokeWidth="2" />

        {/* Area under the line */}
        <path d={`M0,30 C20,28 40,15 60,18 S80,25 100,10 L100,40 L0,40 Z`} fill="url(#gradient)" />
      </svg>
    </div>
  )
}

export default function MentorDetailPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isFollowing, setIsFollowing] = useState(false)
  const [amount, setAmount] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { userBalance, addTradeRecord, setUserBalance, starInvestBalance, setStarInvestBalance } = useStore()

  // 模拟导师数据
  const mentor = {
    id: 1,
    name: "陈维德",
    avatar: "/images/mentor/david-chen.jpg",
    title: "资深金融分析师",
    experience: "20多年国际证券市场经验",
    followers: 652,
    followCount: 639,
    rating: 4.98,
    description:
      "陈维德(David Chen) 20多年国际证券市场操盘经验，精通各种短线博弈策略。曾任职于多家国际投行，擅长把握市场热点，捕捉短线机会。以技术分析为主，擅长短线操作，平均持仓时间1-3天。重视风险控制，单笔止损不超过2%，注重高胜率策略。",
    performance: {
      daily: 2.8,
      weekly: 12.5,
      monthly: 73.33,
      fiveDayAvg: 2.84,
    },
    investAmount: 500000000,
    minInvestment: 100,
    tradingStyle: "短线操作 + 技术分析",
    riskLevel: "风险偏好",
    tags: ["港股", "美股", "短线高手", "技术分析"],
    yesterdayTrades: [
      {
        id: 1,
        market: "港股",
        symbol: "00700",
        name: "腾讯控股",
        action: "买入",
        price: 368.4,
        quantity: 2000,
        time: "10:15:32",
        return: 2.5,
      },
      {
        id: 2,
        market: "美股",
        symbol: "AAPL",
        name: "苹果公司",
        action: "卖出",
        price: 182.63,
        quantity: 500,
        time: "21:45:18",
        return: 3.2,
      },
      {
        id: 3,
        market: "港股",
        symbol: "09988",
        name: "阿里巴巴",
        action: "买入",
        price: 72.85,
        quantity: 3000,
        time: "14:22:05",
        return: 1.8,
      },
      {
        id: 4,
        market: "美股",
        symbol: "NVDA",
        name: "英伟达",
        action: "买入",
        price: 924.73,
        quantity: 100,
        time: "20:05:43",
        return: 5.2,
      },
      {
        id: 5,
        market: "日股",
        symbol: "6758",
        name: "索尼集团",
        action: "卖出",
        price: 12650,
        quantity: 200,
        time: "13:10:27",
        return: 4.1,
      },
      {
        id: 6,
        market: "期货",
        symbol: "GC",
        name: "黄金期货",
        action: "买入",
        price: 2335.8,
        quantity: 5,
        time: "22:35:12",
        return: 2.9,
      },
      {
        id: 7,
        market: "美股",
        symbol: "TSLA",
        name: "特斯拉",
        action: "卖出",
        price: 175.21,
        quantity: 300,
        time: "21:05:38",
        return: 3.7,
      },
      {
        id: 8,
        market: "日股",
        symbol: "7203",
        name: "丰田汽车",
        action: "买入",
        price: 2850,
        quantity: 150,
        time: "13:45:22",
        return: 2.1,
      },
    ],
    portfolioComposition: [
      { category: "科技", percentage: 45 },
      { category: "金融", percentage: 25 },
      { category: "消费", percentage: 15 },
      { category: "医疗", percentage: 10 },
      { category: "能源", percentage: 5 },
    ],
    monthlyReturns: [
      { month: "1月", return: 5.2 },
      { month: "2月", return: -2.1 },
      { month: "3月", return: 7.8 },
      { month: "4月", return: 4.5 },
      { month: "5月", return: 3.2 },
      { month: "6月", return: -1.5 },
      { month: "7月", return: 6.7 },
      { month: "8月", return: 5.3 },
      { month: "9月", return: 2.1 },
      { month: "10月", return: 4.8 },
      { month: "11月", return: 3.9 },
      { month: "12月", return: 8.2 },
    ],
  }

  // 注意：跟投人数(followCount)自动增长逻辑
  // 1. 每有一人操作成功跟投，数值随机+1到3
  // 2. 一小时内无人跟投，且时间在每天的9点到17点期间，每半小时数值增加1-3

  const performanceData = [
    { month: "1月", return: 5.2 },
    { month: "2月", return: -2.1 },
    { month: "3月", return: 7.8 },
    { month: "4月", return: 4.5 },
    { month: "5月", return: 3.2 },
    { month: "6月", return: -1.5 },
    { month: "7月", return: 6.7 },
    { month: "8月", return: 5.3 },
    { month: "9月", return: 2.1 },
    { month: "10月", return: 4.8 },
    { month: "11月", return: 3.9 },
    { month: "12月", return: 8.2 },
  ]

  // 计算昨日实际收益率
  const getYesterdayReturn = () => {
    const trades = mentor.yesterdayTrades || []
    if (trades.length === 0) return 0
    
    const totalReturn = trades.reduce((sum, trade) => sum + trade.return, 0)
    return (totalReturn / trades.length).toFixed(2)
  }

  // 计算预期收益
  const calculateExpectedReturn = (investAmount: number) => {
    const yesterdayReturn = Number(getYesterdayReturn())
    if (!investAmount || yesterdayReturn === 0) return 0
    return (investAmount * (yesterdayReturn / 100)).toFixed(2)
  }

  // 处理关注/取消关注
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing)

    toast({
      title: isFollowing ? "已取消关注" : "已关注",
      description: isFollowing ? `您已取消关注${mentor.name}导师` : `您已成功关注${mentor.name}导师`,
    })
  }

  // 处理投资
  const handleInvest = async () => {
    try {
      setIsSubmitting(true)
      
      // 检查投资金额是否有效
      const investAmount = Number(amount)
      if (!investAmount || investAmount <= 0) {
        toast({
          title: "投资金额无效",
          description: "请输入有效的投资金额",
          variant: "destructive",
        })
        return
      }

      // 检查余额是否充足
      if (userBalance < investAmount) {
        toast({
          title: "余额不足",
          description: "请先充值",
          variant: "destructive",
        })
        return
      }

      // 创建交易记录
      const response = await fetch('/api/trade/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'buy',
          symbol: `星投-${mentor.name}`,
          price: 1, // 单价为1，amount为投资金额
          amount: investAmount,
          mentorId: mentor.id,
          mentorName: mentor.name
        })
      })

      if (!response.ok) {
        throw new Error('创建交易失败')
      }

      const { trade } = await response.json()

      // 更新用户余额
      setUserBalance(userBalance - investAmount)
      setStarInvestBalance(starInvestBalance + investAmount)

      // 显示成功提示
      toast({
        title: "投资成功",
        description: `您已成功投资¥${investAmount.toLocaleString()}`,
      })

      // 刷新页面以更新数据
      router.refresh()
    } catch (error) {
      console.error('投资失败:', error)
      toast({
        title: "投资失败",
        description: "请稍后重试",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      <Header
        title="导师详情"
        centerTitle={true}
        showBell={true}
        showLogo={false}
        leftComponent={
          <Link href="/star-invest" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
      />

      {/* 导师基本信息 */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white px-4 py-5">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mr-4 border-2 border-white/30">
            <img 
              src={mentor.avatar} 
              alt={mentor.name} 
              className="w-full h-full object-cover object-[center_20%]" 
            />
          </div>
          <div>
            <h2 className="font-semibold text-xl">{mentor.name}</h2>
            <p className="text-white/80 text-sm">{mentor.title}</p>
            <div className="flex items-center mt-1 text-xs text-white/70">
              <Clock className="h-3 w-3 mr-1" />
              <span>{mentor.experience}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="text-center">
            <div className="text-lg font-semibold">{mentor.performance.daily}%</div>
            <div className="text-xs text-white/70">日收益</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{mentor.performance.weekly}%</div>
            <div className="text-xs text-white/70">周收益</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold">{mentor.followCount}人</div>
            <div className="text-xs text-white/70">跟投人数</div>
          </div>
        </div>

        <div className="flex space-x-3 mt-5">
          <div className="flex-1">
            <div className="text-sm text-white/80 mb-2">
              可用余额：¥{userBalance.toLocaleString()}
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="请输入星投金额"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-10 px-4 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 text-sm">
                元
              </div>
            </div>
            <div className="mt-2 space-y-1">
              {amount && Number(amount) > 0 && (
                <div className="text-xs text-white/70">
                  预期日收益: ¥{calculateExpectedReturn(Number(amount))}（昨日收益率 {getYesterdayReturn()}%）
                </div>
              )}
            </div>
          </div>
          <Button
            className="w-40 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handleInvest}
            disabled={isSubmitting}
          >
            {isSubmitting ? "投资中..." : "一键跟投"}
          </Button>
        </div>
      </div>

      {/* 标签栏 */}
      <div className="px-4 py-3">
        <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="trades">交易记录</TabsTrigger>
            <TabsTrigger value="analysis">投资分析</TabsTrigger>
          </TabsList>

          {/* 概览标签内容 */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">导师简介</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{mentor.description}</p>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-gray-500">交易风格</div>
                    <div className="text-sm font-medium">{mentor.tradingStyle}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">风险等级</div>
                    <div className="text-sm font-medium">{mentor.riskLevel}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">管理资金</div>
                    <div className="text-sm font-medium">¥{(mentor.investAmount / 100000000).toFixed(1)}亿</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">最低投资</div>
                    <div className="text-sm font-medium">¥{mentor.minInvestment}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {mentor.tags.map((tag, index) => (
                    <span key={index} className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 mt-4">
                  <div>
                    <div className="text-xs text-gray-500">星投条件</div>
                    <div className="text-sm font-medium">最低星投金额100元</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">费用说明</div>
                    <div className="text-sm font-medium">导师抽佣15% + 平台抽佣5%</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">预期收益率</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div className="text-center">
                    <div
                      className={`text-lg font-semibold ${mentor.performance.daily >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {mentor.performance.daily >= 0 ? "+" : ""}
                      {mentor.performance.daily}%
                    </div>
                    <div className="text-xs text-gray-500">预期日收益率</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">收益表现</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div
                      className={`text-lg font-semibold ${mentor.performance.daily >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {mentor.performance.daily >= 0 ? "+" : ""}
                      {mentor.performance.daily}%
                    </div>
                    <div className="text-xs text-gray-500">日收益</div>
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-lg font-semibold ${mentor.performance.weekly >= 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {mentor.performance.weekly >= 0 ? "+" : ""}
                      {mentor.performance.weekly}%
                    </div>
                    <div className="text-xs text-gray-500">周收益</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {mentor.followCount}人
                    </div>
                    <div className="text-xs text-gray-500">跟投人数</div>
                  </div>
                </div>

                {/* 这里可以添加收益图表 */}
                <div className="mt-3">
                  <PerformanceChart data={performanceData} />
                </div>
              </CardContent>
            </Card>

            {/* 昨日交易记录 */}
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">昨日收益记录</h3>
                  <Link href="#" className="text-xs text-blue-600 flex items-center">
                    查看更多
                    <ChevronRight className="h-3 w-3 ml-0.5" />
                  </Link>
                </div>

                <div className="space-y-3">
                  {mentor.yesterdayTrades.slice(0, 3).map((trade) => (
                    <div key={trade.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${trade.action === "买入" ? "bg-green-100" : "bg-red-100"}`}
                        >
                          {trade.action === "买入" ? (
                            <ArrowUpRight className={`h-4 w-4 text-green-600`} />
                          ) : (
                            <ArrowDownRight className={`h-4 w-4 text-red-600`} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{trade.name}</span>
                            <span className="text-xs text-gray-500 ml-1">
                              ({trade.market} {trade.symbol})
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {trade.action} {trade.quantity}股 @ ¥{trade.price}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${trade.return >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {trade.return >= 0 ? "+" : ""}
                        {trade.return}%
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 交易记录标签内容 */}
          <TabsContent value="trades" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">昨日交易记录</h3>

                <div className="space-y-4">
                  {mentor.yesterdayTrades.map((trade) => (
                    <div key={trade.id} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${trade.action === "买入" ? "bg-green-100" : "bg-red-100"}`}
                          >
                            {trade.action === "买入" ? (
                              <ArrowUpRight className={`h-4 w-4 text-green-600`} />
                            ) : (
                              <ArrowDownRight className={`h-4 w-4 text-red-600`} />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{trade.name}</div>
                            <div className="text-xs text-gray-500">
                              {trade.market} {trade.symbol}
                            </div>
                          </div>
                        </div>
                        <div className={`text-sm font-medium ${trade.return >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {trade.return >= 0 ? "+" : ""}
                          {trade.return}%
                        </div>
                      </div>

                      <div className="ml-11 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-gray-500">操作</div>
                          <div className={`font-medium ${trade.action === "买入" ? "text-green-600" : "text-red-600"}`}>
                            {trade.action}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">价格</div>
                          <div className="font-medium">¥{trade.price}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">数量</div>
                          <div className="font-medium">{trade.quantity}股</div>
                        </div>
                        <div className="col-span-3">
                          <div className="text-gray-500">时间</div>
                          <div className="font-medium">{trade.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 投资分析标签内容 */}
          <TabsContent value="analysis" className="space-y-4">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">投资组合分布</h3>

                <div className="space-y-3">
                  {mentor.portfolioComposition.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.category}</span>
                        <span className="font-medium">{item.percentage}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">月度收益率</h3>

                <div className="grid grid-cols-4 gap-3">
                  {mentor.monthlyReturns.map((item, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-sm font-medium ${item.return >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {item.return >= 0 ? "+" : ""}
                        {item.return}%
                      </div>
                      <div className="text-xs text-gray-500">{item.month}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">风险分析</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500">最大回撤</div>
                    <div className="text-sm font-medium text-red-600">-12.5%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">夏普比率</div>
                    <div className="text-sm font-medium">1.85</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">胜率</div>
                    <div className="text-sm font-medium">68.5%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">年化波动率</div>
                    <div className="text-sm font-medium">15.2%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

