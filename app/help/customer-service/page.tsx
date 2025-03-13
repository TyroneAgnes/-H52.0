"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, Send, Image, Paperclip, Smile } from "lucide-react"
import Link from "next/link"
import Header from "@/components/header"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import PageBackground from "@/components/page-background"

export default function CustomerServicePage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "system",
      content: "您好，欢迎使用星辰资本客服系统，请问有什么可以帮助您的?",
      time: "10:00",
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const messagesEndRef = useRef(null)

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 发送消息
  const sendMessage = () => {
    if (!inputMessage.trim()) return

    // 添加用户消息
    const userMessage = {
      id: messages.length + 1,
      sender: "user",
      content: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages([...messages, userMessage])
    setInputMessage("")

    // 模拟客服回复
    setTimeout(() => {
      const systemResponses = [
        "您好，请问有什么可以帮助您的?",
        "感谢您的咨询，我们会尽快处理您的问题。",
        '您可以在"我的"-"安全中心"中修改密码。',
        "充值一般即时到账，如有延迟请联系客服。",
        "星投收益会在每日结算后显示在您的账户中。",
      ]

      const randomResponse = systemResponses[Math.floor(Math.random() * systemResponses.length)]

      const systemMessage = {
        id: messages.length + 2,
        sender: "system",
        content: randomResponse,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }

      setMessages((prev) => [...prev, systemMessage])
    }, 1000)
  }

  // 处理按键事件
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage()
    }
  }

  return (
    <PageBackground>
      <div className="flex flex-col h-screen">
        <Header
          title="在线客服"
          leftComponent={
            <Link href="/help">
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </Link>
          }
        />

        {/* 聊天区域 */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800 border border-gray-200"
                  }`}
                >
                  <div className="text-sm">{message.content}</div>
                  <div className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                    {message.time}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* 输入区域 */}
        <div className="p-3 bg-white border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex space-x-2 mr-2">
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Image className="h-5 w-5 text-gray-500" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Paperclip className="h-5 w-5 text-gray-500" />
              </Button>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                <Smile className="h-5 w-5 text-gray-500" />
              </Button>
            </div>

            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="请输入消息..."
              className="flex-1"
            />

            <Button onClick={sendMessage} className="ml-2 h-10 w-10 rounded-full p-0" disabled={!inputMessage.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </PageBackground>
  )
}

