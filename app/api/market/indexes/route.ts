import { NextResponse } from 'next/server'
import { MarketService } from '@/lib/services/marketService'

export async function GET() {
  try {
    const indexes = await MarketService.getMarketIndexes()
    return NextResponse.json(indexes)
  } catch (error) {
    console.error('获取市场指数失败:', error)
    return NextResponse.json(
      { error: '获取市场指数失败，请稍后重试' },
      { status: 500 }
    )
  }
} 