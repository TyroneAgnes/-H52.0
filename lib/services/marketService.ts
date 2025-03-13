import { prisma } from '../db'

export class MarketService {
  // 更新股票数据
  static async updateMarketData(
    symbol: string,
    name: string,
    market: string,
    price: number,
    change: number,
    changePercent: number,
    volume: number
  ) {
    const isPositive = change >= 0

    return prisma.marketData.upsert({
      where: { symbol },
      update: {
        price,
        change,
        changePercent,
        volume,
        isPositive
      },
      create: {
        symbol,
        name,
        market,
        price,
        change,
        changePercent,
        volume,
        isPositive
      }
    })
  }

  // 更新市场指数
  static async updateMarketIndex(
    title: string,
    value: number,
    change: number,
    changePercent: number
  ) {
    const isPositive = change >= 0

    return prisma.marketIndex.upsert({
      where: { title },
      update: {
        value,
        change,
        changePercent,
        isPositive
      },
      create: {
        title,
        value,
        change,
        changePercent,
        isPositive
      }
    })
  }

  // 获取热门股票
  static async getHotStocks() {
    return prisma.marketData.findMany({
      orderBy: {
        volume: 'desc'
      },
      take: 10
    })
  }

  // 获取市场指数
  static async getMarketIndexes() {
    return prisma.marketIndex.findMany()
  }

  // 获取特定市场的股票
  static async getMarketStocks(market: string) {
    return prisma.marketData.findMany({
      where: { market },
      orderBy: {
        volume: 'desc'
      }
    })
  }

  // 搜索股票
  static async searchStocks(keyword: string) {
    return prisma.marketData.findMany({
      where: {
        OR: [
          { symbol: { contains: keyword, mode: 'insensitive' } },
          { name: { contains: keyword, mode: 'insensitive' } }
        ]
      },
      take: 10
    })
  }
} 