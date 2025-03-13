import { NextResponse } from 'next/server'
import { UserService } from '@/lib/services/userService'
import { sign } from 'jsonwebtoken'

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

    // 验证用户
    const user = await UserService.login(username, password)

    // 生成 JWT token
    const token = sign(
      { 
        userId: user.id,
        username: user.username,
        vipLevel: user.vipLevel 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    // 更新用户 token
    await UserService.updateUserToken(user.id, token)

    // 返回用户信息（不包含敏感信息）
    return NextResponse.json({
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        inviteCode: user.inviteCode,
        token,
        balance: user.balance,
        baseDeposit: user.baseDeposit,
        starWalletBalance: user.starWalletBalance,
        starInvestBalance: user.starInvestBalance,
        vipLevel: user.vipLevel,
        vipName: user.vipName,
        teamCount: user.teamCount,
        directCount: user.directCount,
        teamProfit: user.teamProfit,
        totalProfit: user.totalProfit,
        yesterdayProfit: user.yesterdayProfit,
        starInvestProfit: user.starInvestProfit,
        starWalletProfit: user.starWalletProfit,
        avatar: user.avatar,
        createdAt: user.createdAt,
        isFirstLogin: user.isFirstLogin,
        commission: user.commission,
        teamPerformance: user.teamPerformance
      }
    })
  } catch (error) {
    console.error('登录失败:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '登录失败，请稍后重试' },
      { status: 401 }
    )
  }
} 