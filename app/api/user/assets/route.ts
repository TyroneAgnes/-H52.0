import { NextResponse } from 'next/server'
import { UserService } from '@/lib/services/userService'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const assets = await UserService.getUserAssets(user.id)
    return NextResponse.json(assets)
  } catch (error) {
    console.error('获取用户资产信息失败:', error)
    return NextResponse.json(
      { error: '获取用户资产信息失败，请稍后重试' },
      { status: 500 }
    )
  }
} 