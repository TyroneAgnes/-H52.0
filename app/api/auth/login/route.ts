import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { USER_TOKEN_NAME } from '@/lib/constants'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: '用户名和密码不能为空' },
        { status: 400 }
      )
    }

    // 模拟用户验证 - 任何用户名密码都能登录
    // 在生产环境中，这里应该连接到数据库验证用户
    const mockUser = {
      id: '1',
      username: username,
      nickname: username,
      inviteCode: 'ABC123',
      balance: 10000,
      baseDeposit: 1000,
      starWalletBalance: 5000,
      starInvestBalance: 3000,
      vipLevel: 1,
      vipName: 'VIP1',
      teamCount: 10,
      directCount: 5,
      teamProfit: 1000,
      totalProfit: 2000,
      yesterdayProfit: 100,
      starInvestProfit: 500,
      starWalletProfit: 300,
      avatar: '/avatars/default.png',
      createdAt: new Date(),
      isFirstLogin: false,
      commission: 500,
      teamPerformance: 10000
    }

    // 生成 JWT token
    const token = sign(
      { 
        userId: mockUser.id,
        username: mockUser.username,
        vipLevel: mockUser.vipLevel 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // 创建响应
    const response = NextResponse.json({
      message: '登录成功',
      user: {
        ...mockUser,
        token
      }
    })

    // 设置cookie
    response.cookies.set({
      name: USER_TOKEN_NAME || 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 24小时
      sameSite: 'lax'
    })

    return response
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '登录失败，请稍后重试' },
      { status: 401 }
    )
  }
} 