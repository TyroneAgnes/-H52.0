import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'

// 回复反馈
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

    const { feedbackId, content } = await request.json()

    if (!feedbackId || !content) {
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

    // 创建回复
    const reply = await prisma.reply.create({
      data: {
        feedbackId,
        content,
        isStaff: true,
      }
    })

    // 更新反馈状态
    await prisma.feedback.update({
      where: { id: feedbackId },
      data: {
        status: 'processing'
      }
    })

    return NextResponse.json({
      code: 0,
      data: reply,
      message: '回复成功'
    }, {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('回复反馈失败:', error)
    return NextResponse.json(
      { 
        error: '回复反馈失败',
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