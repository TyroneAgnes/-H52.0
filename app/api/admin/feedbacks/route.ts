import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyAdmin } from '@/lib/auth'
import { Feedback, Reply } from '@prisma/client'

// 获取反馈列表
export async function GET(request: Request) {
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

    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: {
          select: {
            username: true
          }
        },
        replies: {
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // 格式化数据
    const formattedFeedbacks = feedbacks.map((feedback: any) => ({
      id: feedback.id,
      userId: feedback.userId,
      username: feedback.user.username,
      type: feedback.type,
      content: feedback.content,
      status: feedback.status,
      createTime: feedback.createdAt.toLocaleString(),
      lastReplyTime: feedback.updatedAt.toLocaleString(),
      replies: feedback.replies.map((reply: any) => ({
        id: reply.id,
        content: reply.content,
        isStaff: reply.isStaff,
        createdAt: reply.createdAt.toLocaleString()
      }))
    }))
    
    return NextResponse.json({
      code: 0,
      data: formattedFeedbacks,
      message: '获取成功'
    }, {
      headers: {
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Origin': '*'
      }
    })
  } catch (error) {
    console.error('获取反馈列表失败:', error)
    return NextResponse.json(
      { 
        error: '获取反馈列表失败',
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