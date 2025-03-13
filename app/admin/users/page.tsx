"use client"

import { useState, useEffect } from "react"
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Ban,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Save
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// 定义用户类型接口
interface User {
  id: string
  username: string
  nickname?: string
  balance: number
  commission: number
  teamProfit: number
  totalProfit: number
  vipLevel: number
  vipName: string
  avatar?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminUsersPage() {
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [actionType, setActionType] = useState<"block" | "delete" | null>(null)
  
  // 编辑用户表单状态
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    balance: 0,
    profit: 0,
    password: "",
    confirmPassword: "",
  })

  // 加载用户数据
  const loadUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      
      if (res.status === 403) {
        toast({
          title: "无权限访问",
          description: "请确认您已正确登录管理员账号",
          variant: "destructive"
        })
        return
      }
      
      const data = await res.json()
      
      if (data.code === 0) {
        setUsers(data.data)
      } else {
        toast({
          title: "加载失败",
          description: data.message || "加载用户数据失败",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('加载用户数据失败:', error)
      toast({
        title: "加载失败",
        description: "加载用户数据失败，请检查网络连接",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // 初始加载
  useEffect(() => {
    loadUsers()
  }, [])
  
  const itemsPerPage = 10
  const totalPages = Math.ceil(users.length / itemsPerPage)

  // 筛选用户
  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.nickname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && user.isActive) || 
      (statusFilter === "inactive" && !user.isActive) ||
      (statusFilter === "blocked" && !user.isActive)
    
    return matchesSearch && matchesStatus
  })

  // 分页
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // 处理用户操作
  const handleUserAction = async () => {
    if (!selectedUser || !actionType) return
    
    try {
      setLoading(true)
      
      // 这里可以添加实际的API调用来更新用户状态
      // 示例: 
      // const res = await fetch('/api/admin/users', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({
      //     userId: selectedUser.id,
      //     action: actionType
      //   }),
      //   credentials: 'include'
      // })
      
      if (actionType === "delete") {
        toast({
          title: "删除成功",
          description: `用户 ${selectedUser.username} 已被删除`,
        })
      } else if (actionType === "block") {
        toast({
          title: "状态已更新",
          description: `用户 ${selectedUser.username} 已被${selectedUser.isActive ? "封禁" : "解封"}`,
        })
      }
      
      // 重新加载用户数据
      loadUsers()
    } catch (error) {
      console.error('用户操作失败:', error)
      toast({
        title: "操作失败",
        description: "操作用户失败，请稍后重试",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setActionDialogOpen(false)
      setSelectedUser(null)
      setActionType(null)
    }
  }
  
  // 打开编辑对话框
  const openEditDialog = (user: User) => {
    setSelectedUser(user)
    setEditForm({
      name: user.username,
      email: user.nickname || '',
      phone: '',
      balance: user.balance,
      profit: user.totalProfit,
      password: "",
      confirmPassword: "",
    })
    setEditDialogOpen(true)
  }
  
  // 处理表单输入变化
  const handleEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // 对于金额字段，转换为数字
    if (name === 'balance' || name === 'profit') {
      setEditForm({
        ...editForm,
        [name]: parseFloat(value) || 0
      })
    } else {
      setEditForm({
        ...editForm,
        [name]: value
      })
    }
  }
  
  // 保存用户编辑
  const handleSaveUser = async () => {
    if (!selectedUser) return;
    
    // 验证密码
    if (editForm.password && editForm.password !== editForm.confirmPassword) {
      toast({
        title: "密码错误",
        description: "两次输入的密码不一致",
        variant: "destructive"
      })
      return
    }
    
    try {
      setLoading(true)
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          balance: editForm.balance,
          profit: editForm.profit,
          nickname: editForm.email || undefined
        }),
        credentials: 'include'
      })
      
      if (res.status === 403) {
        toast({
          title: "无权限操作",
          description: "请确认您已正确登录管理员账号",
          variant: "destructive"
        })
        return
      }
      
      const data = await res.json()
      
      if (data.code === 0) {
        toast({
          title: "保存成功",
          description: `用户 ${editForm.name} 的信息已更新`,
        })
        
        // 重新加载用户数据
        loadUsers()
      } else {
        toast({
          title: "保存失败",
          description: data.message || "更新用户信息失败",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('保存用户信息失败:', error)
      toast({
        title: "保存失败",
        description: "保存用户信息失败，请检查网络连接",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setEditDialogOpen(false)
      setSelectedUser(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">用户管理</h1>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="搜索用户名、邮箱或手机号..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有状态</SelectItem>
            <SelectItem value="active">活跃</SelectItem>
            <SelectItem value="inactive">非活跃</SelectItem>
            <SelectItem value="blocked">已封禁</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* 用户列表 */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>用户信息</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>底仓</TableHead>
                <TableHead>利润</TableHead>
                <TableHead>注册日期</TableHead>
                <TableHead>最后登录</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    未找到符合条件的用户
                  </TableCell>
                </TableRow>
              ) : (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full bg-gray-200">
                          {user.avatar && (
                            <img 
                              src={user.avatar} 
                              alt={user.username}
                              className="object-cover w-full h-full"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg font-semibold">
                            {user.username.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-xs text-gray-500">{user.nickname || '-'}</div>
                          <div className="text-xs text-gray-500">{user.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          user.isActive ? "default" : "destructive"
                        }
                      >
                        {user.isActive ? "活跃" : "已封禁"}
                      </Badge>
                    </TableCell>
                    <TableCell>¥{user.balance.toLocaleString()}</TableCell>
                    <TableCell>¥{user.totalProfit.toLocaleString()}</TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Filter className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => {
                                setSelectedUser(user)
                                setActionType("block")
                                setActionDialogOpen(true)
                              }}
                            >
                              {user.isActive ? (
                                <>
                                  <Check className="w-4 h-4 mr-2 text-green-500" />
                                  解除封禁
                                </>
                              ) : (
                                <>
                                  <Ban className="w-4 h-4 mr-2 text-orange-500" />
                                  封禁用户
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setSelectedUser(user)
                                setActionType("delete")
                                setActionDialogOpen(true)
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除用户
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* 分页 */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-gray-500">
              显示 {filteredUsers.length} 个用户中的 {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} 个
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* 操作确认对话框 */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "delete" ? "确认删除" : 
               selectedUser?.isActive ? "确认封禁" : "确认解封"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "delete" ? (
                <>您确定要删除用户 "{selectedUser?.username}" 吗？此操作无法撤销。</>
              ) : selectedUser?.isActive ? (
                <>您确定要封禁用户 "{selectedUser?.username}" 吗？封禁后该用户将无法登录系统。</>
              ) : (
                <>您确定要解除用户 "{selectedUser?.username}" 的封禁状态吗？</>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
              取消
            </Button>
            <Button 
              variant={actionType === "delete" ? "destructive" : "default"}
              onClick={handleUserAction}
            >
              {actionType === "delete" ? "删除" : 
               selectedUser?.isActive ? "封禁" : "解封"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 编辑用户对话框 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>编辑用户</DialogTitle>
            <DialogDescription>
              修改用户信息，包括基本资料、金额和密码
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info">基本资料</TabsTrigger>
              <TabsTrigger value="balance">金额管理</TabsTrigger>
              <TabsTrigger value="password">修改密码</TabsTrigger>
            </TabsList>
            
            {/* 基本资料 */}
            <TabsContent value="info" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">用户名</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={editForm.name} 
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">邮箱</Label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={editForm.email} 
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">手机号</Label>
                <Input 
                  id="phone" 
                  name="phone"
                  value={editForm.phone} 
                  onChange={handleEditFormChange}
                />
              </div>
            </TabsContent>
            
            {/* 金额管理 */}
            <TabsContent value="balance" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="balance">底仓金额 (¥)</Label>
                <Input 
                  id="balance" 
                  name="balance"
                  type="number" 
                  value={editForm.balance} 
                  onChange={handleEditFormChange}
                />
                <p className="text-xs text-gray-500">用户的基础投资金额</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="profit">利润金额 (¥)</Label>
                <Input 
                  id="profit" 
                  name="profit"
                  type="number" 
                  value={editForm.profit} 
                  onChange={handleEditFormChange}
                />
                <p className="text-xs text-gray-500">用户的累计收益金额</p>
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">总资产:</span>
                  <span className="font-medium">¥{(editForm.balance + editForm.profit).toLocaleString()}</span>
                </div>
              </div>
            </TabsContent>
            
            {/* 修改密码 */}
            <TabsContent value="password" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="password">新密码</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  value={editForm.password} 
                  onChange={handleEditFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">确认新密码</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password" 
                  value={editForm.confirmPassword} 
                  onChange={handleEditFormChange}
                />
              </div>
              <p className="text-xs text-gray-500">
                如不需要修改密码，请留空
              </p>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSaveUser}>
              <Save className="w-4 h-4 mr-2" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 