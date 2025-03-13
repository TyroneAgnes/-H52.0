import { NextResponse } from 'next/server'
import { UserService } from '@/lib/services/userService'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { username, password, referralCode } = await request.json()

    if (!username || !password || !referralCode) {
      return NextResponse.json(
        { error: '用户名、密码和推荐码不能为空' },
        { status: 400 }
      )
    }

    // 验证推荐码是否存在
    const referrer = await prisma.user.findFirst({
      where: {
        inviteCode: referralCode.toUpperCase()
      }
    })

    if (!referrer) {
      return NextResponse.json(
        { error: '推荐码不存在' },
        { status: 400 }
      )
    }

    // 验证用户名是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: '该账号名称已被使用' },
        { status: 400 }
      )
    }

    // 创建用户
    const user = await UserService.createUser(username, password, referralCode)

    // 更新推荐人的直推人数
    await prisma.user.update({
      where: { id: referrer.id },
      data: {
        directCount: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      message: '注册成功',
      user: {
        id: user.id,
        username: user.username,
        inviteCode: user.inviteCode
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