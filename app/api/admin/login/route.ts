import { NextResponse } from 'next/server'
import { sign } from 'jsonwebtoken'
import { ADMIN_TOKEN_NAME } from '@/lib/constants'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // 验证管理员账号密码
    if (username !== 'admin' || password !== 'admin888') {
      return NextResponse.json(
        { 
          code: 1,
          message: '用户名或密码错误'
        },
        { status: 401 }
      )
    }

    // 生成管理员JWT token
    const token = sign(
      { 
        userId: 'ADMIN',
        username: 'admin',
        vipLevel: 9,
        isAdmin: true
      },
      JWT_SECRET,
      { expiresIn: '1d' }
    )

    // 创建响应对象
    const response = NextResponse.json({
      code: 0,
      data: {
        username: 'admin',
        vipLevel: 9
      },
      message: '登录成功'
    })

    // 清除普通用户token，确保不会冲突
    response.cookies.set({
      name: 'token',
      value: '',
      httpOnly: true,
      path: '/',
      maxAge: 0,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    // 设置管理员专用cookie
    response.cookies.set({
      name: ADMIN_TOKEN_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 24 * 60 * 60, // 1天
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    return response
  } catch (error) {
    console.error('管理员登录失败:', error)
    return NextResponse.json(
      { 
        code: 1, 
        message: '服务器错误，请稍后重试'
      },
      { status: 500 }
    )
  }
}

// 添加OPTIONS方法处理CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  })
} 