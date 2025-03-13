import { NextResponse } from 'next/server'
import { MarketService } from '@/lib/services/marketService'

export async function GET() {
  try {
    const hotStocks = await MarketService.getHotStocks()
    return NextResponse.json(hotStocks)
  } catch (error) {
    console.error('获取热门股票失败:', error)
    return NextResponse.json(
      { error: '获取热门股票失败，请稍后重试' },
      { status: 500 }
    )
  }
} 