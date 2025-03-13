"use client"

import { ChevronLeft, ChevronRight, HelpCircle, MessageCircle, FileText, AlertCircle, Phone } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import PageBackground from "@/components/page-background"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  const faqCategories = [
    {
      title: "账户问题",
      icon: <HelpCircle className="h-5 w-5 text-blue-600" />,
      href: "/help/account",
      questions: ["如何注册账号?", "忘记密码怎么办?", "如何修改个人信息?"],
    },
    {
      title: "资金问题",
      icon: <HelpCircle className="h-5 w-5 text-green-600" />,
      href: "/help/funds",
      questions: ["如何充值?", "提现需要多久到账?", "充值有手续费吗?"],
    },
    {
      title: "交易问题",
      icon: <HelpCircle className="h-5 w-5 text-purple-600" />,
      href: "/help/trading",
      questions: ["如何进行交易?", "交易手续费是多少?", "如何查看交易记录?"],
    },
    {
      title: "星投问题",
      icon: <HelpCircle className="h-5 w-5 text-orange-600" />,
      href: "/help/star-invest",
      questions: ["什么是星投?", "星投收益如何计算?", "如何选择星投导师?", "星投每日收益率是多少?"],
    },
    {
      title: "星钱包问题",
      icon: <HelpCircle className="h-5 w-5 text-indigo-600" />,
      href: "/help/star-wallet",
      questions: ["星钱包收益规则是什么?", "如何向星钱包转入资金?", "星钱包收益何时结算?", "星钱包的资金如何转出?"],
    },
  ]

  return (
    <PageBackground>
      <div className="flex flex-col min-h-screen">
        <Header
          title="帮助中心"
          leftComponent={
            <Link href="/profile">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
          }
        />

        <div className="flex-1 p-4">
          {/* 搜索框 */}
          <div className="mb-6">
            <Input
              type="search"
              placeholder="搜索问题..."
              className="bg-white/85 backdrop-blur-sm bg-blue-gray-100/15"
            />
          </div>

          {/* 快速入口 */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <Link
              href="/help/customer-service"
              className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm">在线客服</span>
            </Link>

            <Link href="/help/faq" className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm">常见问题</span>
            </Link>

            <Link href="/help/customer-service" className="flex flex-col items-center bg-white p-3 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
                <AlertCircle className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm">问题反馈</span>
            </Link>
          </div>

          {/* 常见问题分类 */}
          <div className="space-y-4">
            {faqCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                <Link href={category.href} className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                      {category.icon}
                    </div>
                    <span className="font-medium">{category.title}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>

                <div className="space-y-2 pl-10">
                  {category.questions.map((question, qIndex) => (
                    <Link
                      key={qIndex}
                      href={`${category.href}#q${qIndex + 1}`}
                      className="block text-sm text-gray-600 hover:text-blue-600"
                    >
                      {question}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 联系方式 */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-600 mr-2" />
                <span className="font-medium">联系我们</span>
              </div>
              <Link href="/help/customer-service">
                <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white">
                  联系客服
                </Button>
              </Link>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>服务时间: 周一至周日 9:00-21:00</p>
            </div>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

