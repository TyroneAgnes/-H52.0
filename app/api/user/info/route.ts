import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function GET() {
  try {
    const headersList = headers()
    const token = headersList.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.json({
        code: 1,
        message: "未登录"
      }, { status: 401 })
    }

    // 模拟用户数据
    const userInfo = {
      id: "1",
      username: "admin",
      token: token,
      balance: "100000.00",
      vipLevel: 1,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
    }

    return NextResponse.json({
      code: 0,
      data: userInfo,
      message: "获取成功"
    })
  } catch (error) {
    console.error("获取用户信息失败:", error)
    return NextResponse.json({
      code: 1,
      message: "服务器错误"
    }, { status: 500 })
  }
} 