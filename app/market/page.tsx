"use client"

import { useState, useEffect } from "react"
import { Search, MoreHorizontal, TrendingUp, DollarSign, BarChart2, Sunrise } from "lucide-react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import Header from "@/components/header"
import PageBackground from "@/components/page-background"
import BottomNav from "@/components/bottom-nav"
import { MarketData, MarketIndex } from "@/lib/store"

// 定义标签类型
type TabType = "港股" | "美股" | "期货" | "日股"
const tabTypes: TabType[] = ["港股", "美股", "期货", "日股"]

// 添加组件类型定义
interface RecommendationCardProps {
  title: string
  value: string
  change: string
  percentage: string
  isPositive: boolean
  windowWidth: number
}

interface MarketSectionProps {
  title: string
  items: MarketData[]
  windowWidth: number
  className?: string
}

export default function MarketPage() {
  const [activeTab, setActiveTab] = useState<TabType>("港股")
  const [windowWidth, setWindowWidth] = useState(0)
  const [marketData, setMarketData] = useState<{
    indices: MarketIndex[]
    sectors: Record<string, MarketData[]>
  }>({
    indices: [],
    sectors: {}
  })
  const [isLoading, setIsLoading] = useState(true)

  // 监听窗口大小变化
  useEffect(() => {
    setWindowWidth(window.innerWidth)
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // 获取市场数据
  const fetchMarketData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/market?market=${activeTab}`)
      const result = await response.json()
      if (result.code === 0) {
        setMarketData(result.data)
      }
    } catch (error) {
      console.error("获取市场数据失败:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 定时刷新数据
  useEffect(() => {
    fetchMarketData()
    const timer = setInterval(fetchMarketData, 5000) // 每5秒更新一次
    return () => clearInterval(timer)
  }, [activeTab])

  // 获取标签对应的图标
  const getTabIcon = (tab: TabType) => {
    switch (tab) {
      case "港股":
        return <TrendingUp className="h-3 w-3 mr-1" />
      case "美股":
        return <DollarSign className="h-3 w-3 mr-1" />
      case "期货":
        return <BarChart2 className="h-3 w-3 mr-1" />
      case "日股":
        return <Sunrise className="h-3 w-3 mr-1" />
      default:
        return null
    }
  }

  return (
    <PageBackground>
      <div className="flex flex-col h-screen w-full mx-auto px-0 pb-14">
        <Header title="星辰资本" rightComponent={<Search className="h-4 w-4" />} />

        {/* Tabs */}
        <div className="mt-3 mb-3">
          <div className="flex w-full">
            {tabTypes.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-center py-2 px-2 text-xs flex-1 transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white text-primary font-medium border-b-2 border-primary"
                    : "text-gray-600 hover:bg-gray-100 bg-gray-50 border-b border-gray-200"
                }`}
              >
                {getTabIcon(tab)}
                {tab}
              </button>
            ))}
            <button className="flex items-center justify-center py-2 px-2 text-xs bg-gray-50 text-gray-600 hover:bg-gray-100 w-12 border-b border-gray-200">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <ScrollArea className="flex-1">
          <div className="px-2 py-1 space-y-4">
            {/* 指数卡片 */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {marketData.indices.map((index, i) => (
                <RecommendationCard
                  key={i}
                  title={index.title}
                  value={index.value.toFixed(2)}
                  change={index.change.toFixed(2)}
                  percentage={index.changePercent.toFixed(2) + "%"}
                  isPositive={index.isPositive}
                  windowWidth={windowWidth}
                />
              ))}
            </div>

            {/* 市场板块 */}
            {Object.entries(marketData.sectors).map(([sectorName, stocks], index) => (
              <MarketSection
                key={sectorName}
                title={sectorName}
                items={stocks}
                windowWidth={windowWidth}
                className={index > 0 ? "mt-4" : ""}
              />
            ))}
          </div>
        </ScrollArea>

        <BottomNav />
      </div>
    </PageBackground>
  )
}

// 推荐卡片组件
function RecommendationCard({ title, value, change, percentage, isPositive, windowWidth }: RecommendationCardProps) {
  return (
    <Card className="p-2">
      <div className="text-xs font-medium mb-1 truncate">{title}</div>
      <div className="text-sm font-semibold mb-1">{value}</div>
      <div className={`text-xs ${isPositive ? "text-red-500" : "text-green-500"}`}>
        {change} ({percentage})
      </div>
    </Card>
  )
}

// 市场板块组件
function MarketSection({ title, items, windowWidth, className = "" }: MarketSectionProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center mr-1">
            <span className="text-xs">•</span>
          </div>
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
      </div>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between py-1">
            <div className="flex flex-col w-[35%]">
              <span className="text-sm font-light truncate leading-none font-sans">{item.name}</span>
              <span className="text-xs text-muted-foreground leading-none mt-1">{item.symbol}</span>
            </div>
            <div className="text-right w-[30%]">
              <span className="text-sm font-medium leading-none">{item.price.toFixed(2)}</span>
              <span
                className={`text-xs block leading-none mt-1 ${item.isPositive ? "text-red-500" : "text-green-500"}`}
              >
                {item.change.toFixed(2)}
              </span>
            </div>
            <div
              className={`px-2 py-1 rounded-sm ${item.isPositive ? "bg-red-500" : "bg-green-500"} text-white text-xs w-[25%] text-center`}
            >
              {item.changePercent.toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

