"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  Star, 
  ArrowUpRight, 
  ArrowDownRight,
  Loader
} from "lucide-react"
import { toast } from "sonner"

// 定义仪表盘数据类型
interface DashboardData {
  totalUsers: number
  newUsersToday: number
  totalRecharge: number
  rechargeToday: number
  totalWithdraw: number
  withdrawToday: number
  totalMentors: number
  activeMentors: number
  pendingRecharges: number
  pendingWithdraws: number
  userGrowth: Array<{date: string, value: number}>
  rechargeData: Array<{date: string, value: number}>
}

// 默认空数据
const emptyDashboardData: DashboardData = {
  totalUsers: 0,
  newUsersToday: 0,
  totalRecharge: 0,
  rechargeToday: 0,
  totalWithdraw: 0,
  withdrawToday: 0,
  totalMentors: 0,
  activeMentors: 0,
  pendingRecharges: 0,
  pendingWithdraws: 0,
  userGrowth: [],
  rechargeData: []
}

function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType 
}: { 
  title: string
  value: string | number
  icon: React.ReactNode
  change?: string | number
  changeType?: 'increase' | 'decrease'
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
        <div className="p-2 bg-gray-100 rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center mt-1 text-xs">
            {changeType === 'increase' ? (
              <ArrowUpRight className="w-3 h-3 mr-1 text-green-500" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-1 text-red-500" />
            )}
            <span className={changeType === 'increase' ? 'text-green-500' : 'text-red-500'}>
              {change}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SimpleChart({ data, height = "160px" }: { data: any[]; height?: string }) {
  // 如果没有数据，显示空状态
  if (!data || data.length === 0) {
    return (
      <div style={{ height }} className="w-full flex items-center justify-center text-gray-400">
        暂无数据
      </div>
    )
  }
  
  // 简单的SVG折线图
  const maxValue = Math.max(...data.map(item => item.value))
  const minValue = Math.min(...data.map(item => item.value))
  const range = maxValue - minValue || 1 // 避免除以零
  
  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((item.value - minValue) / range) * 80
    return `${x},${y}`
  }).join(' ')

  return (
    <div style={{ height }} className="w-full">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(37, 99, 235, 0.2)" />
            <stop offset="100%" stopColor="rgba(37, 99, 235, 0)" />
          </linearGradient>
        </defs>

        {/* 网格线 */}
        <g className="grid-lines" stroke="rgba(0,0,0,0.1)" strokeDasharray="0.5,1">
          <line x1="0" y1="20" x2="100" y2="20" />
          <line x1="0" y1="40" x2="100" y2="40" />
          <line x1="0" y1="60" x2="100" y2="60" />
          <line x1="0" y1="80" x2="100" y2="80" />
        </g>

        {/* 折线 */}
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          points={points}
        />

        {/* 折线下方区域 */}
        <polygon
          fill="url(#gradient)"
          points={`${points} 100,100 0,100`}
        />
      </svg>
    </div>
  )
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(emptyDashboardData)
  const [loading, setLoading] = useState(true)
  
  // 加载仪表盘数据
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/dashboard', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      if (res.status === 403) {
        toast.error('无权限访问，请确认您已正确登录管理员账号')
        return
      }
      
      const data = await res.json()
      
      if (data.code === 0) {
        setDashboardData(data.data)
      } else {
        toast.error(data.message || '加载仪表盘数据失败')
      }
    } catch (error) {
      console.error('加载仪表盘数据失败:', error)
      toast.error('加载失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }
  
  // 初始加载
  useEffect(() => {
    loadDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <button 
          className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
          onClick={() => loadDashboardData()}
        >
          刷新数据
        </button>
      </div>
      
      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="总用户数" 
          value={dashboardData.totalUsers} 
          icon={<Users size={18} />} 
          change={`+${dashboardData.newUsersToday} 今日`}
          changeType="increase"
        />
        <StatCard 
          title="总充值金额" 
          value={`¥${(dashboardData.totalRecharge / 10000).toFixed(1)}万`} 
          icon={<CreditCard size={18} />} 
          change={`+¥${(dashboardData.rechargeToday / 10000).toFixed(1)}万 今日`}
          changeType="increase"
        />
        <StatCard 
          title="总提现金额" 
          value={`¥${(dashboardData.totalWithdraw / 10000).toFixed(1)}万`} 
          icon={<TrendingUp size={18} />} 
          change={`+¥${(dashboardData.withdrawToday / 10000).toFixed(1)}万 今日`}
          changeType="increase"
        />
        <StatCard 
          title="导师数量" 
          value={dashboardData.totalMentors} 
          icon={<Star size={18} />} 
          change={`${dashboardData.activeMentors} 活跃`}
          changeType="increase"
        />
      </div>

      {/* 待处理事项 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>待处理充值</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{dashboardData.pendingRecharges}</div>
            <p className="mt-2 text-sm text-gray-500">
              有 {dashboardData.pendingRecharges} 笔充值申请等待审核
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>待处理提现</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{dashboardData.pendingWithdraws}</div>
            <p className="mt-2 text-sm text-gray-500">
              有 {dashboardData.pendingWithdraws} 笔提现申请等待处理
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 图表 */}
      <Tabs defaultValue="users">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">用户增长</TabsTrigger>
          <TabsTrigger value="recharge">充值趋势</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>用户增长趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleChart data={dashboardData.userGrowth} height="250px" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recharge">
          <Card>
            <CardHeader>
              <CardTitle>充值金额趋势</CardTitle>
            </CardHeader>
            <CardContent>
              <SimpleChart data={dashboardData.rechargeData} height="250px" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 