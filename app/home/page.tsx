"use client"

import { useState, useEffect } from "react"
import { Bell, Plus, Minus, Star, LineChartIcon as ChartLine, Users, Headphones, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import Header from "@/components/header"
import BottomNav from "@/components/bottom-nav"
import PageBackground from "@/components/page-background"

export default function HomePage() {
  const [totalAssets, setTotalAssets] = useState("0.00")
  const [yesterdayProfit, setYesterdayProfit] = useState("0.00")

  // 模拟获取账户信息
  useEffect(() => {
    // 实际应用中这里会调用API
    setTimeout(() => {
      setTotalAssets("12,345.67")
      setYesterdayProfit("123.45")
    }, 1000)
  }, [])

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen pb-14">
        {/* 使用Header组件 */}
        <Header title="星辰资本" rightComponent={<Bell className="h-5 w-5 text-gray-600" />} />

        {/* 账户资产 */}
        <Card className="mx-4 mt-4 p-4 rounded-lg shadow-sm bg-white">
          <div className="text-sm text-gray-500 mb-2">账户总资产 (¥)</div>
          <div className="text-2xl font-bold mb-2">¥ {totalAssets}</div>
          <div className="text-sm text-green-500">昨日收益 ¥ {yesterdayProfit}</div>
        </Card>

        {/* 公司简介 Banner */}
        <div className="mx-4 mt-4 p-4 rounded-lg bg-gradient-to-r from-blue-900 to-blue-600 text-white">
          <div className="flex items-center mb-2 font-semibold">
            <div className="w-5 h-5 mr-2 flex items-center justify-center rounded-full bg-yellow-400 text-blue-900">
              <span className="text-xs">★</span>
            </div>
            星辰资本
          </div>
          <p className="text-sm opacity-90 leading-relaxed">
            星辰资本成立于2015年，是一家专注于全球资产配置和财富管理的金融科技公司。我们致力于为客户提供专业、安全、高效的投资理财服务。
          </p>
        </div>

        {/* 功能按钮 */}
        <Card className="mx-4 mt-4 p-5 rounded-lg shadow-sm bg-white">
          <div className="grid grid-cols-3 gap-6">
            <Link href="/recharge">
              <FunctionButton
                icon={<Plus className="h-6 w-6" />}
                text="充值"
                bgColor="bg-blue-100"
                textColor="text-blue-600"
              />
            </Link>
            <Link href="/withdraw">
              <FunctionButton
                icon={<Minus className="h-6 w-6" />}
                text="提现"
                bgColor="bg-orange-100"
                textColor="text-orange-600"
              />
            </Link>
            <Link href="/star-invest">
              <FunctionButton
                icon={<Star className="h-6 w-6" />}
                text="星投"
                bgColor="bg-green-100"
                textColor="text-green-600"
              />
            </Link>
            <Link href="/market">
              <FunctionButton
                icon={<ChartLine className="h-6 w-6" />}
                text="行情"
                bgColor="bg-purple-100"
                textColor="text-purple-600"
              />
            </Link>
            <Link href="/agent">
              <FunctionButton
                icon={<Users className="h-6 w-6" />}
                text="代理"
                bgColor="bg-yellow-100"
                textColor="text-yellow-600"
              />
            </Link>
            <Link href="/help/customer-service">
              <FunctionButton
                icon={<Headphones className="h-6 w-6" />}
                text="客服"
                bgColor="bg-teal-100"
                textColor="text-teal-600"
              />
            </Link>
          </div>
        </Card>

        {/* 热门行情 */}
        <Card className="mx-4 mt-4 p-4 rounded-lg shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">热门行情</h2>
            <div className="text-xs text-gray-500 flex items-center">
              查看全部 <ChevronRight className="h-3 w-3 ml-1" />
            </div>
          </div>

          <ScrollArea className="w-full" orientation="horizontal">
            <div className="flex space-x-3 pb-2 min-w-full">
              <MarketItem name="比特币 BTC" price="215,400" change="+2.5%" isUp={true} />
              <MarketItem name="以太坊 ETH" price="10,770" change="+1.8%" isUp={true} />
              <MarketItem name="黄金 XAU" price="1,876.50" change="-0.35%" isUp={false} />
              <MarketItem name="美元指数" price="92.65" change="-0.18%" isUp={false} />
            </div>
          </ScrollArea>
        </Card>

        {/* 财经资讯 */}
        <Card className="mx-4 mt-4 p-4 rounded-lg shadow-sm bg-white">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">财经资讯</h2>
            <Link href="/news" className="text-xs text-gray-500 flex items-center hover:text-blue-600">
              查看全部 <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            <Link href="/news/1">
              <NewsItem
                image="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=100&q=80"
                title="央行发布最新货币政策报告，下半年经济有望稳步增长"
                source="财经头条"
                time="2小时前"
              />
            </Link>
            <Link href="/news/2">
              <NewsItem
                image="https://images.unsplash.com/photo-1607921072916-f83192dba91c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=100&q=80"
                title="美联储暗示年内或将降息，全球市场迎来利好"
                source="国际财经"
                time="4小时前"
              />
            </Link>
            <Link href="/news/3">
              <NewsItem
                image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=100&q=80"
                title="数字经济新政出台，科技股有望迎来新一轮上涨"
                source="政策解读"
                time="6小时前"
              />
            </Link>
          </div>
        </Card>

        {/* 最近交易 */}
        <Card className="mx-4 mt-4 mb-4 p-4 rounded-lg shadow-sm bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">最近交易</h2>
            <div className="text-xs text-gray-500 flex items-center">
              查看全部 <ChevronRight className="h-3 w-3 ml-1" />
            </div>
          </div>

          <div className="text-center text-gray-500 py-6">暂无交易记录</div>
        </Card>

        {/* 底部标签栏 */}
        <BottomNav />
      </div>
    </PageBackground>
  )
}

// 修改功能按钮组件，使其更大并与背景区分更明显
function FunctionButton({ icon, text, bgColor, textColor }) {
  return (
    <div className="flex flex-col items-center">
      <div className={`w-16 h-16 rounded-full ${bgColor} ${textColor} flex items-center justify-center mb-2 shadow-sm`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-700">{text}</span>
    </div>
  )
}

// 修改市场行情项组件，添加蓝灰色底纹
function MarketItem({ name, price, change, isUp }) {
  return (
    <div className="min-w-[140px] bg-gray-50/85 backdrop-blur-sm rounded-lg p-3 bg-blue-gray-100/15">
      <div className="text-sm font-medium mb-2">{name}</div>
      <div className="text-base font-semibold mb-1">¥ {price}</div>
      <div className={`text-sm font-medium ${isUp ? "text-green-500" : "text-red-500"}`}>{change}</div>
    </div>
  )
}

// 新闻项组件
function NewsItem({ image, title, source, time }) {
  return (
    <div className="flex border-b border-gray-100 pb-4 last:border-0 last:pb-0 hover:bg-gray-50 transition-colors p-2 rounded-md">
      <img src={image || "/placeholder.svg"} alt={title} className="w-20 h-[60px] rounded object-cover mr-3" />
      <div className="flex flex-col justify-between">
        <h3 className="text-sm font-medium leading-tight">{title}</h3>
        <div className="text-xs text-gray-500">
          {source} · {time}
        </div>
      </div>
    </div>
  )
}

