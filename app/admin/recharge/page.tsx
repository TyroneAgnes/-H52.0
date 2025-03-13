"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Transaction {
  id: string
  userId: string
  user: {
    username: string
    nickname?: string
  }
  type: "充值" | "提现"
  amount: number
  method: string
  status: "pending" | "approved" | "rejected"
  remark?: string
  createdAt: string
}

export default function RechargePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [reviewRemark, setReviewRemark] = useState("")
  const [loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("all")

  // 加载交易记录
  const loadTransactions = async () => {
    try {
      setLoading(true)
      console.log('开始加载交易记录...')
      
      const res = await fetch('/api/admin/transactions', {
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
      console.log('API返回数据:', data)
      
      if (data.code === 0) {
        // 格式化日期
        const formattedData = data.data.map((item: any) => ({
          ...item,
          createdAt: new Date(item.createdAt).toLocaleString()
        }))
        console.log('格式化后的交易记录:', formattedData)
        setTransactions(formattedData)
        toast.success(`已加载 ${formattedData.length} 条交易记录`)
      } else {
        toast.error(data.message || '加载失败')
      }
    } catch (error) {
      console.error('加载交易记录失败:', error)
      toast.error('加载失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  // 审核交易
  const handleReview = async (action: 'approved' | 'rejected') => {
    if (!selectedTransaction) return
    
    try {
      setLoading(true)
      const res = await fetch('/api/admin/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: selectedTransaction.id,
          status: action,
          remark: reviewRemark
        }),
        credentials: 'include'
      })
      
      if (res.status === 403) {
        toast.error('无权限操作，请确认您已正确登录管理员账号')
        return
      }
      
      const data = await res.json()
      
      if (data.code === 0) {
        toast.success('审核成功')
        loadTransactions()
      } else {
        toast.error(data.message || '审核失败')
      }
    } catch (error) {
      console.error('审核交易失败:', error)
      toast.error('审核失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadTransactions()
  }, [])

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-600"
      case "approved":
        return "text-green-600"
      case "rejected":
        return "text-red-600"
      default:
        return ""
    }
  }

  const getStatusText = (status: Transaction["status"]) => {
    switch (status) {
      case "pending":
        return "待审核"
      case "approved":
        return "已通过"
      case "rejected":
        return "已拒绝"
      default:
        return status
    }
  }

  const getAmountColor = (type: Transaction["type"]) => {
    return type === "充值" ? "text-green-600" : "text-red-600"
  }

  // 过滤交易记录
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      transaction.userId.toLowerCase().includes(searchKeyword.toLowerCase())
    
    const matchesMethod = paymentMethod === "all" || transaction.method === paymentMethod

    return matchesSearch && matchesMethod
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">充值提现管理</h2>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="recharge">充值记录</TabsTrigger>
          <TabsTrigger value="withdraw">提现记录</TabsTrigger>
          <TabsTrigger value="pending">待审核</TabsTrigger>
        </TabsList>

        {["all", "recharge", "withdraw", "pending"].map(tab => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {tab === "all" && "所有记录"}
                  {tab === "recharge" && "充值记录"}
                  {tab === "withdraw" && "提现记录"}
                  {tab === "pending" && "待审核记录"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <Input 
                    placeholder="搜索用户ID/用户名" 
                    className="max-w-xs"
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                  />
                  <Select 
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="支付方式" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">全部方式</SelectItem>
                      <SelectItem value="bank">银行转账</SelectItem>
                      <SelectItem value="usdt">USDT</SelectItem>
                      <SelectItem value="alipay">支付宝</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={() => loadTransactions()}>刷新</Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>用户</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>金额</TableHead>
                      <TableHead>支付方式</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>备注</TableHead>
                      <TableHead>时间</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions
                      .filter(t => {
                        if (tab === "recharge") return t.type === "充值"
                        if (tab === "withdraw") return t.type === "提现"
                        if (tab === "pending") return t.status === "pending"
                        return true
                      })
                      .map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell>{transaction.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{transaction.user.username}</span>
                              <span className="text-sm text-gray-500">{transaction.userId}</span>
                            </div>
                          </TableCell>
                          <TableCell>{transaction.type}</TableCell>
                          <TableCell>
                            <span className={getAmountColor(transaction.type)}>
                              {transaction.type === "充值" ? "+" : "-"}
                              ¥{transaction.amount.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>{transaction.method}</TableCell>
                          <TableCell>
                            <span className={getStatusColor(transaction.status)}>
                              {getStatusText(transaction.status)}
                            </span>
                          </TableCell>
                          <TableCell>{transaction.remark || "-"}</TableCell>
                          <TableCell>{transaction.createdAt}</TableCell>
                          <TableCell>
                            {transaction.status === "pending" ? (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => setSelectedTransaction(transaction)}
                                  >
                                    审核
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>审核{transaction.type}申请</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="grid gap-4">
                                      <div className="flex justify-between text-sm">
                                        <span>用户：{transaction.user.username}</span>
                                        <span>ID：{transaction.userId}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>金额：¥{transaction.amount.toLocaleString()}</span>
                                        <span>方式：{transaction.method}</span>
                                      </div>
                                      <div className="flex justify-between text-sm">
                                        <span>申请时间：{transaction.createdAt}</span>
                                      </div>
                                      {transaction.remark && (
                                        <div className="text-sm">
                                          <span>备注：{transaction.remark}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="space-y-2">
                                      <label>审核备注</label>
                                      <Input
                                        value={reviewRemark}
                                        onChange={e => setReviewRemark(e.target.value)}
                                        placeholder="请输入审核备注"
                                      />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                      <Button 
                                        variant="outline"
                                        onClick={() => handleReview("rejected")}
                                        disabled={loading}
                                      >
                                        拒绝
                                      </Button>
                                      <Button
                                        onClick={() => handleReview("approved")}
                                        disabled={loading}
                                      >
                                        通过
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            ) : (
                              <Button variant="outline" size="sm">查看</Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
} 