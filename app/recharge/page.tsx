"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Copy, AlertCircle, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Header from "@/components/header"
import { toast } from "@/hooks/use-toast"

// 定义充值记录类型
interface RechargeRecord {
  id: string
  type: string
  amount: number
  method: string
  status: string
  remark: string | null
  createdAt: string
}

export default function RechargePage() {
  const [selectedNetwork, setSelectedNetwork] = useState("USDT-TRC20")
  const [rechargeAmount, setRechargeAmount] = useState("")
  const [cnyAmount, setCnyAmount] = useState("")
  const [usdtAmount, setUsdtAmount] = useState("")
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [rechargeHistory, setRechargeHistory] = useState<RechargeRecord[]>([])

  // 钱包地址
  const walletAddress = "TPjoRCVvDLqfKyMdKccAMoxvGMBinCpNtm"

  // 汇率
  const exchangeRate = 7.4

  // 网络选项
  const networks = [
    { id: "trc20", name: "USDT-TRC20", icon: "https://cryptologos.cc/logos/tron-trx-logo.png" },
    { id: "erc20", name: "USDT-ERC20", icon: "https://cryptologos.cc/logos/ethereum-eth-logo.png" },
    { id: "bep20", name: "USDT-BEP20", icon: "https://cryptologos.cc/logos/bnb-bnb-logo.png" },
    { id: "polygon", name: "USDT-POLYGON", icon: "https://cryptologos.cc/logos/polygon-matic-logo.png" },
    { id: "solana", name: "USDT-SOLANA", icon: "https://cryptologos.cc/logos/solana-sol-logo.png" },
  ]

  // 加载充值记录
  const loadRechargeHistory = async () => {
    try {
      console.log('开始加载充值记录...')
      toast({
        title: "正在加载充值记录...",
        description: "请稍候",
      })
      
      const res = await fetch('/api/transactions?type=充值', {
        method: 'GET', 
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      if (res.status === 401) {
        toast({
          title: "获取充值记录失败",
          description: "请先登录或重新登录",
          variant: "destructive",
        })
        // 仅记录错误，不立即跳转，避免用户体验问题
        console.error('充值记录获取失败: 身份验证问题')
        return
      }
      
      const data = await res.json()
      console.log('充值记录API返回数据:', data)
      
      if (data.code === 0) {
        const formattedRecords = data.data.map((record: any) => ({
          ...record,
          createdAt: new Date(record.createdAt).toLocaleString()
        }))
        console.log('格式化后的充值记录:', formattedRecords)
        setRechargeHistory(formattedRecords)
        
        toast({
          title: `已加载 ${formattedRecords.length} 条充值记录`,
          description: formattedRecords.length > 0 ? "刷新成功" : "暂无充值记录",
        })
      } else {
        console.error('加载充值记录失败:', data.message)
        toast({
          title: "获取充值记录失败",
          description: data.message || "请稍后重试",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('加载充值记录失败:', error)
      toast({
        title: "获取充值记录失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  // 初始加载
  useEffect(() => {
    loadRechargeHistory()
  }, [])

  // 获取状态文本和颜色
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: '待审核', color: 'text-yellow-600' }
      case 'approved':
        return { text: '已完成', color: 'text-green-600' }
      case 'rejected':
        return { text: '已拒绝', color: 'text-red-600' }
      default:
        return { text: status, color: 'text-gray-600' }
    }
  }

  // 复制文本
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setIsCopied(true)
    toast({
      title: "复制成功",
      description: "内容已复制到剪贴板",
    })

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  // 计算USDT数量
  const calculateUsdt = () => {
    if (!cnyAmount || isNaN(Number(cnyAmount))) {
      toast({
        title: "请输入有效的人民币金额",
        variant: "destructive",
      })
      return
    }

    const calculatedUsdt = (Number(cnyAmount) / exchangeRate).toFixed(2)
    setUsdtAmount(calculatedUsdt)
  }

  // 处理图片上传
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // 提交充值凭证
  const handleSubmitRecharge = async () => {
    if (!rechargeAmount) {
      toast({
        title: "请输入充值金额",
        variant: "destructive",
      })
      return
    }

    if (!uploadedImage) {
      toast({
        title: "请上传充值成功截图",
        variant: "destructive",
      })
      return
    }

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: '充值',
          amount: Number(rechargeAmount),
          method: selectedNetwork,
          proof: uploadedImage
        }),
        credentials: 'include'
      })

      if (res.status === 401) {
        toast({
          title: "提交失败",
          description: "请先登录或重新登录",
          variant: "destructive",
        })
        window.location.href = '/login'
        return
      }

      const data = await res.json()
      console.log('响应数据:', data)

      if (data.code === 0) {
        toast({
          title: "提交成功",
          description: "充值申请已提交，请等待审核",
        })
        // 清空表单
        setRechargeAmount('')
        setUploadedImage('')
        // 刷新充值记录列表
        loadRechargeHistory()
      } else {
        toast({
          title: "提交失败",
          description: data.message || "请稍后重试",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('提交充值申请失败:', error)
      toast({
        title: "提交失败",
        description: "网络错误，请稍后重试",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="充值"
        centerTitle={true}
        showBell={false}
        showLogo={false}
        leftComponent={
          <Link href="/profile" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* 选择网络 */}
        <div className="font-medium">选择 USDT 网络</div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
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
          </CardContent>
        </Card>

        {/* USDT兑换比例 */}
        <Card className="border-0 shadow-sm">
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
                    onChange={(e) => setCnyAmount(e.target.value)}
                  />
                </div>
                <div className="text-gray-500">→</div>
                <div className="flex-1">
                  <Input type="number" placeholder="USDT数量" value={usdtAmount} readOnly className="bg-gray-50" />
                </div>
                <Button size="sm" onClick={calculateUsdt}>
                  计算
                </Button>
              </div>
            </div>

            <div className="text-xs text-gray-500 text-right mt-2">数据来源: 欧意交易所</div>
          </CardContent>
        </Card>

        {/* 钱包地址 */}
        <div className="font-medium">{selectedNetwork} 充值地址</div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative bg-gray-50 p-3 rounded-lg mb-4 break-all font-mono text-sm">
              {walletAddress}
              <Button
                variant="outline"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 text-xs"
                onClick={() => copyToClipboard(walletAddress)}
              >
                {isCopied ? <CheckCircle className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {isCopied ? "已复制" : "复制"}
              </Button>
            </div>

            <div className="flex justify-center mb-4">
              <div className="w-48 h-48 bg-white/60 p-2 border border-gray-200 rounded-lg">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${walletAddress}`}
                  alt="USDT 钱包地址二维码"
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-lg">
              <div className="flex items-center font-medium text-amber-800 mb-2">
                <AlertCircle className="h-4 w-4 mr-2" />
                充值提示
              </div>
              <div className="text-sm text-amber-700 space-y-1">
                <p>1. 请确保充值网络正确，仅支持 {selectedNetwork} 网络充值。</p>
                <p>2. 最小充值金额：10 USDT，小于最小金额的充值将不会被处理。</p>
                <p>3. 充值需要网络确认，一般 1-3 个确认后到账。</p>
                <p>4. 请勿向上述地址充值任何非 USDT 资产，否则资产将不可找回。</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 提交充值凭证 */}
        <div className="font-medium">提交充值凭证</div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">充值金额 (USDT)</label>
                <Input
                  type="number"
                  placeholder="请输入您已充值的USDT金额"
                  value={rechargeAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setRechargeAmount(value);
                    // 计算人民币金额
                    if (value && !isNaN(Number(value))) {
                      const cnyValue = (Number(value) * 7.4).toFixed(2);
                      setCnyAmount(cnyValue);
                    } else {
                      setCnyAmount('');
                    }
                  }}
                />
                {rechargeAmount && !isNaN(Number(rechargeAmount)) && (
                  <div className="mt-1 text-sm text-gray-600">
                    预计到账：¥{(Number(rechargeAmount) * 7.4).toFixed(2)} CNY
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">充值截图</label>
                <div className="mt-1">
                  <input
                    type="file"
                    id="screenshotUpload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {!uploadedImage ? (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500"
                      onClick={() => document.getElementById("screenshotUpload")?.click()}
                    >
                      <div className="text-gray-500">
                        <div className="flex justify-center mb-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-10 w-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <p>上传充值成功截图</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={uploadedImage || "/placeholder.svg"}
                        alt="充值截图"
                        className="max-h-48 mx-auto rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-7 w-7 p-0 rounded-full"
                          onClick={() => setUploadedImage(null)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </Button>
                      </div>
                      <div className="text-center mt-2 text-sm text-green-600">
                        <CheckCircle className="h-4 w-4 inline mr-1" />
                        已上传截图
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Button className="w-full" onClick={handleSubmitRecharge}>
                提交充值凭证
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 充值记录 */}
        <div className="font-medium mt-4 flex justify-between items-center">
          <span>充值记录</span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadRechargeHistory}
            className="text-xs"
          >
            刷新记录
          </Button>
        </div>
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            {rechargeHistory.length > 0 ? (
              <div className="space-y-4">
                {rechargeHistory.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="text-sm font-medium">
                        {record.method} 充值
                      </div>
                      <div className="text-xs text-gray-500">
                        {record.createdAt}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {record.amount.toLocaleString()} USDT
                        <div className="text-sm text-gray-600">
                          ≈ ¥{(record.amount * 7.4).toLocaleString()} CNY
                        </div>
                      </div>
                      <div className={`text-xs ${getStatusInfo(record.status).color}`}>
                        {getStatusInfo(record.status).text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                暂无充值记录
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
