"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function CrawlerPage() {
  const [newTask, setNewTask] = useState({
    url: "",
    frequency: "daily",
    time: "09:00",
    articleLimit: "10",
    isActive: true
  })

  const [tasks] = useState([
    {
      id: 1,
      url: "https://finance.sina.com.cn",
      frequency: "每日",
      time: "09:00",
      articleLimit: 10,
      lastRun: "2024-03-20 09:00",
      status: "运行中"
    },
    {
      id: 2,
      url: "https://finance.qq.com",
      frequency: "每日",
      time: "10:00",
      articleLimit: 15,
      lastRun: "2024-03-20 10:00",
      status: "已完成"
    }
  ])

  const handleAddTask = () => {
    console.log("添加新任务", newTask)
  }

  const handleToggleTask = (taskId: number) => {
    console.log("切换任务状态", taskId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">爬虫管理</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>添加新爬虫任务</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label>目标网址</label>
              <Input 
                placeholder="请输入要爬取的网站URL"
                value={newTask.url}
                onChange={e => setNewTask({...newTask, url: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <label>执行频率</label>
                <Select 
                  value={newTask.frequency}
                  onValueChange={value => setNewTask({...newTask, frequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择频率" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">每小时</SelectItem>
                    <SelectItem value="daily">每天</SelectItem>
                    <SelectItem value="weekly">每周</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>执行时间</label>
                <Input 
                  type="time"
                  value={newTask.time}
                  onChange={e => setNewTask({...newTask, time: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <label>文章数量限制</label>
                <Input 
                  type="number"
                  value={newTask.articleLimit}
                  onChange={e => setNewTask({...newTask, articleLimit: e.target.value})}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch 
                checked={newTask.isActive}
                onCheckedChange={checked => setNewTask({...newTask, isActive: checked})}
              />
              <label>立即启用</label>
            </div>
          </div>
          <Button onClick={handleAddTask}>添加任务</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>任务列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>目标网址</TableHead>
                <TableHead>执行频率</TableHead>
                <TableHead>执行时间</TableHead>
                <TableHead>文章限制</TableHead>
                <TableHead>上次执行</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map(task => (
                <TableRow key={task.id}>
                  <TableCell>{task.id}</TableCell>
                  <TableCell>{task.url}</TableCell>
                  <TableCell>{task.frequency}</TableCell>
                  <TableCell>{task.time}</TableCell>
                  <TableCell>{task.articleLimit}</TableCell>
                  <TableCell>{task.lastRun}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleToggleTask(task.id)}>
                        {task.status === "运行中" ? "停止" : "启动"}
                      </Button>
                      <Button variant="destructive" size="sm">删除</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 