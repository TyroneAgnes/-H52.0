"use client"

import { useState } from "react"
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Check,
  X
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

// 模拟导师数据
const mentorsData = [
  {
    id: 1,
    name: "陈维德",
    avatar: "/images/mentor/david-chen.jpg",
    title: "资深金融分析师",
    experience: "20多年国际证券市场经验",
    followers: 652,
    rating: 4.98,
    status: "active",
    investAmount: 500000000,
    performance: {
      daily: 2.8,
      weekly: 12.5,
      monthly: 73.33,
    },
    createdAt: "2023-01-15",
  },
  {
    id: 2,
    name: "李明",
    avatar: "/images/mentor/li-ming.jpg",
    title: "量化交易专家",
    experience: "15年量化交易经验",
    followers: 438,
    rating: 4.85,
    status: "active",
    investAmount: 320000000,
    performance: {
      daily: 1.9,
      weekly: 8.7,
      monthly: 52.4,
    },
    createdAt: "2023-02-20",
  },
  {
    id: 3,
    name: "王芳",
    avatar: "/images/mentor/wang-fang.jpg",
    title: "价值投资导师",
    experience: "12年投资银行经验",
    followers: 325,
    rating: 4.72,
    status: "inactive",
    investAmount: 280000000,
    performance: {
      daily: 1.2,
      weekly: 5.8,
      monthly: 38.6,
    },
    createdAt: "2023-03-10",
  },
  {
    id: 4,
    name: "张伟",
    avatar: "/images/mentor/zhang-wei.jpg",
    title: "技术分析专家",
    experience: "18年股票市场经验",
    followers: 521,
    rating: 4.91,
    status: "active",
    investAmount: 420000000,
    performance: {
      daily: 2.4,
      weekly: 10.2,
      monthly: 65.7,
    },
    createdAt: "2023-01-28",
  },
  {
    id: 5,
    name: "刘洋",
    avatar: "/images/mentor/liu-yang.jpg",
    title: "期货交易专家",
    experience: "10年期货市场经验",
    followers: 289,
    rating: 4.68,
    status: "pending",
    investAmount: 180000000,
    performance: {
      daily: 1.7,
      weekly: 7.5,
      monthly: 45.2,
    },
    createdAt: "2023-04-05",
  },
]

export default function AdminMentorsPage() {
  const { toast } = useToast()
  const [mentors, setMentors] = useState(mentorsData)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedMentor, setSelectedMentor] = useState<any>(null)
  
  const itemsPerPage = 10
  const totalPages = Math.ceil(mentors.length / itemsPerPage)

  // 筛选导师
  const filteredMentors = mentors.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mentor.title.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || mentor.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // 分页
  const paginatedMentors = filteredMentors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // 处理删除导师
  const handleDeleteMentor = () => {
    if (!selectedMentor) return
    
    setMentors(mentors.filter(mentor => mentor.id !== selectedMentor.id))
    setDeleteDialogOpen(false)
    
    toast({
      title: "删除成功",
      description: `导师 ${selectedMentor.name} 已被删除`,
    })
    
    setSelectedMentor(null)
  }

  // 处理状态更改
  const handleStatusChange = (mentorId: number, newStatus: string) => {
    setMentors(mentors.map(mentor => 
      mentor.id === mentorId ? { ...mentor, status: newStatus } : mentor
    ))
    
    const mentor = mentors.find(m => m.id === mentorId)
    
    toast({
      title: "状态已更新",
      description: `导师 ${mentor?.name} 状态已更改为 ${newStatus === 'active' ? '活跃' : newStatus === 'inactive' ? '停用' : '待审核'}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">导师管理</h1>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          添加导师
        </Button>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="搜索导师名称或职位..."
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
            <SelectItem value="inactive">停用</SelectItem>
            <SelectItem value="pending">待审核</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* 导师列表 */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>导师信息</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>粉丝数</TableHead>
                <TableHead>评分</TableHead>
                <TableHead>管理资金</TableHead>
                <TableHead>月收益率</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedMentors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    未找到符合条件的导师
                  </TableCell>
                </TableRow>
              ) : (
                paginatedMentors.map((mentor) => (
                  <TableRow key={mentor.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 overflow-hidden rounded-full">
                          <img 
                            src={mentor.avatar} 
                            alt={mentor.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{mentor.name}</div>
                          <div className="text-xs text-gray-500">{mentor.title}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          mentor.status === "active" ? "default" : 
                          mentor.status === "inactive" ? "secondary" : 
                          "outline"
                        }
                      >
                        {mentor.status === "active" ? "活跃" : 
                         mentor.status === "inactive" ? "停用" : 
                         "待审核"}
                      </Badge>
                    </TableCell>
                    <TableCell>{mentor.followers}</TableCell>
                    <TableCell>{mentor.rating}</TableCell>
                    <TableCell>¥{(mentor.investAmount / 100000000).toFixed(1)}亿</TableCell>
                    <TableCell className="text-green-600">+{mentor.performance.monthly}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Filter className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {mentor.status !== "active" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(mentor.id, "active")}>
                                <Check className="w-4 h-4 mr-2 text-green-500" />
                                设为活跃
                              </DropdownMenuItem>
                            )}
                            {mentor.status !== "inactive" && (
                              <DropdownMenuItem onClick={() => handleStatusChange(mentor.id, "inactive")}>
                                <X className="w-4 h-4 mr-2 text-gray-500" />
                                设为停用
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setSelectedMentor(mentor)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              删除导师
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
        {filteredMentors.length > 0 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-gray-500">
              显示 {filteredMentors.length} 个导师中的 {(currentPage - 1) * itemsPerPage + 1}-
              {Math.min(currentPage * itemsPerPage, filteredMentors.length)} 个
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
      
      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              您确定要删除导师 "{selectedMentor?.name}" 吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteMentor}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 