import { NextResponse } from 'next/server'
import { TransactionService } from '@/lib/services/transactionService'
import { verifyAuth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      )
    }

    const {
      type,
      symbol,
      price,
      amount
    } = await request.json()

    if (!type || !symbol || !price || !amount) {
      return NextResponse.json(
        { error: '交易参数不完整' },
        { status: 400 }
      )
    }

    const total = price * amount
    const trade = await TransactionService.createTransaction({
      userId: user.id,
      type,
      amount: total,
      method: symbol,
      remark: `${type === 'buy' ? '买入' : '卖出'} ${symbol}`
    })

    return NextResponse.json({
      message: '创建交易成功',
      trade
    })
  } catch (error) {
    console.error('创建交易失败:', error)
    return NextResponse.json(
      { error: '创建交易失败，请稍后重试' },
      { status: 500 }
    )
  }
} 