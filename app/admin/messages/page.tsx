"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Message {
  id: number
  title: string
  content: string
  type: string
  recipients: string
  status: string
  createTime: string
}

export default function MessagesPage() {
  const [messages] = useState<Message[]>([
    {
      id: 1,
      title: "系统维护通知",
      content: "系统将于今晚22:00-23:00进行例行维护",
      type: "系统通知",
      recipients: "全部用户",
      status: "已发送",
      createTime: "2024-03-20 15:00"
    },
    {
      id: 2,
      title: "新功能上线通知",
      content: "星投功能全新升级，新增收益分析",
      type: "功能通知",
      recipients: "星投用户",
      status: "待发送",
      createTime: "2024-03-20 16:00"
    }
  ])

  const [newMessage, setNewMessage] = useState({
    title: "",
    content: "",
    type: "系统通知",
    recipients: "全部用户"
  })

  const handleSendMessage = () => {
    console.log("发送新消息", newMessage)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">消息中心</h2>
      </div>

      <Tabs defaultValue="messages" className="space-y-4">
        <TabsList>
          <TabsTrigger value="messages">消息列表</TabsTrigger>
          <TabsTrigger value="new">发送消息</TabsTrigger>
          <TabsTrigger value="settings">通知设置</TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>消息列表</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>标题</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>接收对象</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map(message => (
                    <TableRow key={message.id}>
                      <TableCell>{message.id}</TableCell>
                      <TableCell>{message.title}</TableCell>
                      <TableCell>{message.type}</TableCell>
                      <TableCell>{message.recipients}</TableCell>
                      <TableCell>
                        <span className={message.status === "已发送" ? "text-green-600" : "text-yellow-600"}>
                          {message.status}
                        </span>
                      </TableCell>
                      <TableCell>{message.createTime}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">查看</Button>
                          <Button variant="destructive" size="sm">删除</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new">
          <Card>
            <CardHeader>
              <CardTitle>发送新消息</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label>消息标题</label>
                  <Input
                    value={newMessage.title}
                    onChange={e => setNewMessage({...newMessage, title: e.target.value})}
                    placeholder="请输入消息标题"
                  />
                </div>
                <div className="grid gap-2">
                  <label>消息内容</label>
                  <Textarea
                    value={newMessage.content}
                    onChange={e => setNewMessage({...newMessage, content: e.target.value})}
                    placeholder="请输入消息内容"
                    rows={5}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <label>消息类型</label>
                    <Select
                      value={newMessage.type}
                      onValueChange={value => setNewMessage({...newMessage, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择消息类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="系统通知">系统通知</SelectItem>
                        <SelectItem value="功能通知">功能通知</SelectItem>
                        <SelectItem value="活动通知">活动通知</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <label>接收对象</label>
                    <Select
                      value={newMessage.recipients}
                      onValueChange={value => setNewMessage({...newMessage, recipients: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="选择接收对象" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="全部用户">全部用户</SelectItem>
                        <SelectItem value="星投用户">星投用户</SelectItem>
                        <SelectItem value="星钱包用户">星钱包用户</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button onClick={handleSendMessage}>发送消息</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">系统通知</h3>
                      <p className="text-sm text-gray-500">系统维护、版本更新等通知</p>
                    </div>
                    <Button variant="outline">配置</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">功能通知</h3>
                      <p className="text-sm text-gray-500">新功能上线、功能优化等通知</p>
                    </div>
                    <Button variant="outline">配置</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">活动通知</h3>
                      <p className="text-sm text-gray-500">平台活动、优惠信息等通知</p>
                    </div>
                    <Button variant="outline">配置</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 