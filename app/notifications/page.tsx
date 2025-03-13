"use client"

import { useState } from "react"
import { ArrowLeft, Bell, CheckCircle, Info, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Link from "next/link"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

export default function NotificationsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [notifications, setNotifications] = useState({
    all: [
      {
        id: 1,
        type: "system",
        title: "系统维护通知",
        content: "尊敬的用户，我们将于2024年3月15日凌晨2:00-4:00进行系统维护，期间部分服务可能暂时不可用。",
        date: "2024-03-10",
        time: "10:30",
        isRead: false,
      },
      {
        id: 2,
        type: "transaction",
        title: "交易成功",
        content: "您已成功购买星辰导师投资组合，金额¥50,000.00",
        date: "2024-03-09",
        time: "14:30",
        isRead: true,
      },
      {
        id: 3,
        type: "activity",
        title: "新用户专享活动",
        content: "欢迎加入星辰资本！新用户首次充值可享受1%的额外奖励，最高奖励1,000元。",
        date: "2024-03-08",
        time: "09:15",
        isRead: false,
      },
      {
        id: 4,
        type: "transaction",
        title: "充值成功",
        content: "您已成功充值¥100,000.00到您的账户",
        date: "2024-03-08",
        time: "08:45",
        isRead: true,
      },
      {
        id: 5,
        type: "system",
        title: "安全提醒",
        content: "我们检测到您的账户在新设备上登录，如非本人操作，请立即修改密码。",
        date: "2024-03-07",
        time: "16:20",
        isRead: true,
      },
    ],
    system: [
      {
        id: 1,
        type: "system",
        title: "系统维护通知",
        content: "尊敬的用户，我们将于2024年3月15日凌晨2:00-4:00进行系统维护，期间部分服务可能暂时不可用。",
        date: "2024-03-10",
        time: "10:30",
        isRead: false,
      },
      {
        id: 5,
        type: "system",
        title: "安全提醒",
        content: "我们检测到您的账户在新设备上登录，如非本人操作，请立即修改密码。",
        date: "2024-03-07",
        time: "16:20",
        isRead: true,
      },
    ],
    transaction: [
      {
        id: 2,
        type: "transaction",
        title: "交易成功",
        content: "您已成功购买星辰导师投资组合，金额¥50,000.00",
        date: "2024-03-09",
        time: "14:30",
        isRead: true,
      },
      {
        id: 4,
        type: "transaction",
        title: "充值成功",
        content: "您已成功充值¥100,000.00到您的账户",
        date: "2024-03-08",
        time: "08:45",
        isRead: true,
      },
    ],
    activity: [
      {
        id: 3,
        type: "activity",
        title: "新用户专享活动",
        content: "欢迎加入星辰资本！新用户首次充值可享受1%的额外奖励，最高奖励1,000元。",
        date: "2024-03-08",
        time: "09:15",
        isRead: false,
      },
    ],
  })

  // 获取通知图标
  const getNotificationIcon = (type) => {
    switch (type) {
      case "system":
        return <Info className="h-5 w-5 text-blue-600" />
      case "transaction":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "activity":
        return <Calendar className="h-5 w-5 text-purple-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  // 标记所有通知为已读
  const markAllAsRead = () => {
    // 更新所有通知为已读
    const updatedNotifications = {}

    Object.keys(notifications).forEach((key) => {
      updatedNotifications[key] = notifications[key].map((notification) => ({
        ...notification,
        isRead: true,
      }))
    })

    setNotifications(updatedNotifications)
    toast({
      title: "已标记全部为已读",
      description: "所有通知已标记为已读状态",
    })
  }

  // 标记单个通知为已读并导航到详情页
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      // 更新通知为已读
      const updatedNotifications = {}

      Object.keys(notifications).forEach((key) => {
        updatedNotifications[key] = notifications[key].map((item) =>
          item.id === notification.id ? { ...item, isRead: true } : item,
        )
      })

      setNotifications(updatedNotifications)
    }

    // 导航到详情页
    router.push(`/notifications/${notification.id}`)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 使用Header组件 */}
      <Header
        title="消息通知"
        centerTitle={true}
        showBell={false}
        showLogo={false}
        leftComponent={
          <Link href="/profile" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
        rightComponent={
          <Button variant="ghost" size="sm" className="text-xs h-7 px-2 text-blue-600" onClick={markAllAsRead}>
            全部已读
          </Button>
        }
      />

      {/* 内容区域 */}
      <div className="px-4 py-4">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="all">全部</TabsTrigger>
            <TabsTrigger value="system">系统</TabsTrigger>
            <TabsTrigger value="transaction">交易</TabsTrigger>
            <TabsTrigger value="activity">活动</TabsTrigger>
          </TabsList>

          {Object.keys(notifications).map((tabKey) => (
            <TabsContent key={tabKey} value={tabKey} className="space-y-3">
              {notifications[tabKey].length > 0 ? (
                notifications[tabKey].map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className="cursor-pointer"
                  >
                    <NotificationItem notification={notification} icon={getNotificationIcon(notification.type)} />
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-12">暂无通知</div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}

// 通知项组件
function NotificationItem({ notification, icon }) {
  return (
    <Card className={`border-0 shadow-sm ${!notification.isRead ? "bg-blue-50" : ""}`}>
      <CardContent className="p-4">
        <div className="flex">
          <div className="mr-3 mt-1">{icon}</div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-1">
              <h3 className="font-medium">{notification.title}</h3>
              {!notification.isRead && <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5"></span>}
            </div>
            <p className="text-sm text-gray-700 mb-2">{notification.content}</p>
            <div className="text-xs text-gray-500">
              {notification.date} {notification.time}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

