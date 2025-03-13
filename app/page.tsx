"use client"

import { useState, useEffect } from "react"
import { Bell, Plus, Minus, Star, LineChartIcon as ChartLine, Users, Headphones, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import PageBackground from "@/components/page-background"
import Header from "@/components/header"
import BottomNav from "@/components/bottom-nav"
import { useStore } from "@/lib/store"

export default function HomePage() {
  const { 
    userBalance,
    starWalletBalance,
    starInvestBalance,
    getYesterdayTotalProfit,
    getTopStocks,  // 假设从 store 中获取热门股票数据
    tradeRecords
  } = useStore()

  // 计算总资产
  const totalAssets = userBalance + starWalletBalance + starInvestBalance

  // 获取昨日总收益（星投+星钱包）
  const yesterdayProfit = getYesterdayTotalProfit()

  // 获取最近的10条交易记录
  const recentTransactions = tradeRecords
    .sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime())
    .slice(0, 10)

  // 格式化日期时间
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      date: date.toLocaleDateString('zh-CN'),
      time: date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }
  }

  // 热门股票数据
  const hotStocks = [
    {
      name: "腾讯控股",
      code: "00700",
      price: 368.40,
      change: 2.5,
      market: "港股"
    },
    {
      name: "阿里巴巴",
      code: "09988",
      price: 72.85,
      change: 1.8,
      market: "港股"
    },
    {
      name: "英伟达",
      code: "NVDA",
      price: 924.73,
      change: 5.2,
      market: "美股"
    },
    {
      name: "特斯拉",
      code: "TSLA",
      price: 175.21,
      change: 3.7,
      market: "美股"
    }
  ]

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen pb-14">
        {/* 使用Header组件 */}
        <Header title="首页" />

        {/* 账户资产 */}
        <Card className="mx-4 mt-4 p-4 rounded-lg shadow-sm bg-white/85 backdrop-blur-sm">
          <div className="text-sm text-gray-500 mb-2">账户总资产 (¥)</div>
          <div className="text-2xl font-bold mb-2">¥ {totalAssets.toLocaleString()}</div>
          <div className={`text-sm ${yesterdayProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            昨日收益 ¥ {yesterdayProfit >= 0 ? '+' : ''}{yesterdayProfit.toLocaleString()}
          </div>
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
        <Card className="mx-4 mt-4 p-5 rounded-lg shadow-sm bg-white/85 backdrop-blur-sm">
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

        {/* 投资 Banner */}
        <div className="mx-4 mt-4">
          <img 
            src="/images/banner.png" 
            alt="星辰投资" 
            className="w-full rounded-lg"
          />
        </div>

        {/* 热门行情 */}
        <Card className="mx-4 mt-4 p-4 rounded-lg shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">热门行情</h2>
            <Link href="/market" className="text-xs text-gray-500 flex items-center">
              查看全部 <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {hotStocks.map((stock, index) => (
              <div key={index} className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-sm font-medium mb-1">{stock.name}</div>
                <div className="text-xs text-gray-500 mb-2">{stock.market} {stock.code}</div>
                <div className="text-base font-bold">¥ {stock.price.toLocaleString()}</div>
                <div className={`text-sm font-medium ${stock.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {stock.change >= 0 ? "+" : ""}{stock.change}%
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 财经资讯 */}
        <Card className="mx-4 mt-4 p-4 rounded-lg shadow-sm bg-white/85 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">财经资讯</h2>
            <Link href="/news" className="text-xs text-gray-500 flex items-center hover:text-blue-600">
              查看全部 <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            <Link href="/news/1">
              <NewsItem
                image="/images/news/news-1.jpg"
                title="央行发布最新货币政策报告，下半年经济有望稳步增长"
                source="财经头条"
                time="2小时前"
              />
            </Link>
            <Link href="/news/3">
              <NewsItem
                image="/images/news/news-3.jpg"
                title="数字经济新政出台，科技股有望迎来新一轮上涨"
                source="政策解读"
                time="6小时前"
              />
            </Link>
            <Link href="/news/4">
              <NewsItem
                image="/images/news/news-4.jpg"
                title="全球芯片供应链重构，半导体行业迎来新机遇"
                source="科技财经"
                time="8小时前"
              />
            </Link>
            <Link href="/news/5">
              <NewsItem
                image="/images/news/news-5.jpg"
                title="新能源汽车销量持续攀升，相关概念股表现强劲"
                source="行业分析"
                time="10小时前"
              />
            </Link>
            <Link href="/news/6">
              <NewsItem
                image="/images/news/news-6.jpg"
                title="国际油价波动加剧，能源板块投资策略分析"
                source="投资参考"
                time="12小时前"
              />
            </Link>
          </div>
        </Card>

        {/* 最近交易 */}
        <Card className="mx-4 mt-4 mb-4 p-4 rounded-lg shadow-sm bg-gradient-to-br from-purple-50 to-pink-50 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold">最近交易</h2>
            <Link href="/trade" className="text-xs text-gray-500 flex items-center">
              查看全部 <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>

          {recentTransactions.length === 0 ? (
            <div className="text-center text-gray-500 py-6">暂无交易记录</div>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((item) => {
                const { date, time } = formatDateTime(item.createTime)
                return (
                  <div key={item.id} className="border border-gray-100 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          item.type === "buy" ? "bg-blue-100 text-blue-600" : 
                          item.type === "sell" ? "bg-orange-100 text-orange-600" :
                          item.type === "deposit" ? "bg-green-100 text-green-600" :
                          "bg-purple-100 text-purple-600"
                        }`}>
                          {item.type === "buy" ? "买入" : 
                           item.type === "sell" ? "卖出" :
                           item.type === "deposit" ? "充值" : "提现"}
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
          )}
        </Card>

        {/* 底部标签栏 */}
        <BottomNav />
      </div>
    </PageBackground>
  )
}

// 功能按钮组件
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

// 市场行情项组件
function MarketItem({ name, price, change, isUp }) {
  return (
    <div className="min-w-[140px] bg-gray-50 rounded-lg p-3">
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

