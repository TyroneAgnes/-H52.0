"use client"

import { useState } from "react"
import { ChevronLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Header from "@/components/header"
import PageBackground from "@/components/page-background"
import { useStore } from "@/lib/store"
import { toast } from "@/hooks/use-toast"
import type { TradeRecord } from "@/lib/store"

export default function StarInvestTransferPage() {
  const router = useRouter()
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { userBalance, starWalletBalance, setUserBalance, setStarWalletBalance, addTradeRecord } = useStore()

  // 处理金额变化
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "")
    setAmount(value)
  }

  // 使用全部余额
  const useMaxBalance = () => {
    setAmount(userBalance.toString())
  }

  // 处理转入
  const handleTransfer = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "请输入有效的转入金额"
      })
      return
    }

    if (Number(amount) > userBalance) {
      toast({
        variant: "destructive",
        title: "错误",
        description: "转入金额不能超过可用余额"
      })
      return
    }

    setIsLoading(true)

    try {
      const investAmount = Number(amount)
      
      // 创建交易记录
      const newRecord: TradeRecord = {
        id: `${Date.now()}`,
        type: "buy",
        symbol: "星钱包-转入",
        price: 1,
        amount: investAmount,
        total: investAmount,
        status: "completed",
        createTime: new Date().toISOString()
      }

      // 更新余额
      setUserBalance(userBalance - investAmount)
      // 更新星钱包余额
      setStarWalletBalance(starWalletBalance + investAmount)
      // 添加交易记录
      addTradeRecord(newRecord)

      toast({
        title: "转入成功",
        description: `您已成功转入¥${investAmount.toLocaleString()}到星钱包`
      })

      // 转入成功后跳转到交易页
      router.push("/trade")
    } catch (error) {
      console.error("转入失败", error)
      toast({
        variant: "destructive",
        title: "转入失败",
        description: "请稍后再试"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header
          title="转入星钱包"
          leftComponent={
            <Link href="/trade">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
          }
        />

        <div className="flex-1 p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold">转入星钱包</h2>
              <p className="text-sm text-gray-500 mt-1">固定收益率，次日10:00自动结算</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="text-sm text-gray-500 mb-2">转入金额</div>
              <div className="relative">
                <Input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="请输入转入金额"
                  className="text-xl font-bold pl-8 h-14"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl font-bold">¥</span>
                <Button
                  variant="link"
                  size="sm"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 h-6 p-0"
                  onClick={useMaxBalance}
                >
                  全部
                </Button>
              </div>
              <div className="text-xs text-gray-500 mt-2">可用余额: ¥{userBalance.toLocaleString()}</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">预计收益(每日)</span>
                  <span className="text-sm font-medium text-green-600">
                    ¥{amount ? (Number(amount) * 0.012).toFixed(2) : "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">结算时间</span>
                  <span className="text-sm">次日10:00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">收益率</span>
                  <span className="text-sm text-green-600">1.2%/日</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700 mb-2">星钱包规则</h3>
              <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4">
                <li>每日24:00前手动转入，次日10:00结算收益</li>
                <li>结算后本金和收益自动转出到余额</li>
                <li>固定收益率1.2%/日</li>
                <li>如需连续获得收益，请每日手动转入</li>
              </ul>
            </div>

            <Button
              className="w-full h-12 text-base"
              onClick={handleTransfer}
              disabled={isLoading || !amount || Number(amount) <= 0 || Number(amount) > userBalance}
            >
              {isLoading ? (
                "处理中..."
              ) : (
                <>
                  确认转入 <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

