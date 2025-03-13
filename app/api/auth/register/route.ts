import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { username, password, referralCode } = await request.json()

    if (!username || !password || !referralCode) {
      return NextResponse.json(
        { error: '用户名、密码和推荐码不能为空' },
        { status: 400 }
      )
    }

    // 模拟注册流程，不依赖数据库
    // 在生产环境中，这里应该连接到数据库验证和创建用户

    // 模拟生成邀请码
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    return NextResponse.json({
      message: '注册成功',
      user: {
        id: Date.now().toString(),
        username: username,
        inviteCode: inviteCode
      }
    })
  } catch (error) {
    console.error('注册失败:', error)
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    )
  }
} 