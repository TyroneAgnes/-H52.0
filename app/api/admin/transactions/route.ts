import { NextResponse } from 'next/server'
import { TransactionService } from '@/lib/services/transactionService'
import { verifyAdmin } from '@/lib/auth'
import { ADMIN_TOKEN_NAME } from '@/lib/constants'

// 获取交易记录列表
export async function GET(request: Request) {
  try {
    console.log('开始处理管理员交易请求')
    
    // 记录cookie和认证信息
    const cookieHeader = request.headers.get('Cookie')
    console.log('Cookie信息:', cookieHeader || '无cookie')
    
    const adminTokenCookie = cookieHeader?.split('; ').find(row => row.startsWith(`${ADMIN_TOKEN_NAME}=`))
    console.log('管理员Token:', adminTokenCookie ? '存在' : '不存在')
    
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
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    
    // 构建查询条件
    const query: any = {}
    if (type) query.type = type
    if (status) query.status = status

    try {
      console.log('开始查询交易记录:', query)
      const transactions = await TransactionService.getTransactions(query)
      console.log('查询到交易记录数量:', transactions.length)
      
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
    } catch (dbError) {
      console.error('查询交易记录时数据库错误:', dbError)
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

// 审核交易
export async function POST(request: Request) {
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

    const { id, status, remark } = await request.json()

    if (!id || !status) {
      return NextResponse.json(
        { 
          error: '参数不完整',
          code: 1,
          message: '请提供完整的参数'
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

    const transaction = await TransactionService.reviewTransaction(id, status, remark)

    return NextResponse.json({
      code: 0,
      data: transaction,
      message: '审核成功'
    }, {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('审核交易失败:', error)
    return NextResponse.json(
      { 
        error: '审核交易失败',
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