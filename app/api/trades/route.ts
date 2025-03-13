import { NextResponse } from "next/server"
import { headers } from "next/headers"
import type { TradeRecord } from "@/lib/store"

// 模拟交易记录
const mockTradeRecords: TradeRecord[] = [
  {
    id: "1",
    type: "buy",
    symbol: "BTC/USDT",
    price: 65000,
    amount: 0.1,
    total: 6500,
    status: "completed",
    createTime: "2024-03-10T10:00:00Z",
  },
  {
    id: "2",
    type: "sell",
    symbol: "ETH/USDT",
    price: 3500,
    amount: 1,
    total: 3500,
    status: "completed",
    createTime: "2024-03-10T09:30:00Z",
  },
]

export async function GET() {
  try {
    const headersList = headers()
    const authorization = headersList.get("Authorization")
    const token = authorization?.split(" ")[1]

    if (!token) {
      return NextResponse.json({
        code: 1,
        message: "未登录"
      }, { status: 401 })
    }

    return NextResponse.json({
      code: 0,
      data: mockTradeRecords,
      message: "获取成功"
    })
  } catch (error) {
    console.error("获取交易记录失败:", error)
    return NextResponse.json({
      code: 1,
      message: "服务器错误"
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const headersList = headers()
    const authorization = headersList.get("Authorization")
    const token = authorization?.split(" ")[1]

    if (!token) {
      return NextResponse.json({
        code: 1,
        message: "未登录"
      }, { status: 401 })
    }

    const body = await request.json()
    const { type, symbol, price, amount } = body

    const newTrade: TradeRecord = {
      id: Date.now().toString(),
      type,
      symbol,
      price,
      amount,
      total: price * amount,
      status: "completed",
      createTime: new Date().toISOString(),
    }

    // 在实际应用中，这里会将交易记录保存到数据库
    mockTradeRecords.unshift(newTrade)

    return NextResponse.json({
      code: 0,
      data: newTrade,
      message: "交易成功"
    })
  } catch (error) {
    console.error("创建交易记录失败:", error)
    return NextResponse.json({
      code: 1,
      message: "服务器错误"
    }, { status: 500 })
  }
} 