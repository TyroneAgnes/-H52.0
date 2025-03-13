"use client"

import { useState } from "react"
import { ArrowLeft, AlertCircle, ChevronLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Header from "@/components/header"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"

// 定义提现记录类型
interface WithdrawRecord {
  id: number
  type: string
  date: string
  amount: string
  status: "已完成" | "处理中" | "已拒绝"
}

export default function WithdrawPage() {
  const router = useRouter()
  const [selectedNetwork, setSelectedNetwork] = useState("USDT-TRC20")
  const [withdrawAddress, setWithdrawAddress] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [cnyAmount, setCnyAmount] = useState("")
  const [usdtAmount, setUsdtAmount] = useState("")

  // 从store获取用户数据
  const userInfo = useStore(state => state.userInfo)
  const getWithdrawableBalance = useStore(state => state.getWithdrawableBalance)
  
  // 获取可提现余额
  const availableBalance = getWithdrawableBalance()
  const exchangeRate = 7.4

  // 提现提示内容
  const withdrawTips = [
    "最小提现金额：10 USDT",
    "请仔细核对提现地址，错误的地址可能导致资产永久丢失，平台概不负责",
    "提现需要1-3个网络确认，请耐心等待",
    "因系统支付问题，提现扣除手续费后的小数点，会被系统抹除，只以整数下发。例如扣除手续费后100.1元，实际到账只有100元。"
  ]

  // 网络选项
  const networks = [
    { id: "trc20", name: "USDT-TRC20", icon: "https://cryptologos.cc/logos/tron-trx-logo.png" },
    { id: "erc20", name: "USDT-ERC20", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    { id: "bep20", name: "USDT-BEP20", icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
    { id: "polygon", name: "USDT-POLYGON", icon: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
    { id: "solana", name: "USDT-SOLANA", icon: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  ]

  // 提现记录
  const withdrawHistory: WithdrawRecord[] = [
    // 暂时设置为空数组，等待后续实际业务发生真实记录
  ]

  // 使用全部余额
  const useMaxBalance = () => {
    setWithdrawAmount(availableBalance.toFixed(2))
  }

  // 计算USDT数量
  const calculateUsdt = () => {
    const amount = parseFloat(cnyAmount)
    if (!cnyAmount || isNaN(amount) || amount <= 0) {
      toast({
        title: "请输入有效的人民币金额",
        variant: "destructive",
      })
      setUsdtAmount("")
      return
    }

    const calculatedUsdt = (amount / exchangeRate * 0.9).toFixed(2)
    setUsdtAmount(calculatedUsdt)
  }

  // 监听输入变化
  const handleCnyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setCnyAmount(value)
    if (!value) {
      setUsdtAmount("")
    }
  }

  // 提交提现
  const handleWithdraw = async () => {
    if (!userInfo) {
      toast({
        title: "请先登录",
        description: "请登录后再进行提现操作",
        variant: "destructive",
      })
      router.push('/login')
      return
    }

    if (!withdrawAddress) {
      toast({
        title: "请输入提现地址",
        description: "提现地址不能为空",
        variant: "destructive",
      })
      return
    }

    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      toast({
        title: "请输入有效的提现金额",
        description: "提现金额必须大于0",
        variant: "destructive",
      })
      return
    }

    const withdrawAmountNum = Number(withdrawAmount)
    if (withdrawAmountNum > availableBalance) {
      toast({
        title: "提现金额超过可用余额",
        description: `可用余额: ${availableBalance.toFixed(2)} USDT`,
        variant: "destructive",
      })
      return
    }

    if (withdrawAmountNum < 10) {
      toast({
        title: "最小提现金额为10 USDT",
        description: "请增加提现金额",
        variant: "destructive",
      })
      return
    }

    // 确认提现
    if (confirm("确认提现吗？提现后将无法撤销。")) {
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: '提现',
            amount: withdrawAmountNum,
            method: selectedNetwork,
            remark: `提现到地址: ${withdrawAddress}`
          }),
          credentials: 'include'
        })

        if (res.status === 401) {
          toast({
            title: "提交失败",
            description: "请先登录或重新登录",
            variant: "destructive",
          })
          router.push('/login')
          return
        }

        const data = await res.json()
        console.log('提现响应数据:', data)

        if (data.code === 0) {
          toast({
            title: "提现申请已提交",
            description: "请等待审核，审核通过后将自动到账",
          })
          // 清空表单
          setWithdrawAddress('')
          setWithdrawAmount('')
          // 可以在这里刷新提现记录
        } else {
          toast({
            title: "提现申请失败",
            description: data.message || "请稍后重试",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error('提交提现申请失败:', error)
        toast({
          title: "提现申请失败",
          description: "网络错误，请稍后重试",
          variant: "destructive",
        })
      }
    }
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="提现"
        centerTitle={true}
        showBell={false}
        showLogo={false}
        leftComponent={
          <button onClick={handleBack} className="p-2">
            <ChevronLeft className="h-5 w-5" />
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* 选择网络 */}
        <div className="font-medium">选择 USDT 网络</div>
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {networks.map((network) => (
                <div
                  key={network.id}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer ${
                    selectedNetwork === network.name ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white/60"
                  }`}
                  onClick={() => setSelectedNetwork(network.name)}
                >
                  <img src={network.icon || "/placeholder.svg"} alt={network.name} className="w-6 h-6 mr-2" />
                  <span className="text-sm font-medium">{network.name}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">可用余额</span>
              <span className="font-medium">{availableBalance?.toFixed(2) || "0.00"} USDT</span>
            </div>
          </CardContent>
        </Card>

        {/* USDT兑换比例 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="w-6 h-6 mr-2" />
                <span className="font-medium">今日USDT兑换比例</span>
              </div>
              <div className="text-xs text-gray-500">更新于 10:30</div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center p-2 border-r border-gray-100">
                <div className="text-xs text-gray-500 mb-1">USDT/CNY</div>
                <div className="font-semibold">{exchangeRate} ¥</div>
              </div>
              <div className="text-center p-2 border-r border-gray-100">
                <div className="text-xs text-gray-500 mb-1">USDT/USD</div>
                <div className="font-semibold">0.999 $</div>
              </div>
              <div className="text-center p-2">
                <div className="text-xs text-gray-500 mb-1">USDT/EUR</div>
                <div className="font-semibold">0.921 €</div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="text-sm font-medium mb-2">人民币兑换USDT计算</div>
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="输入人民币金额"
                    value={cnyAmount}
                    onChange={handleCnyChange}
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="text-gray-500">→</div>
                <div className="flex-1">
                  <Input 
                    type="text" 
                    placeholder="USDT数量" 
                    value={usdtAmount} 
                    readOnly 
                    className="bg-gray-50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  />
                </div>
                <Button size="sm" onClick={calculateUsdt}>
                  计算
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-right mt-2">数据来源: 欧意交易所</div>
          </CardContent>
        </Card>

        {/* 提现表单 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">提现地址</label>
                <Input
                  type="text"
                  placeholder={`请输入${selectedNetwork}提现地址`}
                  value={withdrawAddress}
                  onChange={(e) => setWithdrawAddress(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">提现数量</label>
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="请输入提现数量"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="pr-20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                    <Button variant="outline" size="sm" className="h-6 mr-1 text-xs" onClick={useMaxBalance}>
                      全部
                    </Button>
                    <span className="text-sm text-gray-500">USDT</span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
                <div className="flex items-center font-medium text-amber-800 mb-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  提现提示
                </div>
                <div className="text-sm text-amber-700 space-y-1">
                  {withdrawTips.map((tip, index) => (
                    <p key={index}>{index + 1}. {tip}</p>
                  ))}
                </div>
              </div>

              <Button className="w-full" onClick={handleWithdraw}>
                确认提现
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 提现记录 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium">提现记录</div>
              <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600">
                查看全部
              </Button>
            </div>

            <div className="space-y-3">
              {withdrawHistory.length > 0 ? (
                withdrawHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <div className="font-medium text-sm">{item.type}</div>
                      <div className="text-xs text-gray-500">{item.date}</div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-red-600 font-medium mr-2">-{item.amount} USDT</div>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          item.status === "已完成"
                            ? "bg-green-100 text-green-600"
                            : item.status === "处理中"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 mb-1">暂无提现记录</p>
                  <p className="text-xs text-gray-400">完成提现后记录将显示在这里</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}