import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'

// 获取所有用户列表
export async function GET(request: Request) {
  try {
    console.log('开始处理管理员获取用户请求')
    
    // 记录cookie和认证信息
    const cookieHeader = request.headers.get('Cookie')
    console.log('Cookie信息:', cookieHeader || '无cookie')
    
    // 验证管理员权限
    try {
      const admin = await verifyAdmin(request)
      console.log('验证管理员结果:', admin ? '成功' : '失败', admin ? `用户ID: ${admin.id}` : '')
      
      if (!admin) {
        return NextResponse.json(
          { 
            error: '无权限访问', 
            code: 1,
            message: '无权限访问，请确认您已登录管理员账号' 
          },
          { 
            status: 403,
            headers: {
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
      }
    } catch (authError) {
      console.error('验证管理员权限时出错:', authError)
      return NextResponse.json(
        { 
          error: '权限验证失败', 
          code: 1,
          message: '权限验证时出错，请重新登录'
        },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    // 构建查询条件
    const query: any = {}
    if (status === 'active') query.isActive = true
    if (status === 'inactive') query.isActive = false
    
    try {
      console.log('开始查询用户:', query)
      const users = await prisma.user.findMany({
        where: query,
        select: {
          id: true,
          username: true,
          nickname: true,
          balance: true,
          commission: true,
          teamProfit: true,
          totalProfit: true,
          vipLevel: true,
          vipName: true,
          avatar: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      console.log('查询到用户数量:', users.length)
      
      return NextResponse.json({
        code: 0,
        data: users,
        message: '获取成功'
      }, {
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (dbError) {
      console.error('查询用户时数据库错误:', dbError)
      return NextResponse.json(
        { 
          error: '数据库查询失败',
          code: 1,
          message: '查询记录失败，请联系管理员检查数据库'
        },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }
  } catch (error) {
    console.error('获取用户失败:', error)
    return NextResponse.json(
      { 
        error: '获取用户失败',
        code: 1,
        message: '系统错误，请稍后重试'
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
}

// 处理预检请求
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  })
}

// 更新用户信息
export async function PATCH(request: Request) {
  try {
    // 验证管理员权限
    const admin = await verifyAdmin(request)
    console.log('验证管理员结果:', admin ? '成功' : '失败')
    
    if (!admin) {
      return NextResponse.json(
        { 
          error: '无权限访问', 
          code: 1,
          message: '无权限访问，请确认您已登录管理员账号'
        },
        { 
          status: 403,
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    const { userId, balance, profit, nickname } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { 
          error: '参数不完整',
          code: 1,
          message: '请提供用户ID'
        },
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(balance !== undefined && { balance: parseFloat(balance) }),
        ...(profit !== undefined && { totalProfit: parseFloat(profit) }),
        ...(nickname !== undefined && { nickname })
      },
      select: {
        id: true,
        username: true,
        nickname: true,
        balance: true,
        commission: true,
        teamProfit: true,
        totalProfit: true,
        vipLevel: true,
        vipName: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      code: 0,
      data: updatedUser,
      message: '更新成功'
    }, {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('更新用户信息失败:', error)
    return NextResponse.json(
      { 
        error: '更新用户信息失败',
        code: 1,
        message: '系统错误，请稍后重试' 
      },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
} 