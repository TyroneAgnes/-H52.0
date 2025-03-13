import { create } from 'zustand'

interface StoreState {
  // 用户余额
  userBalance: number
  // 星钱包余额
  starWalletBalance: number
  // 星投资金
  starInvestBalance: number
  // 交易记录
  tradeRecords: any[]
  // 获取昨日总收益
  getYesterdayTotalProfit: () => number
  // 计算总资产
  calculateTotalAssets: () => number
  // 获取星投累计收益
  getStarInvestTotalProfit: () => number
  // 获取收益概览
  getProfitOverview: () => { totalProfit: string, profitRate: string }
  // 获取星投历史记录
  getStarInvestHistory: () => any[]
  // 登出
  logout: () => void
}

const useStore = create<StoreState>((set, get) => ({
  // 初始化所有余额为 0
  userBalance: 0,
  starWalletBalance: 0,
  starInvestBalance: 0,
  tradeRecords: [],

  // 获取昨日总收益
  getYesterdayTotalProfit: () => {
    return 0
  },

  // 计算总资产
  calculateTotalAssets: () => {
    const { userBalance, starWalletBalance, starInvestBalance } = get()
    return userBalance + starWalletBalance + starInvestBalance
  },

  // 获取星投累计收益
  getStarInvestTotalProfit: () => {
    return 0
  },

  // 获取收益概览
  getProfitOverview: () => {
    return {
      totalProfit: "0",
      profitRate: "0"
    }
  },

  // 获取星投历史记录
  getStarInvestHistory: () => {
    return []
  },

  // 登出时重置所有数据
  logout: () => {
    set({
      userBalance: 0,
      starWalletBalance: 0,
      starInvestBalance: 0,
      tradeRecords: []
    })
  }
}))

export default useStore 