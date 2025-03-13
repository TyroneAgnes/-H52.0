import { prisma } from '../db'
import { UserService } from './userService'

export class TransactionService {
  // 创建交易记录
  static async createTransaction(data: {
    userId: string
    type: string
    amount: number
    method: string
    remark?: string
  }) {
    const { userId, type, amount, method, remark } = data

    // 创建交易记录
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        type,
        amount,
        method,
        status: 'pending',
        remark
      }
    })

    return transaction
  }

  // 审核交易
  static async reviewTransaction(id: string, status: 'approved' | 'rejected', remark?: string) {
    const transaction = await prisma.transaction.findUnique({
      where: { id }
    })

    if (!transaction) {
      throw new Error('交易记录不存在')
    }

    // 如果是充值且审核通过,更新用户余额（USDT转换为人民币）
    if (status === 'approved' && transaction.type === '充值') {
      const USDT_RATE = 7.4 // USDT 兑人民币汇率
      const cnyAmount = transaction.amount * USDT_RATE
      await UserService.updateBalance(transaction.userId, cnyAmount, 'add')
    }

    // 如果是提现且审核通过,扣减用户余额
    if (status === 'approved' && transaction.type === '提现') {
      await UserService.updateBalance(transaction.userId, transaction.amount, 'subtract')
    }

    // 更新交易状态
    return prisma.transaction.update({
      where: { id },
      data: {
        status,
        remark: remark || transaction.remark
      }
    })
  }

  // 获取交易记录列表
  static async getTransactions(query: any = {}) {
    try {
      console.log('TransactionService.getTransactions - 查询条件:', JSON.stringify(query))
      
      // 使用transaction表
      const result = await prisma.transaction.findMany({
        where: query,
        include: {
          user: {
            select: {
              username: true,
              nickname: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      console.log(`查询到 ${result.length} 条交易记录`);
      return result;
    } catch (error) {
      console.error('TransactionService.getTransactions - 查询失败:', error)
      
      // 返回空数组而不是抛出错误，确保API不会崩溃
      console.log('返回空数组作为备用结果')
      return []
    }
  }

  // 获取用户交易记录
  static async getUserTransactions(userId: string) {
    return this.getTransactions({ userId })
  }

  // 获取待审核交易
  static async getPendingTransactions() {
    return this.getTransactions({ status: 'pending' })
  }
} 