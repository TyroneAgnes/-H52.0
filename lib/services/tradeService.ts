import { prisma } from '../db'

export class TradeService {
  // 创建交易记录
  static async createTrade(
    userId: string,
    type: 'buy' | 'sell',
    symbol: string,
    price: number,
    amount: number,
    mentorId?: string,
    mentorName?: string
  ) {
    const total = price * amount

    return prisma.transaction.create({
      data: {
        userId,
        type,
        amount: total,
        method: symbol,
        status: 'pending',
        remark: `${type === 'buy' ? '买入' : '卖出'} ${symbol}`
      }
    })
  }

  // 完成交易
  static async completeTrade(
    tradeId: string,
    returnAmount: number,
    returnRate: number
  ) {
    return prisma.transaction.update({
      where: { id: tradeId },
      data: {
        status: 'completed',
        amount: returnAmount,
        remark: `收益率: ${returnRate}%`
      }
    })
  }

  // 获取用户交易记录
  static async getUserTrades(userId: string) {
    return prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })
  }

  // 获取导师交易记录
  static async getMentorTrades(mentorId: string) {
    return prisma.transaction.findMany({
      where: { 
        userId: mentorId,
        type: {
          in: ['buy', 'sell']
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
} 