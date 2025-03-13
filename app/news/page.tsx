"use client"

import { useState } from "react"
import { ArrowLeft, Search, Filter, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import Header from "@/components/header"
import PageBackground from "@/components/page-background"

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  // 模拟新闻数据
  const newsData = [
    {
      id: 1,
      title: "央行发布最新货币政策报告，下半年经济有望稳步增长",
      image: "/images/news/news-1.jpg",
      source: "财经头条",
      time: "2小时前",
      category: "policy",
      premium: true,
      summary: "央行强调将继续实施稳健的货币政策，灵活适度，加大对实体经济的支持力度，保持流动性合理充裕。",
    },
    {
      id: 2,
      title: "美联储主席鲍威尔暗示年内或将降息，全球市场迎来利好",
      image:
        "https://images.unsplash.com/photo-1607921072916-f83192dba91c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=180&h=120&q=80",
      source: "国际财经",
      time: "4小时前",
      category: "global",
      premium: false,
      summary: "美联储主席鲍威尔在最新讲话中表示，如果通胀持续下降，年内可能会考虑降息，这一表态引发全球市场积极反应。",
    },
    {
      id: 3,
      title: "数字经济新政出台，科技股有望迎来新一轮上涨",
      image: "/images/news/news-3.jpg",
      source: "政策解读",
      time: "6小时前",
      category: "tech",
      premium: false,
      summary: "国家发改委等多部门联合发布数字经济发展新政策，加大对人工智能、大数据等领域的支持力度，科技股有望受益。",
    },
    {
      id: 4,
      title: "全球芯片供应链重构，半导体行业迎来新机遇",
      image: "/images/news/news-4.jpg",
      source: "科技财经",
      time: "8小时前",
      category: "tech",
      premium: false,
      summary: "全球芯片供应链正在经历重大变革，各国加大半导体产业投入，国产替代进程加速，相关企业迎来发展良机。",
    },
    {
      id: 5,
      title: "新能源汽车销量持续攀升，相关概念股表现强劲",
      image: "/images/news/news-5.jpg",
      source: "行业分析",
      time: "10小时前",
      category: "industry",
      premium: false,
      summary: "随着新能源汽车渗透率持续提升，产业链上下游企业纷纷加大投资力度，电池、芯片等核心零部件领域竞争加剧。",
    },
    {
      id: 6,
      title: "国际油价波动加剧，能源板块投资策略分析",
      image: "/images/news/news-6.jpg",
      source: "投资参考",
      time: "12小时前",
      category: "commodity",
      premium: true,
      summary: "受地缘政治风险和供需变化影响，国际油价波动加剧，能源板块投资机会与风险并存，建议关注具有核心竞争力的龙头企业。",
    },
    {
      id: 7,
      title: "上市公司一季度业绩普遍向好，消费板块表现亮眼",
      image:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=180&h=120&q=80",
      source: "市场分析",
      time: "14小时前",
      category: "market",
      premium: true,
      summary: "截至目前，已有超过60%的上市公司发布一季度业绩预告，整体呈现向好趋势，其中消费板块表现尤为亮眼。",
    },
    {
      id: 8,
      title: "房地产市场调控政策持续优化，一线城市成交量回暖",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=180&h=120&q=80",
      source: "房产动态",
      time: "16小时前",
      category: "property",
      premium: true,
      summary: "近期多地出台房地产市场支持政策，一线城市新房和二手房成交量环比上升，市场信心逐步恢复。",
    },
    {
      id: 9,
      title: "全球大宗商品价格波动加剧，黄金创历史新高",
      image:
        "https://images.unsplash.com/photo-1589758438368-0ad531db3366?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=180&h=120&q=80",
      source: "商品市场",
      time: "18小时前",
      category: "commodity",
      premium: false,
      summary: "受地缘政治风险和通胀预期影响，全球大宗商品价格波动加剧，黄金价格突破历史高点，原油价格也有所上涨。",
    },
    {
      id: 10,
      title: "银行业一季度净利润增长稳健，不良贷款率小幅下降",
      image:
        "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=180&h=120&q=80",
      source: "金融监管",
      time: "20小时前",
      category: "finance",
      premium: false,
      summary: "银监会数据显示，一季度银行业整体经营稳健，净利润同比增长5.8%，不良贷款率较上年末下降0.05个百分点。",
    },
  ]

  // 过滤新闻
  const filteredNews = newsData.filter((news) => {
    // 根据搜索词过滤
    const matchesSearch =
      news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      news.summary.toLowerCase().includes(searchQuery.toLowerCase())

    // 根据分类过滤
    const matchesCategory = activeCategory === "all" || news.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 relative">
      {/* 添加背景组件 */}
      <PageBackground />

      <Header
        title="财经资讯"
        centerTitle={true}
        showBell={false}
        showLogo={false}
        leftComponent={
          <Link href="/" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
      />

      {/* 搜索区域 */}
      <div className="px-4 py-4 bg-white border-b border-gray-200 relative z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="搜索资讯..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 分类标签 */}
      <div className="px-4 py-3 bg-white border-b border-gray-200 overflow-x-auto relative z-10">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
          <TabsList className="inline-flex h-9 items-center justify-start rounded-none bg-transparent p-0 w-auto">
            <TabsTrigger
              value="all"
              className="rounded-full px-3 py-1 h-auto data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              全部
            </TabsTrigger>
            <TabsTrigger
              value="policy"
              className="rounded-full px-3 py-1 h-auto data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              政策
            </TabsTrigger>
            <TabsTrigger
              value="market"
              className="rounded-full px-3 py-1 h-auto data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              市场
            </TabsTrigger>
            <TabsTrigger
              value="global"
              className="rounded-full px-3 py-1 h-auto data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              国际
            </TabsTrigger>
            <TabsTrigger
              value="tech"
              className="rounded-full px-3 py-1 h-auto data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              科技
            </TabsTrigger>
            <TabsTrigger
              value="finance"
              className="rounded-full px-3 py-1 h-auto data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              金融
            </TabsTrigger>
            <TabsTrigger
              value="property"
              className="rounded-full px-3 py-1 h-auto data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              房产
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* 筛选工具栏 */}
      <div className="px-4 py-2 bg-white border-b border-gray-200 flex justify-end space-x-2 relative z-10">
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          <Filter className="h-3.5 w-3.5 mr-1" />
          筛选
        </Button>
        <Button variant="ghost" size="sm" className="h-8 text-xs">
          <Calendar className="h-3.5 w-3.5 mr-1" />
          时间
        </Button>
      </div>

      {/* 新闻列表 */}
      <div className="px-4 py-4 flex-1 relative z-10">
        <div className="space-y-4">
          {filteredNews.length > 0 ? (
            filteredNews.map((news) => (
              <Link key={news.id} href={`/news/${news.id}`}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex">
                        <div className="flex-1 pr-3">
                          <h3 className="font-medium text-base mb-2">{news.title}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{news.summary}</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{news.source}</span>
                            <span className="mx-1">•</span>
                            <span>{news.time}</span>
                            {news.premium && (
                              <span className="ml-2 px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded">精选</span>
                            )}
                          </div>
                        </div>
                        <div className="w-24 h-24 flex-shrink-0">
                          <img
                            src={news.image || "/placeholder.svg"}
                            alt={news.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <p className="text-gray-500">没有找到相关资讯</p>
              <p className="text-sm text-gray-400 mt-1">请尝试其他关键词</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

