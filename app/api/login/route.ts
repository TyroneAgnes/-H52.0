import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // TODO: 这里应该连接实际的数据库进行验证
    // 目前仅作为示例返回模拟数据
    if (username === "admin" && password === "admin") {
      return NextResponse.json({
        code: 0,
        data: {
          id: "1",
          username: "admin",
          token: "mock_token_12345",
        },
        message: "登录成功"
      })
    }

    return NextResponse.json({
      code: 1,
      message: "用户名或密码错误"
    }, { status: 401 })
  } catch (error) {
    console.error("登录接口错误:", error)
    return NextResponse.json({
      code: 1,
      message: "服务器错误"
    }, { status: 500 })
  }
} 