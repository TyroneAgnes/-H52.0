"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Crown, Copy, Share2, ChevronRight, User, Check } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import Header from "@/components/header"
import { toast } from "@/hooks/use-toast"
import { AgentRules } from './rules'
import { useStore } from "@/lib/store"
import { getNextLevel, getUpgradeNeeds } from "@/lib/store"

// 添加类型定义
interface TaskItem {
  id: number
  title: string
  description: string
  progress: number
  total: number
  reward: string | null
  note: string
}

interface TeamMember {
  id: string
  name: string
  phone: string
  registerDate: string
}

export default function AgentPage() {
  const [activeTaskTab, setActiveTaskTab] = useState("weekly")
  const [isCopied, setIsCopied] = useState(false)
  const [showRules, setShowRules] = useState(false)
  const [siteUrl, setSiteUrl] = useState("https://www.xingchentouzi.cc")

  // 在客户端获取网站URL
  useEffect(() => {
    setSiteUrl(window.location.origin)
  }, [])

  // 获取用户数据
  const userInfo = useStore((state) => state.userInfo)
  const registeredUsers = useStore((state) => state.registeredUsers)

  // 获取下一个等级信息
  const nextLevelInfo = userInfo ? getNextLevel(userInfo.vipName) : null
  const upgradeNeeds = userInfo ? getUpgradeNeeds(userInfo) : null

  // 计算团队数据
  const getTeamData = () => {
    if (!userInfo) return {
      teamPerformance: "0",
      teamCount: 0,
      directCount: 0,
      directMembers: []
    }

    // 获取直推成员列表（带脱敏处理）
    const directMembers = registeredUsers
      .filter(user => user.referrer === userInfo.id)
      .map(user => ({
        id: user.id,
        name: user.username.substring(0, 1) + "**",
        phone: user.username.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"),
        registerDate: user.createTime.split('T')[0]
      }))

    return {
      teamPerformance: userInfo.teamPerformance,
      teamCount: userInfo.teamCount,
      directCount: userInfo.directCount,
      directMembers
    }
  }

  const teamData = getTeamData()

  // 获取任务进度
  const getTaskProgress = useStore((state) => state.getTaskProgress)

  // 更新任务数据
  const taskData = {
    weekly: [
      {
        id: 1,
        title: "周薪任务",
        description: "完成本周推广任务",
        progress: getTaskProgress('weekly').completed,
        total: getTaskProgress('weekly').required,
        reward: null,
        note: "每周可循环领取",
      },
    ],
    star: [
      {
        id: 2,
        title: "五星拱月",
        description: "邀请5位新用户加入",
        progress: getTaskProgress('fiveStars').completed,
        total: getTaskProgress('fiveStars').required,
        reward: "2888.00",
        note: "可重复领取",
      },
    ],
    challenge: [
      {
        id: 3,
        title: "三天挑战",
        description: "新人加入三天内完成首次推广",
        progress: getTaskProgress('threeDay').completed,
        total: getTaskProgress('threeDay').required,
        reward: "428.00",
        note: `剩余${getTaskProgress('threeDay').timeLeft}天`,
      },
      {
        id: 4,
        title: "七天五星",
        description: "新人加入七天内完成五星拱月",
        progress: getTaskProgress('sevenDay').completed,
        total: getTaskProgress('sevenDay').required,
        reward: "728.00",
        note: `剩余${getTaskProgress('sevenDay').timeLeft}天`,
      },
      {
        id: 5,
        title: "十五天团队",
        description: "新人加入十五天内组建15人团队",
        progress: getTaskProgress('fifteenDay').completed,
        total: getTaskProgress('fifteenDay').required,
        reward: "2188.00",
        note: `剩余${getTaskProgress('fifteenDay').timeLeft}天`,
      },
      {
        id: 6,
        title: "三十天团队",
        description: "新人加入三十天内组建30人团队",
        progress: getTaskProgress('thirtyDay').completed,
        total: getTaskProgress('thirtyDay').required,
        reward: "4288.00",
        note: `剩余${getTaskProgress('thirtyDay').timeLeft}天`,
      },
    ],
  }

  // 修改复制函数类型
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

  // 分享链接
  const shareLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "星辰资本邀请",
          text: "邀请您加入星辰资本，体验专业的投资理财服务",
          url: siteUrl,
        })
        .catch((error) => {
          toast({
            title: "分享失败",
            description: "请手动复制链接分享",
            variant: "destructive",
          })
        })
    } else {
      copyToClipboard(siteUrl)
      toast({
        title: "您的设备不支持分享功能",
        description: "链接已复制，请手动分享",
      })
    }
  }

  // 修改提交任务函数类型
  const submitTask = (taskId: number, taskTitle: string) => {
    toast({
      title: `已提交"${taskTitle}"任务`,
      description: "等待审核",
    })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="代理中心"
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
        {/* 规则说明按钮 */}
        <Button 
          variant="outline" 
          className="w-full flex justify-between items-center"
          onClick={() => setShowRules(!showRules)}
        >
          <span>代理中心规则说明</span>
          <ChevronRight className={`h-4 w-4 transition-transform ${showRules ? 'rotate-90' : ''}`} />
        </Button>

        {/* 规则说明弹出内容 */}
        {showRules && (
          <Card className="border-0 shadow-sm bg-white/60">
            <CardContent className="p-4 space-y-4">
              {/* 代理等级说明 */}
              <div>
                <h3 className="font-bold text-lg mb-2">{AgentRules.levelRules.title}</h3>
                <p className="text-gray-600 mb-2">{AgentRules.levelRules.description}</p>
                <div className="space-y-2">
                  {AgentRules.levelRules.levels.map((level, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{level.level}：</span>
                      <span className="text-gray-600">{level.requirements}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 任务中心说明 */}
              <div>
                <h3 className="font-bold text-lg mb-2">{AgentRules.taskRules.title}</h3>
                <p className="text-gray-600 mb-2">{AgentRules.taskRules.description}</p>
                <div className="space-y-2">
                  {AgentRules.taskRules.tasks.map((task, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{task.name}：</span>
                      <span className="text-gray-600">{task.description}，{task.reward}，{task.period}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 佣金说明 */}
              <div>
                <h3 className="font-bold text-lg mb-2">{AgentRules.commissionRules.title}</h3>
                <p className="text-gray-600 mb-2">{AgentRules.commissionRules.description}</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {AgentRules.commissionRules.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>

              {/* 团队业绩说明 */}
              <div>
                <h3 className="font-bold text-lg mb-2">{AgentRules.teamPerformanceRules.title}</h3>
                <p className="text-gray-600 mb-2">{AgentRules.teamPerformanceRules.description}</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {AgentRules.teamPerformanceRules.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 代理等级卡片 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white mr-3">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold">{userInfo?.vipName || "普通代理"}</div>
                <div className="text-xs text-gray-500">
                  {upgradeNeeds ? 
                    `还需直推${upgradeNeeds.directNeeded}人，团队人数增加${upgradeNeeds.teamNeeded}人升级为${nextLevelInfo?.name}` : 
                    "已达到最高等级"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="font-bold">¥ {teamData.teamPerformance}</div>
                <div className="text-xs text-gray-500">团队业绩</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{teamData.teamCount}</div>
                <div className="text-xs text-gray-500">团队人数</div>
              </div>
              <div className="text-center">
                <div className="font-bold">{teamData.directCount}</div>
                <div className="text-xs text-gray-500">直推人数</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 佣金卡片 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <div className="font-medium">可提现佣金</div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-4">
              <div className="text-gray-600">可提现佣金</div>
              <div className="text-xl font-bold text-amber-500">¥ {userInfo?.commission || "0.00"}</div>
            </div>

            <Link href="/withdraw">
              <Button className="w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3"
                  />
                </svg>
                提现
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* 邀请卡片 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <div className="font-medium mb-3">邀请好友</div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg mb-3">
              <div className="font-mono font-semibold text-lg tracking-wider">{userInfo?.inviteCode || ""}</div>
              <Button variant="outline" size="sm" className="h-7" onClick={() => copyToClipboard(userInfo?.inviteCode || "")}>
                {isCopied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {isCopied ? "已复制" : "复制"}
              </Button>
            </div>

            <div className="relative p-3 bg-gray-50 rounded-lg mb-4">
              <div className="text-sm break-all pr-16">{siteUrl}</div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => copyToClipboard(siteUrl)}
              >
                {isCopied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
                {isCopied ? "已复制" : "复制"}
              </Button>
            </div>

            <div className="text-xs text-amber-600 mb-4">
              提示：分享后请尽快打开并注册，以免影响推广效果。
            </div>

            <Button className="w-full" onClick={shareLink}>
              <Share2 className="h-4 w-4 mr-2" />
              分享链接
            </Button>
          </CardContent>
        </Card>

        {/* 团队管理 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <div className="font-medium mb-3">团队管理</div>

            {/* 团队数据概览 */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-lg mb-4">
              <div className="text-center">
                <div className="font-semibold">{teamData.teamCount}</div>
                <div className="text-xs text-gray-500">团队总人数</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">{teamData.directCount}</div>
                <div className="text-xs text-gray-500">直推人数</div>
              </div>
              <div className="text-center">
                <div className="font-semibold">¥ {teamData.teamPerformance}</div>
                <div className="text-xs text-gray-500">团队业绩</div>
              </div>
            </div>

            {/* 团队成员列表 */}
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="bg-gray-50 p-3 border-b border-gray-100">
                <div className="font-medium text-sm">直推成员</div>
              </div>

              {teamData.directMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {member.name} ({member.phone})
                      </div>
                      <div className="text-xs text-gray-500">注册时间: {member.registerDate}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 任务中心 */}
        <Card className="border-0 shadow-sm bg-white/60">
          <CardContent className="p-4">
            <div className="font-medium mb-3">任务中心</div>

            <Tabs defaultValue="weekly" onValueChange={setActiveTaskTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="weekly">周薪任务</TabsTrigger>
                <TabsTrigger value="star">五星拱月</TabsTrigger>
                <TabsTrigger value="challenge">新星挑战</TabsTrigger>
              </TabsList>

              <TabsContent value="weekly" className="space-y-3">
                {taskData.weekly.map((task: TaskItem) => (
                  <TaskItem key={task.id} task={task} onSubmit={submitTask} />
                ))}
              </TabsContent>

              <TabsContent value="star" className="space-y-3">
                {taskData.star.map((task: TaskItem) => (
                  <TaskItem key={task.id} task={task} onSubmit={submitTask} />
                ))}
              </TabsContent>

              <TabsContent value="challenge" className="space-y-3">
                {taskData.challenge.map((task: TaskItem) => (
                  <TaskItem key={task.id} task={task} onSubmit={submitTask} />
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 修改TaskItem组件类型
function TaskItem({ task, onSubmit }: { task: TaskItem, onSubmit: (taskId: number, taskTitle: string) => void }) {
  const progressPercentage = (task.progress / task.total) * 100

  return (
    <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-medium">{task.title}</div>
          <div className="text-sm text-gray-600">{task.description}</div>
        </div>
        <Button size="sm" className="h-8" onClick={() => onSubmit(task.id, task.title)}>
          提交
        </Button>
      </div>

      <div className="mb-2">
        <div className="text-xs text-gray-500 mb-1">
          任务进度: {task.progress}/{task.total}
        </div>
        <div className="w-full h-1.5 bg-white rounded-full overflow-hidden border border-gray-300">
          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      {task.reward && <div className="text-sm font-medium text-blue-600">奖励: ¥ {task.reward}</div>}
      <div className="text-xs text-gray-500">{task.note}</div>
    </div>
  )
}

