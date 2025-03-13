"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Permission {
  id: string
  name: string
  description: string
}

interface Staff {
  id: number
  name: string
  username: string
  role: string
  permissions: string[]
  status: "active" | "inactive"
  lastLogin: string
}

export default function StaffPage() {
  const [permissions] = useState<Permission[]>([
    { id: "dashboard", name: "仪表盘", description: "查看系统概览" },
    { id: "users", name: "用户管理", description: "管理用户信息" },
    { id: "recharge", name: "充值审核", description: "处理充值请求" },
    { id: "mentors", name: "导师管理", description: "管理导师信息" },
    { id: "rules", name: "平台规则", description: "设置平台规则" },
    { id: "crawler", name: "爬虫管理", description: "管理爬虫任务" },
    { id: "messages", name: "消息中心", description: "管理系统消息" },
    { id: "support", name: "客服中心", description: "处理客户反馈" },
    { id: "settings", name: "系统设置", description: "管理系统配置" }
  ])

  const [staffList] = useState<Staff[]>([
    {
      id: 1,
      name: "张经理",
      username: "manager1",
      role: "管理员",
      permissions: ["dashboard", "users", "recharge", "mentors"],
      status: "active",
      lastLogin: "2024-03-20 15:30"
    },
    {
      id: 2,
      name: "李客服",
      username: "support1",
      role: "客服",
      permissions: ["support", "messages"],
      status: "active",
      lastLogin: "2024-03-20 16:00"
    }
  ])

  const [newStaff, setNewStaff] = useState({
    name: "",
    username: "",
    password: "",
    role: "",
    permissions: [] as string[]
  })

  const handleAddStaff = () => {
    console.log("添加新员工", newStaff)
  }

  const handleTogglePermission = (permissionId: string) => {
    setNewStaff(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">员工管理</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>添加员工</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>添加新员工</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label>姓名</label>
                  <Input
                    value={newStaff.name}
                    onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label>用户名</label>
                  <Input
                    value={newStaff.username}
                    onChange={e => setNewStaff({...newStaff, username: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label>密码</label>
                  <Input
                    type="password"
                    value={newStaff.password}
                    onChange={e => setNewStaff({...newStaff, password: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label>角色</label>
                  <Input
                    value={newStaff.role}
                    onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label>权限设置</label>
                <div className="grid grid-cols-3 gap-4">
                  {permissions.map(permission => (
                    <div key={permission.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission.id}
                        checked={newStaff.permissions.includes(permission.id)}
                        onCheckedChange={() => handleTogglePermission(permission.id)}
                      />
                      <label htmlFor={permission.id} className="text-sm">
                        {permission.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Button onClick={handleAddStaff}>确认添加</Button>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>员工列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>姓名</TableHead>
                <TableHead>用户名</TableHead>
                <TableHead>角色</TableHead>
                <TableHead>权限</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>最后登录</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map(staff => (
                <TableRow key={staff.id}>
                  <TableCell>{staff.id}</TableCell>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.username}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {staff.permissions.map(id => (
                        <span key={id} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          {permissions.find(p => p.id === id)?.name}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={staff.status === "active" ? "text-green-600" : "text-red-600"}>
                      {staff.status === "active" ? "在职" : "离职"}
                    </span>
                  </TableCell>
                  <TableCell>{staff.lastLogin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">编辑</Button>
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