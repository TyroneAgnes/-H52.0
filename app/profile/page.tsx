"use client"

import { useState, useEffect } from "react"
import type { ReactElement } from "react"
import {
  Star,
  Copy,
  ChevronRight,
  Settings,
  LogOut,
  Users,
  Bell,
  HelpCircle,
  FileText,
  CreditCard,
  Plus,
  ArrowUpRight,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PageBackground from "@/components/page-background"
import BottomNav from "@/components/bottom-nav"
import { useStore } from "@/lib/store"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface MenuItem {
  icon: React.ReactNode
  title: string
  subtitle: string
  href: string
}

interface StarInvestHistoryItemProps {
  date: string
  mentorName: string
  amount: string
  profit: string
  percentage: string
}

export default function ProfilePage() {
  const { 
    getProfitOverview, 
    getStarInvestHistory,
    logout,
    userBalance,
    starWalletBalance,
    starInvestBalance,
    calculateTotalAssets,
    userInfo,
  } = useStore()
  const [profitData, setProfitData] = useState({ totalProfit: "0", profitRate: "0" })
  const [historyRecords, setHistoryRecords] = useState<ReturnType<typeof getStarInvestHistory>>([])
  const [totalAssets, setTotalAssets] = useState(0)

  useEffect(() => {
    // 获取收益概览数据
    const overview = getProfitOverview()
    setProfitData(overview)

    // 获取历史记录
    const history = getStarInvestHistory()
    setHistoryRecords(history)

    // 计算总资产
    const total = calculateTotalAssets()
    setTotalAssets(total)
  }, [getProfitOverview, getStarInvestHistory, calculateTotalAssets])

  // 复制推广码
  const copyPromoCode = () => {
    if (!userInfo?.inviteCode) return
    navigator.clipboard.writeText(userInfo.inviteCode)
    alert("推广码已复制到剪贴板")
  }

  // 获取收益曲线数据点
  const getChartPath = () => {
    if (!historyRecords.length) return ""

    const maxValue = Math.max(...historyRecords.map(record => parseFloat(record.profit)))
    const minValue = Math.min(...historyRecords.map(record => parseFloat(record.profit)))
    const range = maxValue - minValue
    const height = 100
    const width = 100

    // 计算标准化后的点
    const points = historyRecords.map((record, index) => {
      const x = (index / (historyRecords.length - 1)) * width
      const y = height - ((parseFloat(record.profit) - minValue) / range) * height
      return `${x},${y}`
    })

    return `M0,${points[0].split(",")[1]} L${points.join(" L")} L100,${points[historyRecords.length - 1].split(",")[1]}`
  }

  // 处理退出登录
  const handleLogout = () => {
    logout()
    // 退出后跳转到登录页
    window.location.href = "/login"
  }

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen pb-14">
        {/* 使用Header组件 */}
        <Header title="我的" />

        {/* 用户信息区域 */}
        <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white px-4 pt-5 pb-6">
          <div className="flex items-start">
            <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden mr-4">
              <img
                src={userInfo?.avatar || "/avatars/default.png"}
                alt="用户头像"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{userInfo?.nickname}</h2>
                  <div className="flex items-center mt-1 text-sm opacity-90">
                    <span>ID: {userInfo?.id}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white"
                  onClick={() => (window.location.href = "/profile/edit")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-pencil"
                  >
                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    <path d="m15 5 4 4" />
                  </svg>
                </Button>
              </div>
              <div className="flex items-center mt-2">
                <div className="bg-white/20 rounded-full px-3 py-1 text-xs flex items-center">
                  <span className="mr-2">推广码: {userInfo?.inviteCode}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 p-0 text-white hover:text-white hover:bg-white/20"
                    onClick={copyPromoCode}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 资产信息区域 */}
        <div className="px-4 py-4 space-y-5">
          {/* 资产卡片 */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">我的资产</h2>
                <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-blue-600">
                  资产明细 <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                </Button>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-500 mb-1">总资产 (CNY)</div>
                <div className="text-2xl font-bold">¥ {totalAssets.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <CreditCard className="h-4 w-4 mr-1.5 text-blue-600" />
                    <span className="text-sm text-gray-600">余额钱包</span>
                  </div>
                  <div className="text-lg font-semibold">¥ {userBalance.toLocaleString()}</div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center mb-1">
                    <Star className="h-4 w-4 mr-1.5 text-purple-600" />
                    <span className="text-sm text-gray-600">星钱包</span>
                  </div>
                  <div className="text-lg font-semibold">¥ {starWalletBalance.toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-3 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center mb-1">
                  <Star className="h-4 w-4 mr-1.5 text-orange-600" />
                  <span className="text-sm text-gray-600">星投资金</span>
                </div>
                <div className="text-lg font-semibold">¥ {starInvestBalance.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* 收益概览卡片 */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">收益概览</h2>
                <Select defaultValue="周">
                  <SelectTrigger className="w-20 h-7 text-xs">
                    <SelectValue placeholder="时间范围" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="周">周</SelectItem>
                    <SelectItem value="月">月</SelectItem>
                    <SelectItem value="年">年</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="h-48 w-full relative">
                <div className="absolute top-0 left-0 p-2">
                  <div className="text-sm text-gray-500">总收益</div>
                  <div className="text-xl font-bold text-green-600">+¥{profitData.totalProfit}</div>
                  <div className="text-sm text-green-600">+{profitData.profitRate}%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 星投历史收益记录 */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">星投历史收益记录</h2>
                <Link href="/profile/star-invest-history">
                  <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-blue-600">
                    查看全部 <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                  </Button>
                </Link>
              </div>

              <div className="space-y-3">
                {historyRecords.slice(0, 5).map((record, index) => (
                  <StarInvestHistoryItem
                    key={index}
                    date={record.date}
                    mentorName={record.mentorName}
                    amount={record.amount}
                    profit={record.profit}
                    percentage={record.profitRate}
                  />
                ))}
                {historyRecords.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    暂无收益记录
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 功能菜单 */}
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                <MenuItem
                  icon={<Users className="h-5 w-5 text-blue-600" />}
                  title="代理中心"
                  subtitle="查看您的代理收益和团队"
                  href="/agent"
                />

                <MenuItem
                  icon={<Bell className="h-5 w-5 text-orange-500" />}
                  title="消息通知"
                  subtitle="查看系统通知和公告"
                  href="/notifications"
                />

                {/* Remove the security center menu item */}
                {/* <MenuItem
                  icon={<Shield className="h-5 w-5 text-green-600" />}
                  title="安全中心"
                  subtitle="管理账户安全和验证"
                  href="/security"
                /> */}

                <MenuItem
                  icon={<HelpCircle className="h-5 w-5 text-purple-600" />}
                  title="帮助中心"
                  subtitle="常见问题和客服支持"
                  href="/help"
                />

                <MenuItem
                  icon={<FileText className="h-5 w-5 text-gray-600" />}
                  title="关于我们"
                  subtitle="了解星辰资本"
                  href="/about"
                />

                <MenuItem
                  icon={<Settings className="h-5 w-5 text-gray-600" />}
                  title="设置"
                  subtitle="账户设置和偏好"
                  href="/settings"
                />
              </div>
            </CardContent>
          </Card>

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

        {/* 底部标签栏 */}
        <BottomNav />

        {/* 功能按钮区域 */}
        <div className="fixed bottom-16 left-0 right-0 flex justify-around bg-white shadow-md z-50 h-20">
          <Link href="/recharge" className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <Plus className="h-7 w-7" />
            </div>
            <span className="text-sm text-gray-700">充值</span>
          </Link>
          <Link href="/withdraw" className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-2">
              <ArrowUpRight className="h-7 w-7" />
            </div>
            <span className="text-sm text-gray-700">提现</span>
          </Link>
        </div>
      </div>
    </PageBackground>
  )
}

// 菜单项组件
function MenuItem({ icon, title, subtitle, href }: MenuItem): ReactElement {
  return (
    <Link href={href}>
      <div className="flex items-center p-4 hover:bg-gray-50">
        {icon}
        <div className="ml-3 flex-1">
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-gray-500 mt-0.5">{subtitle}</div>
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400" />
      </div>
    </Link>
  )
}

// 星投历史收益项组件
function StarInvestHistoryItem({ date, mentorName, amount, profit, percentage }: StarInvestHistoryItemProps): ReactElement {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex-1">
        <div className="flex items-center">
          <div className="text-sm font-medium">{date}</div>
          <div className="text-xs text-gray-500 ml-2">导师: {mentorName}</div>
        </div>
        <div className="text-xs text-gray-500 mt-1">投资金额: ¥{amount}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-green-600">+¥{profit}</div>
        <div className="text-xs text-green-600 mt-0.5">+{percentage}</div>
      </div>
    </div>
  )
}

