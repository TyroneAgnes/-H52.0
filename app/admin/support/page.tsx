"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

interface Reply {
  id: string
  content: string
  createdAt: string
  isStaff: boolean
}

interface Feedback {
  id: string
  userId: string
  username: string
  type: string
  content: string
  status: "pending" | "processing" | "resolved"
  createTime: string
  lastReplyTime: string
  replies: Reply[]
}

export default function SupportPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  // 加载反馈列表
  const loadFeedbacks = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/feedbacks', {
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
        setFeedbacks(data.data)
      } else {
        toast.error(data.message || '加载失败')
      }
    } catch (error) {
      console.error('加载反馈列表失败:', error)
      toast.error('加载失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  // 发送回复
  const handleSendReply = async () => {
    if (!selectedFeedback || !replyContent.trim()) return
    
    try {
      setLoading(true)
      const res = await fetch('/api/admin/feedbacks/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feedbackId: selectedFeedback.id,
          content: replyContent
        }),
        credentials: 'include'
      })
      
      if (res.status === 403) {
        toast.error('无权限操作，请确认您已正确登录管理员账号')
        return
      }
      
      const data = await res.json()
      
      if (data.code === 0) {
        toast.success('回复成功')
        setReplyContent("")
        loadFeedbacks()
      } else {
        toast.error(data.message || '回复失败')
      }
    } catch (error) {
      console.error('回复失败:', error)
      toast.error('回复失败，请检查网络连接')
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadFeedbacks()
  }, [])

  const getStatusColor = (status: Feedback["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-600"
      case "processing":
        return "text-blue-600"
      case "resolved":
        return "text-green-600"
      default:
        return ""
    }
  }

  const getStatusText = (status: Feedback["status"]) => {
    switch (status) {
      case "pending":
        return "待处理"
      case "processing":
        return "处理中"
      case "resolved":
        return "已解决"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">客服中心</h2>
        <Button onClick={() => loadFeedbacks()}>刷新</Button>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="pending">待处理</TabsTrigger>
          <TabsTrigger value="processing">处理中</TabsTrigger>
          <TabsTrigger value="resolved">已解决</TabsTrigger>
        </TabsList>

        {["all", "pending", "processing", "resolved"].map(tab => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {tab === "all" && "所有反馈"}
                  {tab === "pending" && "待处理反馈"}
                  {tab === "processing" && "处理中反馈"}
                  {tab === "resolved" && "已解决反馈"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>用户</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>内容</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>提交时间</TableHead>
                      <TableHead>最后回复</TableHead>
                      <TableHead>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedbacks
                      .filter(f => tab === "all" || f.status === tab)
                      .map(feedback => (
                        <TableRow key={feedback.id}>
                          <TableCell>{feedback.id}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{feedback.username}</span>
                              <span className="text-sm text-gray-500">{feedback.userId}</span>
                            </div>
                          </TableCell>
                          <TableCell>{feedback.type}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {feedback.content}
                          </TableCell>
                          <TableCell>
                            <span className={getStatusColor(feedback.status)}>
                              {getStatusText(feedback.status)}
                            </span>
                          </TableCell>
                          <TableCell>{feedback.createTime}</TableCell>
                          <TableCell>{feedback.lastReplyTime || "-"}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedFeedback(feedback)
                                setShowDialog(true)
                              }}
                            >
                              {feedback.status === "pending" ? "处理" : "查看"}
                            </Button>
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

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>反馈详情</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <div className="flex justify-between text-sm">
                  <span>用户：{selectedFeedback.username}</span>
                  <span>ID：{selectedFeedback.userId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>类型：{selectedFeedback.type}</span>
                  <span>状态：{getStatusText(selectedFeedback.status)}</span>
                </div>
                <div className="text-sm">
                  <span>提交时间：{selectedFeedback.createTime}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">问题描述：</div>
                <div className="text-sm bg-muted p-3 rounded-md">
                  {selectedFeedback.content}
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-medium">对话记录：</div>
                <ScrollArea className="h-[200px] border rounded-md p-3">
                  {selectedFeedback.replies.map((reply, index) => (
                    <div 
                      key={reply.id}
                      className={`mb-3 flex ${reply.isStaff ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] p-2 rounded-lg ${
                          reply.isStaff 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-muted'
                        }`}
                      >
                        <div className="text-sm">{reply.content}</div>
                        <div className="text-xs mt-1 opacity-70">{reply.createdAt}</div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>

              <div className="space-y-2">
                <Textarea
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  placeholder="请输入回复内容..."
                  className="min-h-[100px]"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                  >
                    关闭
                  </Button>
                  <Button
                    onClick={handleSendReply}
                    disabled={loading || !replyContent.trim()}
                  >
                    发送回复
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 