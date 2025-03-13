import { PrismaClient } from '@prisma/client'

// 防止开发环境下创建多个实例
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 添加错误处理，在没有数据库连接时提供模拟客户端
let prismaClient: PrismaClient

try {
  prismaClient = globalForPrisma.prisma ?? new PrismaClient()
} catch (error) {
  console.warn('无法连接到数据库，使用模拟客户端', error)
  // 创建一个模拟的Prisma客户端，所有方法都返回空数组或null
  prismaClient = {
    $connect: () => Promise.resolve(),
    $disconnect: () => Promise.resolve(),
    // 添加其他必要的方法
  } as unknown as PrismaClient
}

export const prisma = prismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma 