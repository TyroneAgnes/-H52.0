import { prisma } from '../db'
import { hash, compare } from 'bcryptjs'
import { Role } from '@prisma/client'

export class UserService {
  // 创建用户
  static async createUser(username: string, password: string, referralCode?: string) {
    const hashedPassword = await hash(password, 10)
    
    return prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        referralCode,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      }
    })
  }

  // 用户登录
  static async login(username: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    const isValid = await compare(password, user.password)
    if (!isValid) {
      throw new Error('密码错误')
    }

    return user
  }

  // 获取用户信息
  static async getUser(id: string) {
    return prisma.user.findUnique({
      where: { id }
    })
  }

  // 更新用户信息
  static async updateUser(id: string, data: any) {
    return prisma.user.update({
      where: { id },
      data
    })
  }

  // 获取用户列表
  static async getUsers(query: any = {}) {
    return prisma.user.findMany({
      where: query,
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  // 更新用户余额
  static async updateBalance(id: string, amount: number, type: 'add' | 'subtract') {
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    const balance = type === 'add' ? user.balance + amount : user.balance - amount

    return prisma.user.update({
      where: { id },
      data: { balance }
    })
  }

  // 更新用户盈利
  static async updateProfit(id: string, amount: number) {
    return prisma.user.update({
      where: { id },
      data: {
        profit: {
          increment: amount
        }
      }
    })
  }

  // 创建员工账号
  static async createEmployee(managerId: string, data: any) {
    const { username, password, role, permissions } = data
    
    // 创建用户账号
    const user = await this.createUser(username, password)
    
    // 创建员工记录
    return prisma.employee.create({
      data: {
        userId: user.id,
        managerId,
        role,
        permissions,
      },
      include: {
        user: true
      }
    })
  }

  // 获取员工列表
  static async getEmployees(managerId: string) {
    return prisma.employee.findMany({
      where: { managerId },
      include: {
        user: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  // 获取用户资产信息
  static async getUserAssets(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        balance: true,
        starWalletBalance: true,
        starInvestBalance: true,
        totalProfit: true,
        yesterdayProfit: true
      }
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    return {
      totalAssets: user.balance + user.starWalletBalance + user.starInvestBalance,
      ...user
    }
  }

  // 获取用户团队信息
  static async getTeamInfo(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        referees: true
      }
    })

    if (!user) {
      throw new Error('用户不存在')
    }

    return {
      teamCount: user.teamCount,
      directCount: user.directCount,
      teamProfit: user.teamProfit,
      teamPerformance: user.teamPerformance,
      referees: user.referees
    }
  }

  // 更新用户 token
  static async updateUserToken(userId: string, token: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { token }
    })
  }
} 