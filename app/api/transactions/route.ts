import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAuth } from '@/lib/auth'

// 创建交易记录
export async function POST(request: Request) {
  try {
    // 验证用户登录
    const user = await verifyAuth(request)
    console.log('验证用户结果:', user ? '成功' : '失败')
    
    if (!user) {
      console.log('用户未登录，返回401')
      return NextResponse.json(
        { 
          error: '请先登录', 
          code: 1,
          message: '请先登录'
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

    const { type, amount, method, proof } = await request.json()
    console.log('接收到的交易数据:', { type, amount, method, userId: user.id })

    if (!type || !amount || !method) {
      return NextResponse.json(
        { 
          error: '参数不完整',
          code: 1,
          message: '参数不完整'
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

    // 创建交易记录
    const newTransaction = await prisma.transaction.create({
      data: {
        userId: user.id,
        type,
        amount: parseFloat(amount),
        method,
        status: 'pending',
        remark: `${method}充值`,
        proof: proof || null
      }
    })

    console.log('创建交易记录成功:', newTransaction.id)
    return NextResponse.json({
      code: 0,
      data: newTransaction,
      message: '提交成功'
    }, {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('创建交易记录失败:', error)
    return NextResponse.json(
      { 
        error: '创建交易记录失败',
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

// 获取用户交易记录
export async function GET(request: Request) {
  try {
    // 验证用户登录
    const user = await verifyAuth(request)
    console.log('验证用户结果:', user ? '成功' : '失败')
    
    if (!user) {
      console.log('用户未登录，返回401')
      return NextResponse.json(
        { 
          error: '请先登录', 
          code: 1,
          message: '请先登录' 
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
    const type = searchParams.get('type')
    console.log('查询参数:', { type, userId: user.id })
    
    // 构建查询条件
    const where: any = { userId: user.id }
    if (type) where.type = type

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log('查询到的交易记录数量:', transactions.length)
    return NextResponse.json({
      code: 0,
      data: transactions,
      message: '获取成功'
    }, {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('获取交易记录失败:', error)
    return NextResponse.json(
      { 
        error: '获取交易记录失败',
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    }
  })
} 