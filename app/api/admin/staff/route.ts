import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'

// 获取员工列表
export async function GET(request: Request) {
  try {
    console.log('开始处理管理员获取员工请求')
    
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
    
    try {
      console.log('开始查询员工')
      const employees = await prisma.employee.findMany({
        include: {
          user: {
            select: {
              id: true,
              username: true,
              nickname: true,
              avatar: true,
              vipLevel: true,
              vipName: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      
      console.log('查询到员工数量:', employees.length)
      
      return NextResponse.json({
        code: 0,
        data: employees,
        message: '获取成功'
      }, {
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (dbError) {
      console.error('查询员工时数据库错误:', dbError)
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
    console.error('获取员工失败:', error)
    return NextResponse.json(
      { 
        error: '获取员工失败',
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