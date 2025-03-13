import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'

interface Transaction {
  id: string
  amount: number
  createdAt: Date | string
  type: string
  status: string
}

// 获取仪表盘数据
export async function GET(request: Request) {
  try {
    console.log('开始处理管理员获取仪表盘数据请求')
    
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
      console.log('开始查询仪表盘数据')
      
      // 获取今天的开始时间（UTC 0点）
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // 获取总用户数
      const totalUsers = await prisma.user.count()
      
      // 获取今日新增用户数
      const newUsersToday = await prisma.user.count({
        where: {
          createdAt: {
            gte: today
          }
        }
      })
      
      // 获取充值统计
      const rechargeTransactions = await prisma.transaction.findMany({
        where: {
          type: '充值'
        }
      }) as Transaction[]
      
      // 计算总充值金额
      const totalRecharge = rechargeTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0)
      
      // 今日充值金额
      const rechargeToday = rechargeTransactions
        .filter((t: Transaction) => new Date(t.createdAt) >= today)
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
      
      // 获取提现统计
      const withdrawTransactions = await prisma.transaction.findMany({
        where: {
          type: '提现'
        }
      }) as Transaction[]
      
      // 计算总提现金额
      const totalWithdraw = withdrawTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0)
      
      // 今日提现金额
      const withdrawToday = withdrawTransactions
        .filter((t: Transaction) => new Date(t.createdAt) >= today)
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0)
      
      // 获取导师数量（假设员工都是导师）
      const totalMentors = await prisma.employee.count()
      
      // 获取活跃导师数量
      const activeMentors = await prisma.employee.count({
        where: {
          isActive: true
        }
      })
      
      // 待处理充值数量
      const pendingRecharges = await prisma.transaction.count({
        where: {
          type: '充值',
          status: 'pending'
        }
      })
      
      // 待处理提现数量
      const pendingWithdraws = await prisma.transaction.count({
        where: {
          type: '提现',
          status: 'pending'
        }
      })
      
      // 获取最近6个月的用户增长数据
      const userGrowthData = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const monthStart = new Date(year, month - 1, 1)
        const monthEnd = new Date(year, month, 0)
        
        const userCount = await prisma.user.count({
          where: {
            createdAt: {
              lte: monthEnd
            }
          }
        })
        
        userGrowthData.push({
          date: `${year}-${month.toString().padStart(2, '0')}`,
          value: userCount
        })
      }
      
      // 获取最近6个月的充值趋势数据
      const rechargeData = []
      for (let i = 5; i >= 0; i--) {
        const date = new Date()
        date.setMonth(date.getMonth() - i)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const monthStart = new Date(year, month - 1, 1)
        const monthEnd = new Date(year, month, 0)
        
        const transactions = await prisma.transaction.findMany({
          where: {
            type: '充值',
            createdAt: {
              lte: monthEnd
            }
          }
        }) as Transaction[]
        
        const totalAmount = transactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0)
        
        rechargeData.push({
          date: `${year}-${month.toString().padStart(2, '0')}`,
          value: totalAmount
        })
      }
      
      // 返回仪表盘数据
      const dashboardData = {
        totalUsers,
        newUsersToday,
        totalRecharge,
        rechargeToday,
        totalWithdraw,
        withdrawToday,
        totalMentors,
        activeMentors,
        pendingRecharges,
        pendingWithdraws,
        userGrowth: userGrowthData,
        rechargeData
      }
      
      console.log('成功获取仪表盘数据')
      
      return NextResponse.json({
        code: 0,
        data: dashboardData,
        message: '获取成功'
      }, {
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*'
        }
      })
    } catch (dbError) {
      console.error('查询仪表盘数据时数据库错误:', dbError)
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
    console.error('获取仪表盘数据失败:', error)
    return NextResponse.json(
      { 
        error: '获取仪表盘数据失败',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  })
} 