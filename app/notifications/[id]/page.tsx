"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, Bell, CheckCircle, AlertCircle, Info, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Header from "@/components/header"
import { useRouter } from "next/navigation"

// 通知数据（实际应用中应从API获取）
const notificationsData = {
  1: {
    id: 1,
    type: "system",
    title: "系统维护通知",
    content:
      "尊敬的用户，我们将于2024年3月15日凌晨2:00-4:00进行系统维护，期间部分服务可能暂时不可用。维护期间，您将无法进行充值、提现和交易操作，但可以正常查看账户信息和市场行情。\n\n维护完成后，我们将推出多项新功能，包括优化的交易界面、更丰富的投资组合分析工具以及更安全的账户保护措施。\n\n感谢您的理解与支持！",
    date: "2024-03-10",
    time: "10:30",
    isRead: true,
  },
  2: {
    id: 2,
    type: "transaction",
    title: "交易成功",
    content:
      '您已成功购买星辰导师投资组合，金额¥50,000.00。\n\n交易详情：\n- 交易时间：2024-03-09 14:30:25\n- 交易类型：购买\n- 投资组合：王金融导师精选组合\n- 交易金额：¥50,000.00\n- 手续费：¥0.00\n- 交易状态：已完成\n\n您可以在"交易"页面查看更多交易详情和收益情况。',
    date: "2024-03-09",
    time: "14:30",
    isRead: true,
  },
  3: {
    id: 3,
    type: "activity",
    title: "新用户专享活动",
    content:
      "欢迎加入星辰资本！\n\n作为我们尊贵的新用户，您可以享受以下专属福利：\n\n1. 首次充值奖励：首次充值可享受1%的额外奖励，最高奖励1,000元\n2. 投资返现：首次投资星投产品，可获得投资金额0.5%的现金返还\n3. 推荐好友：每成功邀请一位好友注册并投资，您和好友各获得100元奖励\n\n活动时间：即日起至2024年4月30日\n\n点击查看活动详情>>",
    date: "2024-03-08",
    time: "09:15",
    isRead: true,
  },
  4: {
    id: 4,
    type: "transaction",
    title: "充值成功",
    content:
      "您已成功充值¥100,000.00到您的账户。\n\n交易详情：\n- 充值时间：2024-03-08 08:45:12\n- 充值方式：银行卡转账\n- 充值金额：¥100,000.00\n- 手续费：¥0.00\n- 交易状态：已完成\n\n资金已到账，可用于投资和交易。",
    date: "2024-03-08",
    time: "08:45",
    isRead: true,
  },
  5: {
    id: 5,
    type: "system",
    title: "安全提醒",
    content:
      "我们检测到您的账户在新设备上登录，如非本人操作，请立即修改密码。\n\n登录详情：\n- 登录时间：2024-03-07 16:20:35\n- 设备类型：iPhone 14 Pro\n- 登录地点：上海市\n- IP地址：101.85.xx.xx\n\n为保障您的账户安全，建议您：\n1. 定期修改密码\n2. 开启两步验证\n3. 不要在公共设备上保存登录信息\n\n如有疑问，请联系客服。",
    date: "2024-03-07",
    time: "16:20",
    isRead: true,
  },
}

export default function NotificationDetailPage({ params }) {
  const router = useRouter()
  const [notification, setNotification] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 模拟API请求
    const fetchNotification = () => {
      setLoading(true)
      setTimeout(() => {
        const notificationData = notificationsData[params.id]
        if (notificationData) {
          setNotification(notificationData)
        } else {
          // 通知不存在，返回列表页
          router.push("/notifications")
        }
        setLoading(false)
      }, 300)
    }

    fetchNotification()
  }, [params.id, router])

  // 获取通知图标
  const getNotificationIcon = (type) => {
    switch (type) {
      case "system":
        return <Info className="h-6 w-6 text-blue-600" />
      case "transaction":
        return <CheckCircle className="h-6 w-6 text-green-600" />
      case "activity":
        return <Calendar className="h-6 w-6 text-purple-600" />
      default:
        return <Bell className="h-6 w-6 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header
          title="通知详情"
          centerTitle={true}
          showBell={false}
          showLogo={false}
          leftComponent={
            <Link href="/notifications" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
          }
        />
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (!notification) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header
          title="通知详情"
          centerTitle={true}
          showBell={false}
          showLogo={false}
          leftComponent={
            <Link href="/notifications" className="mr-4">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
          }
        />
        <div className="flex items-center justify-center flex-1">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">通知不存在或已被删除</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header
        title="通知详情"
        centerTitle={true}
        showBell={false}
        showLogo={false}
        leftComponent={
          <Link href="/notifications" className="mr-4">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
        }
      />

      <div className="px-4 py-4 flex-1">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-4">
            <div className="flex items-center mb-4">
              <div className="mr-3">{getNotificationIcon(notification.type)}</div>
              <div>
                <h2 className="font-semibold text-lg">{notification.title}</h2>
                <div className="text-xs text-gray-500 mt-1">
                  {notification.date} {notification.time}
                </div>
              </div>
            </div>

            <div className="text-gray-700 whitespace-pre-line">{notification.content}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

