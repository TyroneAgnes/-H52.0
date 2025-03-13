"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Info, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import Header from "@/components/header"
import { toast } from "@/hooks/use-toast"
import { useRouter, useSearchParams } from "next/navigation"

export default function InvestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mentorId = searchParams.get("mentor")

  const [amount, setAmount] = useState(50000)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mentor, setMentor] = useState(null)
  const [loading, setLoading] = useState(true)

  // 预设金额选项
  const presetAmounts = [50000, 100000, 200000, 500000, 1000000]

  useEffect(() => {
    // 模拟API请求获取导师信息
    const fetchMentor = () => {
      setLoading(true)

      // 模拟延迟
      setTimeout(() => {
        // 模拟导师数据
        setMentor({
          id: 1,
          name: "陈维德",
          avatar:
            "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150&q=80",
          title: "资深金融分析师",
          performance: {
            daily: 2.8,
            weekly: 12.5,
            monthly: 38.2,
            yearly: 156.7,
            fiveDayAvg: 3.8,
          },
          minInvestment: 50000,
          maxInvestment: 5000000,
          managementFee: 0.15, // 15%
          platformFee: 0.05, // 5%
        })

        setLoading(false)
      }, 500)
    }

    fetchMentor()
  }, [mentorId])

  // 处理金额变化
  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^\d]/g, "")
    if (value === "") {
      setAmount(0)
    } else {
      const numValue = Number.parseInt(value, 10)
      if (numValue >= mentor?.minInvestment && numValue <= mentor?.maxInvestment) {
        setAmount(numValue)
      }
    }
  }

  // 处理滑块变化
  const handleSliderChange = (value) => {
    setAmount(value[0])
  }

  // 处理预设金额点击
  const handlePresetClick = (value) => {
    setAmount(value)
  }

  // 计算预期收益
  const calculateExpectedReturn = () => {
    if (!mentor) return { daily: 0, monthly: 0, yearly: 0 }

    const dailyReturn = amount * (mentor.performance.daily / 100)
    const monthlyReturn = amount * (mentor.performance.monthly / 100)
    const yearlyReturn = amount * (mentor.performance.yearly / 100)

    return {
      daily: dailyReturn,
      monthly: monthlyReturn,
      yearly: yearlyReturn,
    }
  }

  // 计算手续费
  const calculateFees = () => {
    if (!mentor) return { management: 0, platform: 0, total: 0 }

    const managementFee = amount * mentor.managementFee
    const platformFee = amount * mentor.platformFee

    return {
      management: managementFee,
      platform: platformFee,
      total: managementFee + platformFee,
    }
  }

  const expectedReturn = calculateExpectedReturn()
  const fees = calculateFees()

  // 提交投资
  const handleSubmit = () => {
    if (amount < mentor.minInvestment) {
      toast({
        title: "投资金额不足",
        description: `最低投资金额为¥${mentor.minInvestment.toLocaleString()}`,
        variant: "destructive",
      })
      return
    }

    if (amount > mentor.maxInvestment) {
      toast({
        title: "超出最大投资限额",
        description: `最大投资金额为¥${mentor.maxInvestment.toLocaleString()}`,
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // 模拟API请求
    setTimeout(() => {
      setIsSubmitting(false)

      toast({
        title: "投资成功",
        description: `您已成功投资¥${amount.toLocaleString()}到${mentor.name}导师的投资组合`,
        variant: "default",
      })

      // 重定向到交易页面
      router.push("/trade")
    }, 1500)
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header
          title="投资"
          centerTitle={true}
          showBell={true}
          showLogo={false}
          leftComponent={
            <Link href={`/star-invest/detail?id=${mentorId}`} className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
          }
        />
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header
          title="投资"
          centerTitle={true}
          showBell={true}
          showLogo={false}
          leftComponent={
            <Link href="/star-invest" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
          }
        />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
            <p className="text-gray-700">未找到导师信息</p>
            <Link href="/star-invest" className="text-sm text-blue-600 mt-3 inline-block">
              返回导师列表
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="投资"
        centerTitle={true}
        showBell={true}
        showLogo={false}
        leftComponent={
          <Link href={`/star-invest/detail?id=${mentorId}`} className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* 导师信息 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                <img
                  src={mentor.avatar || "/placeholder.svg"}
                  alt={mentor.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-semibold">{mentor.name}</h3>
                <p className="text-sm text-gray-600">{mentor.title}</p>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm font-medium text-green-600">+{mentor.performance.fiveDayAvg}%</div>
                <div className="text-xs text-gray-500">5日平均收益</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 投资金额 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">投资金额</h3>

            <div className="relative mb-4">
              <Input
                type="text"
                value={amount.toLocaleString()}
                onChange={handleAmountChange}
                className="pl-8 text-lg font-medium"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
            </div>

            <div className="mb-6">
              <Slider
                defaultValue={[amount]}
                min={mentor.minInvestment}
                max={mentor.maxInvestment}
                step={1000}
                value={[amount]}
                onValueChange={handleSliderChange}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>¥{mentor.minInvestment.toLocaleString()}</span>
                <span>¥{mentor.maxInvestment.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {presetAmounts.map((value) => (
                <Button
                  key={value}
                  variant={amount === value ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePresetClick(value)}
                  className="flex-1"
                >
                  ¥{value.toLocaleString()}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 预期收益 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">预期收益</h3>

            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">¥{expectedReturn.daily.toFixed(2)}</div>
                <div className="text-xs text-gray-500">日收益</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">¥{expectedReturn.monthly.toFixed(2)}</div>
                <div className="text-xs text-gray-500">月收益</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">¥{expectedReturn.yearly.toFixed(2)}</div>
                <div className="text-xs text-gray-500">年收益</div>
              </div>
            </div>

            <div className="flex items-center mt-3 bg-blue-50 p-2 rounded-lg text-xs text-blue-700">
              <Info className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span>收益数据基于历史表现，不代表未来收益，投资有风险</span>
            </div>
          </CardContent>
        </Card>

        {/* 费用说明 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">费用说明</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <div className="text-sm">导师管理费 ({(mentor.managementFee * 100).toFixed(0)}%)</div>
                <div className="text-sm font-medium">¥{fees.management.toFixed(2)}</div>
              </div>
              <div className="flex justify-between">
                <div className="text-sm">平台服务费 ({(mentor.platformFee * 100).toFixed(0)}%)</div>
                <div className="text-sm font-medium">¥{fees.platform.toFixed(2)}</div>
              </div>
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">总费用</div>
                  <div className="text-sm font-medium">¥{fees.total.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 风险提示 */}
        <div className="flex items-start p-3 bg-yellow-50 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-700">
            投资有风险，入市需谨慎。过往业绩不代表未来表现，投资者应根据自身风险承受能力选择适合的投资产品。
          </div>
        </div>

        {/* 提交按钮 */}
        <Button className="w-full h-12 text-base" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              处理中...
            </>
          ) : (
            <>确认投资 ¥{amount.toLocaleString()}</>
          )}
        </Button>
      </div>
    </div>
  )
}

