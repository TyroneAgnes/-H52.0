import { create } from "zustand"
import { persist } from "zustand/middleware"
import { calculateStarInvestReturn, calculateStarWalletReturn, shouldReturnProfit } from "./utils"

export interface UserInfo {
  id: string           // 用户唯一ID
  username: string     // 用户名（登录账号）
  nickname: string     // 用户昵称（显示名称）
  password: string     // 密码
  inviteCode: string   // 用户的推荐码
  referralCode?: string // 用户注册时填写的推荐人码
  referrer?: string    // 推荐人ID
  referees: string[]   // 被推荐人ID列表
  token: string
  balance: string      // 余额
  baseDeposit: string  // 底仓（不可提现的充值金额）
  starWalletBalance: string  // 星钱包余额
  starInvestBalance: string  // 星投资金
  vipLevel: number     // 代理等级（1-普通代理）
  vipName: string      // 代理级别名称
  teamCount: number    // 团队总人数
  directCount: number  // 直推人数
  teamProfit: string   // 团队总收益
  totalProfit: string  // 总收益
  yesterdayProfit: string  // 昨日收益
  starInvestProfit: string // 星投收益
  starWalletProfit: string // 星钱包收益
  avatar: string       // 头像URL
  createTime: string
  isFirstLogin: boolean // 添加首次登录标记
  commission: string     // 未提现的佣金
  teamPerformance: string // 团队业绩（任务获取资金总和）
  completedTasks: Task[] // 已完成的任务
  currentTasks: Task[]   // 当前进行中的任务
  taskHistory: {         // 任务历史记录
    taskId: string
    type: Task['type']
    completeTime: string
    reward: number
  }[]
}

export interface MarketData {
  symbol: string        // 股票代码
  name: string         // 股票名称
  market: string       // 市场类型（港股/美股/期货/日股）
  price: number        // 当前价格
  change: number       // 价格变动
  changePercent: number // 涨跌幅
  volume: number       // 成交量
  isPositive: boolean  // 是否上涨
  updateTime: string   // 更新时间
}

// 市场指数数据
export interface MarketIndex {
  title: string        // 指数名称
  value: number        // 指数值
  change: number       // 变动点数
  changePercent: number // 变动百分比
  isPositive: boolean  // 是否上涨
  updateTime: string   // 更新时间
}

// 导师交易记录类型定义
interface MentorTrade {
  time: string
  stockCode: string
  stockName: string
  type: "buy" | "sell"  // 更新为与 TradeRecord 一致的类型
  price: number
  volume: number
  profit?: number
  profitRate?: string
}

// 扩展TradeRecord接口
interface TradeRecord {
  id: string
  type: "buy" | "sell" | "deposit" | "withdraw"  // 更新交易类型
  symbol: string
  price: number
  amount: number
  total: number
  status: "pending" | "completed" | "cancelled"
  createTime: string
  returnTime?: string
  returnAmount?: number
  mentorReturn?: number
  mentorId?: string
  mentorName?: string
  mentorTrades?: MentorTrade[]
  returnRate?: number
}

export interface Task {
  id: string
  type: 'weekly' | 'fiveStars' | 'threeDay' | 'sevenDay' | 'fifteenDay' | 'thirtyDay'
  status: 'pending' | 'completed' | 'expired'
  createTime: string
  completeTime?: string
  reward: number
  requirements: {
    inviteCount: number
    minDeposit: number
    timeLimit: number // 天数
  }
}

// 充值记录状态
export type RechargeStatus = "pending" | "approved" | "rejected"

// 充值记录接口
export interface RechargeRecord {
  id: string
  userId: string
  amount: number
  imageUrl: string
  status: RechargeStatus
  createTime: string
  approveTime?: string
  rejectReason?: string
}

interface StoreState {
  // 用户相关
  userInfo: UserInfo | null
  isLoading: boolean
  userBalance: number        // 余额钱包
  starWalletBalance: number  // 星钱包余额
  starInvestBalance: number  // 星投资金
  totalAssets: number       // 总资产
  registeredUsers: UserInfo[]  // 添加注册用户列表
  setUserInfo: (info: UserInfo | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
  setUserBalance: (balance: number) => void
  setStarWalletBalance: (balance: number) => void  // 星钱包余额设置器
  setStarInvestBalance: (balance: number) => void  // 星投资金设置器
  clearUserInfo: () => void
  // 账号相关功能
  register: (username: string, password: string, referralCode: string) => Promise<boolean>
  login: (username: string, password: string) => Promise<boolean>
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>
  // 生成唯一ID和推荐码
  generateUniqueId: () => string
  generateUniqueInviteCode: () => string

  // 市场数据
  marketList: MarketData[]
  setMarketList: (list: MarketData[]) => void
  updateMarketPrice: (symbol: string, price: number, change: number) => void

  // 交易记录
  tradeRecords: TradeRecord[]
  setTradeRecords: (records: TradeRecord[]) => void
  addTradeRecord: (record: TradeRecord) => void
  processReturns: () => void

  // 系统配置
  theme: "light" | "dark"
  toggleTheme: () => void

  // 添加任务完成后的团队收益更新函数
  updateTeamProfit: (amount: number) => void

  // 计算总资产
  calculateTotalAssets: () => number  // 计算总资产的函数

  // 添加收益相关函数
  getYesterdayTotalProfit: () => string    // 昨日总收益（星投+星钱包）
  getStarInvestTotalProfit: () => string   // 星投累计收益
  getTodayStarWalletProfit: () => string   // 今日星钱包收益（10点结算）
  getDailyProfitCurve: () => {             // 收益曲线数据（星投+星钱包）
    date: string
    profit: number
  }[]

  // 任务相关函数
  submitWeeklyTask: () => Promise<boolean>
  submitFiveStarsTask: () => Promise<boolean>
  submitThreeDayTask: () => Promise<boolean>
  submitSevenDayTask: () => Promise<boolean>
  submitFifteenDayTask: () => Promise<boolean>
  submitThirtyDayTask: () => Promise<boolean>
  checkTaskEligibility: () => void
  getTaskProgress: (taskType: Task['type']) => {
    completed: number
    required: number
    timeLeft: number // 剩余天数
  }
  withdrawCommission: (amount: number) => Promise<boolean>

  // 充值记录相关
  rechargeRecords: RechargeRecord[]
  submitRecharge: (amount: number, imageUrl: string) => Promise<boolean>
  approveRecharge: (recordId: string) => Promise<boolean>
  rejectRecharge: (recordId: string, reason: string) => Promise<boolean>
  getUserRechargeRecords: () => RechargeRecord[]

  // 添加获取可提现余额的函数
  getWithdrawableBalance: () => number

  // 获取收益概览数据
  getProfitOverview: () => {
    totalProfit: string
    profitRate: string
  }

  // 获取星投历史记录
  getStarInvestHistory: () => {
    date: string
    mentorName: string
    amount: string
    profit: string
    profitRate: string
    mentorTrades: MentorTrade[]
  }[]

  // 获取当月星投统计数据
  getCurrentMonthStarInvestStats: () => {
    totalProfit: string
    averageRate: string
  }
}

// 代理等级定义
export const AgentLevels = {
  NORMAL: { name: "普通代理", directCount: 0, teamCount: 0 },  // 添加普通代理等级
  WHITE_SHEEP: { name: "白羊座", directCount: 0, teamCount: 2 },
  GOLDEN_BULL: { name: "金牛座", directCount: 3, teamCount: 3 },
  GEMINI: { name: "巨蟹座", directCount: 5, teamCount: 10 },
  CANCER: { name: "狮子座", directCount: 6, teamCount: 30 },
  VIRGO: { name: "处女座", directCount: 7, teamCount: 100 },
  LIBRA: { name: "天秤座", directCount: 8, teamCount: 300 },
  SCORPIO: { name: "天蝎座", directCount: 10, teamCount: 1000 },
  SAGITTARIUS: { name: "射手座", directCount: 12, teamCount: 3000 },
  CAPRICORN: { name: "摩羯座", directCount: 15, teamCount: 10000 },
  AQUARIUS: { name: "水瓶座", directCount: 20, teamCount: 20000 },
  PISCES: { name: "双鱼座", directCount: 30, teamCount: 50000 },
  TEACHER: { name: "双子座(教皇)", directCount: 40, teamCount: 80000 }
}

// 获取下一个等级信息
export const getNextLevel = (currentLevel: string): { name: string, directNeeded: number, teamNeeded: number } | null => {
  const levels = Object.values(AgentLevels)
  const currentIndex = levels.findIndex(level => level.name === currentLevel)
  
  if (currentIndex === -1 || currentIndex === levels.length - 1) {
    return null // 已经是最高等级
  }

  const nextLevel = levels[currentIndex + 1]
  return {
    name: nextLevel.name,
    directNeeded: nextLevel.directCount,
    teamNeeded: nextLevel.teamCount
  }
}

// 获取升级还需要的人数
export const getUpgradeNeeds = (userInfo: UserInfo): { directNeeded: number, teamNeeded: number } | null => {
  const nextLevel = getNextLevel(userInfo.vipName)
  if (!nextLevel) return null

  return {
    directNeeded: Math.max(0, nextLevel.directNeeded - userInfo.directCount),
    teamNeeded: Math.max(0, nextLevel.teamNeeded - userInfo.teamCount)
  }
}

// 检查并更新用户等级
const checkAndUpdateLevel = (userInfo: UserInfo): UserInfo => {
  let highestLevel = AgentLevels.NORMAL // 从普通代理开始检查
  
  // 遍历所有等级，找到用户符合条件的最高等级
  Object.values(AgentLevels).forEach(level => {
    if (userInfo.directCount >= level.directCount && userInfo.teamCount >= level.teamCount) {
      if (level.directCount >= highestLevel.directCount && level.teamCount >= highestLevel.teamCount) {
        highestLevel = level
      }
    }
  })

  // 如果等级发生变化，更新用户信息
  if (userInfo.vipName !== highestLevel.name) {
    return {
      ...userInfo,
      vipName: highestLevel.name,
      vipLevel: Object.values(AgentLevels).findIndex(l => l.name === highestLevel.name) + 1
    }
  }

  return userInfo
}

// 递归计算用户的团队人数
const calculateTeamCount = (userId: string, users: UserInfo[]): number => {
  const user = users.find(u => u.id === userId)
  if (!user) return 0
  
  let teamCount = 0
  // 遍历直推用户
  user.referees.forEach(refereeId => {
    // 直推用户算一个团队成员
    teamCount += 1
    // 递归计算直推用户的团队人数
    teamCount += calculateTeamCount(refereeId, users)
  })
  
  return teamCount
}

// 更新用户的团队人数
const updateTeamCounts = (users: UserInfo[]): UserInfo[] => {
  return users.map(user => ({
    ...user,
    teamCount: calculateTeamCount(user.id, users)
  }))
}

// 添加获取导师操作记录的函数
const getMentorTrades = (mentorId: string, date: string): TradeRecord['mentorTrades'] => {
  // 这里应该从导师详情页面获取数据
  // 目前使用模拟数据，实际实现时需要从导师详情同步
  return [
    {
      time: `${date} 09:30:00`,
      type: "buy",
      stockCode: "600519",
      stockName: "贵州茅台",
      price: 1800.00,
      volume: 100,
      profit: 0,
      profitRate: "0"
    },
    {
      time: `${date} 14:30:00`,
      type: "sell",
      stockCode: "600519",
      stockName: "贵州茅台",
      price: 1830.00,
      volume: 100,
      profit: 3000,
      profitRate: "1.67"
    }
  ]
}

// 任务配置
const TaskConfigs = {
  weekly: {
    reward: 0, // 无固定奖励
    requirements: {
      inviteCount: 1,
      minDeposit: 10000,  // 修改最低充值要求
      timeLimit: 7 // 自然周
    }
  },
  fiveStars: {
    reward: 2888,
    requirements: {
      inviteCount: 5,
      minDeposit: 10000,  // 修改最低充值要求
      timeLimit: 0 // 无时间限制
    }
  },
  threeDay: {
    reward: 428,
    requirements: {
      inviteCount: 1,
      minDeposit: 10000,  // 修改最低充值要求
      timeLimit: 3
    }
  },
  sevenDay: {
    reward: 728,
    requirements: {
      inviteCount: 5,
      minDeposit: 10000,  // 修改最低充值要求
      timeLimit: 7
    }
  },
  fifteenDay: {
    reward: 2188,
    requirements: {
      inviteCount: 15,
      minDeposit: 10000,  // 修改最低充值要求
      timeLimit: 15
    }
  },
  thirtyDay: {
    reward: 4288,
    requirements: {
      inviteCount: 30,
      minDeposit: 10000,  // 修改最低充值要求
      timeLimit: 30
    }
  }
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => {
      // 创建初始状态对象
      const initialState = {
        userInfo: null,
        isLoading: false,
        userBalance: 0,
        starWalletBalance: 0,
        starInvestBalance: 0,
        totalAssets: 0,
        marketList: [],
        tradeRecords: [],
        theme: "light" as const,
        registeredUsers: [{
          id: "ADMIN",
          username: "admin",
          nickname: "管理员",
          password: "admin888",
          inviteCode: "XC888888",
          referees: [],
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBRE1JTiIsInVzZXJuYW1lIjoiYWRtaW4iLCJ2aXBMZXZlbCI6OX0.c2lnbmF0dXJl", // 预生成的JWT格式token
          balance: "200000",
          baseDeposit: "0",
          starWalletBalance: "200000",
          starInvestBalance: "200000",
          vipLevel: 9,
          vipName: "超级管理员",
          teamCount: 0,
          directCount: 0,
          teamProfit: "0",
          totalProfit: "0",
          yesterdayProfit: "0",
          starInvestProfit: "0",
          starWalletProfit: "0",
          avatar: "/avatars/admin.jpg",
          createTime: new Date().toISOString(),
          isFirstLogin: true,
          commission: "0",
          teamPerformance: "0",
          completedTasks: [],
          currentTasks: [],
          taskHistory: []
        }],
        rechargeRecords: []
      }

      return {
        ...initialState,
        
        setUserInfo: (info) => set({ userInfo: info }),
        setLoading: (loading) => set({ isLoading: loading }),
        
        logout: () => {
          // 清除cookie
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
          
          // 保存当前状态到 localStorage
          const currentState = get()
          const stateToSave = {
            userInfo: currentState.userInfo,
            userBalance: currentState.userBalance,
            starWalletBalance: currentState.starWalletBalance,
            starInvestBalance: currentState.starInvestBalance,
            tradeRecords: currentState.tradeRecords
          }
          localStorage.setItem('userState', JSON.stringify(stateToSave))

          // 只清除登录状态
          set({
            userInfo: null,
            isLoading: false
          })

          // 重定向到登录页
          if (typeof window !== 'undefined') {
            window.location.href = '/login'
          }
        },

        login: async (username: string, password: string) => {
          try {
            // 调用后端 API 进行登录
            const response = await fetch('/api/auth/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username,
                password
              })
            })

            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.error || '登录失败')
            }

            const data = await response.json()
            
            // 尝试恢复之前保存的状态
            let savedState = null
            try {
              const savedStateStr = localStorage.getItem('userState')
              if (savedStateStr) {
                savedState = JSON.parse(savedStateStr)
              }
            } catch (e) {
              console.error('恢复状态失败:', e)
            }
            
            // 更新状态，优先使用保存的状态
            set({
              userInfo: data.user,
              userBalance: savedState?.userBalance ?? parseFloat(data.user.balance || "0"),
              starWalletBalance: savedState?.starWalletBalance ?? parseFloat(data.user.starWalletBalance || "0"),
              starInvestBalance: savedState?.starInvestBalance ?? parseFloat(data.user.starInvestBalance || "0"),
              tradeRecords: savedState?.tradeRecords ?? []
            })

            // 清除所有旧的认证相关cookie
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            document.cookie = "admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
            
            // 设置新的token cookie
            document.cookie = `token=${data.user.token}; path=/; max-age=86400`
            
            return true
          } catch (error) {
            console.error('登录失败:', error)
            return false
          }
        },

        register: async (username: string, password: string, referralCode: string) => {
          try {
            // 调用后端 API 进行注册
            const response = await fetch('/api/auth/register', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username,
                password,
                referralCode
              })
            })

            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.error || '注册失败')
            }

            const data = await response.json()
            
            // 注册成功后，更新本地状态
            const newUser: UserInfo = {
              id: data.user.id,
              username: data.user.username,
              nickname: username,  // 使用用户名作为默认昵称
              password: password,  // 添加密码
              inviteCode: data.user.inviteCode,
              referralCode,
              referees: [],  // 添加空的推荐人列表
              token: "",
              balance: "0",
              baseDeposit: "0",
              starWalletBalance: "0",
              starInvestBalance: "0",
              vipLevel: 1,
              vipName: "普通代理",
              teamCount: 0,
              directCount: 0,
              teamProfit: "0",
              totalProfit: "0",
              yesterdayProfit: "0",
              starInvestProfit: "0",
              starWalletProfit: "0",
              avatar: "/avatars/default.png",
              createTime: new Date().toISOString(),
              isFirstLogin: true,
              commission: "0",
              teamPerformance: "0",
              completedTasks: [],
              currentTasks: [],
              taskHistory: []
            }

            set({
              ...get(),
              userInfo: newUser,
              userBalance: 0,
              starWalletBalance: 0,
              starInvestBalance: 0
            })

            return true
          } catch (error) {
            console.error('注册失败:', error)
            return false
          }
        },

        // 修改密码功能
        changePassword: async (oldPassword: string, newPassword: string) => {
          const state = get()
          if (!state.userInfo) return false

          // 验证旧密码
          if (state.userInfo.password !== oldPassword) {
            return false
          }

          // 验证新密码长度
          if (newPassword.length < 8 || newPassword.length > 20) {
            return false
          }

          // 更新密码
          const updatedUser = {
            ...state.userInfo,
            password: newPassword
          }

          // 更新用户信息和注册用户列表
          set(state => ({
            userInfo: updatedUser,
            registeredUsers: state.registeredUsers.map(user =>
              user.id === updatedUser.id ? updatedUser : user
            )
          }))

          return true
        },

        setUserBalance: (balance) => set({ userBalance: balance }),
        setStarWalletBalance: (balance) => set({ starWalletBalance: balance }),
        setStarInvestBalance: (balance) => set({ starInvestBalance: balance }),
        clearUserInfo: () => set({ userInfo: null }),

        // 市场数据
        marketList: [],
        setMarketList: (list) => set({ marketList: list }),
        updateMarketPrice: (symbol, price, change) =>
          set((state) => ({
            marketList: state.marketList.map((item) =>
              item.symbol === symbol ? { ...item, price, change } : item
            ),
          })),

        // 交易记录
        tradeRecords: [],
        setTradeRecords: (records) => set({ tradeRecords: records }),
        addTradeRecord: (record) => {
          // 根据交易类型计算返还时间和金额
          let returnInfo = null
          let returnRate = 0

          if (record.symbol.startsWith('星投-')) {
            // 计算收益率（0.8% - 1.5%之间随机）
            returnRate = 0.8 + Math.random() * 0.7
            returnInfo = calculateStarInvestReturn(record.total, record.mentorReturn || 0)
            
            // 获取导师当日交易记录
            const mentorTrades = record.mentorId ? 
              getMentorTrades(record.mentorId, new Date().toISOString().split('T')[0]) : 
              []

            record = {
              ...record,
              returnRate,
              mentorTrades,
              status: 'completed'
            }
          } else if (record.symbol.startsWith('星钱包-')) {
            // 固定收益率1.2%
            returnRate = 1.2
            const returnAmount = record.total * (returnRate / 100)
            const returnTime = new Date()
            returnTime.setHours(10, 0, 0, 0)
            returnTime.setDate(returnTime.getDate() + 1)

            returnInfo = {
              returnTime,
              returnAmount,
              returnRate
            }

            record = {
              ...record,
              returnRate,
              status: 'completed'
            }
          }

          const newRecord = {
            ...record,
            returnTime: returnInfo?.returnTime?.toISOString() || record.returnTime,
            returnAmount: returnInfo?.returnAmount || record.returnAmount,
            createTime: record.createTime || new Date().toISOString()
          }

          set((state) => ({
            tradeRecords: [newRecord, ...state.tradeRecords],
          }))

          // 更新相关余额
          set((state) => {
            const userInfo = state.userInfo
            if (!userInfo) return state

            let newUserBalance = state.userBalance
            let newStarWalletBalance = state.starWalletBalance
            let newStarInvestBalance = state.starInvestBalance

            if (record.symbol.startsWith('星投-')) {
              newStarInvestBalance += record.total
              newUserBalance -= record.total
            } else if (record.symbol.startsWith('星钱包-')) {
              newStarWalletBalance += record.total
              newUserBalance -= record.total
            }

            return {
              userBalance: newUserBalance,
              starWalletBalance: newStarWalletBalance,
              starInvestBalance: newStarInvestBalance,
              userInfo: {
                ...userInfo,
                balance: newUserBalance.toFixed(2),
                starWalletBalance: newStarWalletBalance.toFixed(2),
                starInvestBalance: newStarInvestBalance.toFixed(2)
              }
            }
          })
        },

        // 计算总资产
        calculateTotalAssets: () => {
          const state = get()
          return state.userBalance + state.starWalletBalance + state.starInvestBalance
        },

        // 获取昨日总收益（星投+星钱包）
        getYesterdayTotalProfit: () => {
          const state = get()
          if (!state.userInfo) return "0"
          return state.userInfo.yesterdayProfit
        },

        // 获取星投累计收益
        getStarInvestTotalProfit: () => {
          const state = get()
          if (!state.userInfo) return "0"
          return state.userInfo.starInvestProfit
        },

        // 获取今日星钱包收益
        getTodayStarWalletProfit: () => {
          const state = get()
          const now = new Date()
          const today = now.toISOString().split('T')[0]
          
          // 只统计今天10点结算的收益
          return state.tradeRecords
            .filter(record => {
              if (!record.returnTime) return false
              const returnDate = new Date(record.returnTime)
              const recordDate = returnDate.toISOString().split('T')[0]
              return recordDate === today && 
                     record.symbol.startsWith('星钱包-') &&
                     returnDate.getHours() === 10
            })
            .reduce((sum, record) => sum + (record.returnAmount || 0), 0)
            .toFixed(2)
        },

        // 获取收益曲线数据
        getDailyProfitCurve: () => {
          const state = get()
          const profitMap = new Map<string, number>()

          // 统计每日收益
          state.tradeRecords
            .filter(record => record.returnAmount && record.returnTime)
            .forEach(record => {
              const date = new Date(record.returnTime!).toISOString().split('T')[0]
              const currentProfit = profitMap.get(date) || 0
              profitMap.set(date, currentProfit + record.returnAmount!)
            })

          // 转换为数组并排序
          return Array.from(profitMap.entries())
            .map(([date, profit]) => ({ date, profit }))
            .sort((a, b) => a.date.localeCompare(b.date))
        },

        // 处理收益返还
        processReturns: () => {
          const state = get()
          const now = new Date()
          const yesterday = new Date(now)
          yesterday.setDate(yesterday.getDate() - 1)
          
          // 检查所有待返还的交易记录
          state.tradeRecords.forEach((record) => {
            if (
              record.status === "completed" &&
              record.returnTime &&
              record.returnAmount &&
              shouldReturnProfit(record.createTime, new Date(record.returnTime))
            ) {
              const returnDate = new Date(record.returnTime)
              const isYesterdayReturn = returnDate.getDate() === yesterday.getDate() &&
                                      returnDate.getMonth() === yesterday.getMonth() &&
                                      returnDate.getFullYear() === yesterday.getFullYear()

              // 更新用户余额和收益
              set((state) => {
                const userInfo = state.userInfo
                if (!userInfo) return state

                let newStarInvestProfit = parseFloat(userInfo.starInvestProfit)
                let newStarWalletProfit = parseFloat(userInfo.starWalletProfit)
                let newYesterdayProfit = parseFloat(userInfo.yesterdayProfit)
                let newUserBalance = state.userBalance
                let newStarWalletBalance = state.starWalletBalance
                let newStarInvestBalance = state.starInvestBalance

                // 更新星投收益：本金和收益都转入余额钱包
                if (record.symbol.startsWith('星投-')) {
                  newStarInvestProfit += record.returnAmount! // 累计星投收益
                  newUserBalance += (record.total + record.returnAmount!) // 本金 + 收益
                  newStarInvestBalance -= record.total // 减少星投资金
                  if (isYesterdayReturn) {
                    newYesterdayProfit += record.returnAmount! // 更新昨日总收益
                  }

                  // 获取导师当日操作记录
                  const mentorTrades = record.mentorId ? 
                    getMentorTrades(record.mentorId, record.createTime.split('T')[0]) : 
                    []

                  // 创建新的交易记录
                  const newRecord: TradeRecord = {
                    id: `return-${record.id}`,
                    type: "sell",
                    symbol: record.symbol.replace("买入", "返还"),
                    price: record.price,
                    amount: record.amount,
                    total: record.returnAmount!,
                    status: "completed",
                    createTime: record.createTime,  // 使用原始购买时间
                    returnTime: now.toISOString(),  // 实际返还时间
                    mentorId: record.mentorId,
                    mentorName: record.mentorName,
                    mentorTrades: mentorTrades      // 添加导师操作记录
                  }

                  return {
                    userBalance: newUserBalance,
                    starWalletBalance: newStarWalletBalance,
                    starInvestBalance: newStarInvestBalance,
                    
                    userInfo: {
                      ...userInfo,
                      balance: newUserBalance.toFixed(2),
                      starWalletBalance: newStarWalletBalance.toFixed(2),
                      starInvestBalance: newStarInvestBalance.toFixed(2),
                      starInvestProfit: newStarInvestProfit.toFixed(2),
                      starWalletProfit: newStarWalletProfit.toFixed(2),
                      yesterdayProfit: newYesterdayProfit.toFixed(2),
                      totalProfit: (newStarInvestProfit + newStarWalletProfit).toFixed(2)
                    },

                    tradeRecords: [newRecord, ...state.tradeRecords]
                  }
                }

                // 更新星钱包收益：本金和收益都转入余额钱包
                if (record.symbol.startsWith('星钱包-')) {
                  newStarWalletProfit += record.returnAmount! // 累计星钱包收益
                  newUserBalance += (record.total + record.returnAmount!) // 本金 + 收益
                  newStarWalletBalance -= record.total // 减少星钱包余额
                  if (isYesterdayReturn) {
                    newYesterdayProfit += record.returnAmount! // 更新昨日总收益
                  }
                }

                return {
                  userBalance: newUserBalance,
                  starWalletBalance: newStarWalletBalance,
                  starInvestBalance: newStarInvestBalance,
                  userInfo: {
                    ...userInfo,
                    balance: newUserBalance.toFixed(2),
                    starWalletBalance: newStarWalletBalance.toFixed(2),
                    starInvestBalance: newStarInvestBalance.toFixed(2),
                    starInvestProfit: newStarInvestProfit.toFixed(2),
                    starWalletProfit: newStarWalletProfit.toFixed(2),
                    yesterdayProfit: newYesterdayProfit.toFixed(2),
                    totalProfit: (newStarInvestProfit + newStarWalletProfit).toFixed(2)
                  }
                }
              })
            }
          })

          // 每天0点重置昨日收益
          const resetYesterdayProfit = () => {
            const now = new Date()
            if (now.getHours() === 0 && now.getMinutes() === 0) {
              set((state) => ({
                userInfo: state.userInfo ? {
                  ...state.userInfo,
                  yesterdayProfit: "0"
                } : null
              }))
            }
          }

          // 检查是否需要重置昨日收益
          resetYesterdayProfit()
        },

        // 添加任务完成后的团队收益更新函数
        updateTeamProfit: (amount: number) => {
          set((state) => {
            const userInfo = state.userInfo
            if (!userInfo) return state

            const currentTeamProfit = parseFloat(userInfo.teamProfit)
            const newTeamProfit = currentTeamProfit + amount

            return {
              userInfo: {
                ...userInfo,
                teamProfit: newTeamProfit.toFixed(2)
              }
            }
          })
        },

        // 系统配置
        toggleTheme: () =>
          set((state) => ({
            theme: state.theme === "light" ? "dark" : "light",
          })),

        // 生成唯一ID
        generateUniqueId: () => {
          const state = get()
          let id: string
          do {
            id = Math.random().toString(36).substring(2, 10).toUpperCase()
          } while (state.registeredUsers.some(user => user.id === id))
          return id
        },

        // 生成唯一推荐码
        generateUniqueInviteCode: () => {
          const state = get()
          let code: string
          do {
            // 生成6位数字
            const numbers = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('')
            code = 'XC' + numbers
          } while (state.registeredUsers.some(user => user.inviteCode.toUpperCase() === code.toUpperCase()))
          return code
        },

        // 添加升级检查函数
        checkLevelUpgrade: () => {
          const state = get()
          if (!state.userInfo) return

          const updatedUser = checkAndUpdateLevel(state.userInfo)
          if (updatedUser !== state.userInfo) {
            set({
              userInfo: updatedUser,
              registeredUsers: state.registeredUsers.map(user => 
                user.id === updatedUser.id ? updatedUser : user
              )
            })
          }
        },

        // 检查用户是否满足任务要求
        checkTaskEligibility: () => {
          const state = get()
          if (!state.userInfo) return

          const now = new Date()
          const userCreateTime = new Date(state.userInfo.createTime)
          const daysSinceRegistration = Math.floor((now.getTime() - userCreateTime.getTime()) / (1000 * 60 * 60 * 24))

          // 获取用户的有效推荐人（充值10000以上的）
          const getValidReferrals = (timeLimit: number) => {
            const cutoffDate = new Date()
            cutoffDate.setDate(cutoffDate.getDate() - timeLimit)

            return state.registeredUsers
              .filter(user => 
                user.referrer === state.userInfo?.id &&
                new Date(user.createTime) > cutoffDate &&
                parseFloat(user.balance) >= 10000
              )
          }

          // 检查周薪任务
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay()) // 设置为本周一
          weekStart.setHours(0, 0, 0, 0)
          const weeklyReferrals = state.registeredUsers
            .filter(user => 
              user.referrer === state.userInfo?.id &&
              new Date(user.createTime) > weekStart &&
              parseFloat(user.balance) >= 10000
            )
          
          // 检查五星拱月任务
          const fiveStarsReferrals = state.registeredUsers
            .filter(user => 
              user.referrer === state.userInfo?.id &&
              parseFloat(user.balance) >= 10000
            )

          // 更新任务状态
          set(state => {
            const userInfo = state.userInfo
            if (!userInfo) return state

            const newTasks: Task[] = []

            // 周薪任务
            if (weeklyReferrals.length >= 1) {
              newTasks.push({
                id: `weekly-${Date.now()}`,
                type: 'weekly',
                status: 'completed',
                createTime: weekStart.toISOString(),
                completeTime: now.toISOString(),
                reward: TaskConfigs.weekly.reward,
                requirements: TaskConfigs.weekly.requirements
              })
            }

            // 五星拱月任务
            if (fiveStarsReferrals.length >= 5) {
              newTasks.push({
                id: `fiveStars-${Date.now()}`,
                type: 'fiveStars',
                status: 'completed',
                createTime: now.toISOString(),
                completeTime: now.toISOString(),
                reward: TaskConfigs.fiveStars.reward,
                requirements: TaskConfigs.fiveStars.requirements
              })
            }

            // 新人任务检查
            if (daysSinceRegistration <= 30) {
              // 三天挑战
              if (daysSinceRegistration <= 3 && getValidReferrals(3).length >= 1) {
                newTasks.push({
                  id: `threeDay-${Date.now()}`,
                  type: 'threeDay',
                  status: 'completed',
                  createTime: userInfo.createTime,
                  completeTime: now.toISOString(),
                  reward: TaskConfigs.threeDay.reward,
                  requirements: TaskConfigs.threeDay.requirements
                })
              }

              // 7天五星
              if (daysSinceRegistration <= 7 && getValidReferrals(7).length >= 5) {
                newTasks.push({
                  id: `sevenDay-${Date.now()}`,
                  type: 'sevenDay',
                  status: 'completed',
                  createTime: userInfo.createTime,
                  completeTime: now.toISOString(),
                  reward: TaskConfigs.sevenDay.reward,
                  requirements: TaskConfigs.sevenDay.requirements
                })
              }

              // 15天团队
              if (daysSinceRegistration <= 15 && getValidReferrals(15).length >= 15) {
                newTasks.push({
                  id: `fifteenDay-${Date.now()}`,
                  type: 'fifteenDay',
                  status: 'completed',
                  createTime: userInfo.createTime,
                  completeTime: now.toISOString(),
                  reward: TaskConfigs.fifteenDay.reward,
                  requirements: TaskConfigs.fifteenDay.requirements
                })
              }

              // 30天团队
              if (daysSinceRegistration <= 30 && getValidReferrals(30).length >= 30) {
                newTasks.push({
                  id: `thirtyDay-${Date.now()}`,
                  type: 'thirtyDay',
                  status: 'completed',
                  createTime: userInfo.createTime,
                  completeTime: now.toISOString(),
                  reward: TaskConfigs.thirtyDay.reward,
                  requirements: TaskConfigs.thirtyDay.requirements
                })
              }
            }

            return {
              userInfo: {
                ...userInfo,
                currentTasks: newTasks
              }
            }
          })
        },

        // 获取任务进度
        getTaskProgress: (taskType: Task['type']) => {
          const state = get()
          if (!state.userInfo) return { completed: 0, required: 0, timeLeft: 0 }

          const now = new Date()
          const userCreateTime = new Date(state.userInfo.createTime)
          const config = TaskConfigs[taskType]

          // 获取有效的推荐人数
          const getValidReferrals = (timeLimit: number) => {
            const cutoffDate = new Date()
            cutoffDate.setDate(cutoffDate.getDate() - timeLimit)

            return state.registeredUsers
              .filter(user => 
                user.referrer === state.userInfo?.id &&
                new Date(user.createTime) > cutoffDate &&
                parseFloat(user.balance) >= config.requirements.minDeposit
              ).length
          }

          let completed = 0
          let timeLeft = 0

          switch (taskType) {
            case 'weekly': {
              const weekStart = new Date(now)
              weekStart.setDate(now.getDate() - now.getDay())
              weekStart.setHours(0, 0, 0, 0)
              completed = getValidReferrals(7)
              timeLeft = 7 - now.getDay()
              break
            }
            case 'fiveStars':
              completed = getValidReferrals(0)
              timeLeft = 0 // 无时间限制
              break
            case 'threeDay':
              completed = getValidReferrals(3)
              timeLeft = Math.max(0, 3 - Math.floor((now.getTime() - userCreateTime.getTime()) / (1000 * 60 * 60 * 24)))
              break
            case 'sevenDay':
              completed = getValidReferrals(7)
              timeLeft = Math.max(0, 7 - Math.floor((now.getTime() - userCreateTime.getTime()) / (1000 * 60 * 60 * 24)))
              break
            case 'fifteenDay':
              completed = getValidReferrals(15)
              timeLeft = Math.max(0, 15 - Math.floor((now.getTime() - userCreateTime.getTime()) / (1000 * 60 * 60 * 24)))
              break
            case 'thirtyDay':
              completed = getValidReferrals(30)
              timeLeft = Math.max(0, 30 - Math.floor((now.getTime() - userCreateTime.getTime()) / (1000 * 60 * 60 * 24)))
              break
          }

          return {
            completed,
            required: config.requirements.inviteCount,
            timeLeft
          }
        },

        // 提现佣金
        withdrawCommission: async (amount: number) => {
          const state = get()
          if (!state.userInfo) return false

          const commission = parseFloat(state.userInfo.commission)
          if (amount > commission) return false

          set(state => ({
            userInfo: {
              ...state.userInfo!,
              commission: (commission - amount).toFixed(2),
              balance: (parseFloat(state.userInfo!.balance) + amount).toFixed(2)
            }
          }))

          return true
        },

        // 提交任务
        submitWeeklyTask: async () => {
          const progress = get().getTaskProgress('weekly')
          if (progress.completed < progress.required) return false
          
          const reward = TaskConfigs.weekly.reward
          set(state => ({
            userInfo: {
              ...state.userInfo!,
              commission: (parseFloat(state.userInfo!.commission) + reward).toFixed(2),
              teamPerformance: (parseFloat(state.userInfo!.teamPerformance) + reward).toFixed(2)
            }
          }))
          
          return true
        },

        // 提交五星拱月任务
        submitFiveStarsTask: async () => {
          const progress = get().getTaskProgress('fiveStars')
          if (progress.completed < progress.required) return false
          
          const reward = TaskConfigs.fiveStars.reward
          set(state => ({
            userInfo: {
              ...state.userInfo!,
              commission: (parseFloat(state.userInfo!.commission) + reward).toFixed(2),
              teamPerformance: (parseFloat(state.userInfo!.teamPerformance) + reward).toFixed(2),
              taskHistory: [
                ...state.userInfo!.taskHistory,
                {
                  taskId: `fiveStars-${Date.now()}`,
                  type: 'fiveStars',
                  completeTime: new Date().toISOString(),
                  reward
                }
              ]
            }
          }))
          
          return true
        },

        // 提交三天挑战任务
        submitThreeDayTask: async () => {
          const progress = get().getTaskProgress('threeDay')
          if (progress.completed < progress.required || progress.timeLeft <= 0) return false
          
          const reward = TaskConfigs.threeDay.reward
          set(state => ({
            userInfo: {
              ...state.userInfo!,
              commission: (parseFloat(state.userInfo!.commission) + reward).toFixed(2),
              teamPerformance: (parseFloat(state.userInfo!.teamPerformance) + reward).toFixed(2),
              completedTasks: [
                ...state.userInfo!.completedTasks,
                {
                  id: `threeDay-${Date.now()}`,
                  type: 'threeDay',
                  status: 'completed',
                  createTime: state.userInfo!.createTime,
                  completeTime: new Date().toISOString(),
                  reward,
                  requirements: TaskConfigs.threeDay.requirements
                }
              ]
            }
          }))
          
          return true
        },

        // 提交7天五星任务
        submitSevenDayTask: async () => {
          const progress = get().getTaskProgress('sevenDay')
          if (progress.completed < progress.required || progress.timeLeft <= 0) return false
          
          const reward = TaskConfigs.sevenDay.reward
          set(state => ({
            userInfo: {
              ...state.userInfo!,
              commission: (parseFloat(state.userInfo!.commission) + reward).toFixed(2),
              teamPerformance: (parseFloat(state.userInfo!.teamPerformance) + reward).toFixed(2),
              taskHistory: [
                ...state.userInfo!.taskHistory,
                {
                  taskId: `sevenDay-${Date.now()}`,
                  type: 'sevenDay',
                  completeTime: new Date().toISOString(),
                  reward
                }
              ]
            }
          }))
          
          return true
        },

        // 提交15天团队任务
        submitFifteenDayTask: async () => {
          const progress = get().getTaskProgress('fifteenDay')
          if (progress.completed < progress.required || progress.timeLeft <= 0) return false
          
          const reward = TaskConfigs.fifteenDay.reward
          set(state => ({
            userInfo: {
              ...state.userInfo!,
              commission: (parseFloat(state.userInfo!.commission) + reward).toFixed(2),
              teamPerformance: (parseFloat(state.userInfo!.teamPerformance) + reward).toFixed(2),
              completedTasks: [
                ...state.userInfo!.completedTasks,
                {
                  id: `fifteenDay-${Date.now()}`,
                  type: 'fifteenDay',
                  status: 'completed',
                  createTime: state.userInfo!.createTime,
                  completeTime: new Date().toISOString(),
                  reward,
                  requirements: TaskConfigs.fifteenDay.requirements
                }
              ]
            }
          }))
          
          return true
        },

        // 提交30天团队任务
        submitThirtyDayTask: async () => {
          const progress = get().getTaskProgress('thirtyDay')
          if (progress.completed < progress.required || progress.timeLeft <= 0) return false
          
          const reward = TaskConfigs.thirtyDay.reward
          set(state => ({
            userInfo: {
              ...state.userInfo!,
              commission: (parseFloat(state.userInfo!.commission) + reward).toFixed(2),
              teamPerformance: (parseFloat(state.userInfo!.teamPerformance) + reward).toFixed(2),
              completedTasks: [
                ...state.userInfo!.completedTasks,
                {
                  id: `thirtyDay-${Date.now()}`,
                  type: 'thirtyDay',
                  status: 'completed',
                  createTime: state.userInfo!.createTime,
                  completeTime: new Date().toISOString(),
                  reward,
                  requirements: TaskConfigs.thirtyDay.requirements
                }
              ]
            }
          }))
          
          return true
        },

        // 充值记录相关
        rechargeRecords: [],

        // 提交充值申请
        submitRecharge: async (amount: number, imageUrl: string) => {
          try {
            const response = await fetch('/api/transactions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                type: '充值',
                amount,
                method: 'USDT',
                proof: imageUrl
              })
            })

            if (!response.ok) {
              const error = await response.json()
              throw new Error(error.message || '提交充值申请失败')
            }

            const data = await response.json()
            
            // 更新本地状态
            set(state => ({
              rechargeRecords: [...state.rechargeRecords, {
                id: data.data.id,
                userId: state.userInfo?.id || '',
                amount,
                imageUrl,
                status: "pending",
                createTime: new Date().toISOString()
              }]
            }))

            return true
          } catch (error) {
            console.error('提交充值申请失败:', error)
            return false
          }
        },

        // 审核通过充值
        approveRecharge: async (recordId: string) => {
          const state = get()
          const record = state.rechargeRecords.find(r => r.id === recordId)
          if (!record || record.status !== "pending") return false

          // 更新用户余额和充值记录状态
          set(state => {
            const userInfo = state.userInfo
            if (!userInfo) return state

            const newBalance = parseFloat(userInfo.balance) + record.amount
            const newBaseDeposit = parseFloat(userInfo.baseDeposit) + record.amount

            return {
              userInfo: {
                ...userInfo,
                balance: newBalance.toFixed(2),
                baseDeposit: newBaseDeposit.toFixed(2)
              },
              rechargeRecords: state.rechargeRecords.map(r => 
                r.id === recordId 
                  ? { ...r, status: "approved" as const, approveTime: new Date().toISOString() }
                  : r
              )
            }
          })

          return true
        },

        // 拒绝充值申请
        rejectRecharge: async (recordId: string, reason: string) => {
          const state = get()
          const record = state.rechargeRecords.find(r => r.id === recordId)
          if (!record || record.status !== "pending") return false

          set(state => ({
            rechargeRecords: state.rechargeRecords.map(r => 
              r.id === recordId 
                ? { ...r, status: "rejected" as const, rejectReason: reason }
                : r
            )
          }))

          return true
        },

        // 获取用户的充值记录
        getUserRechargeRecords: () => {
          const state = get()
          if (!state.userInfo) return []

          return state.rechargeRecords.filter(r => r.userId === state.userInfo?.id)
        },

        // 添加获取可提现余额的函数
        getWithdrawableBalance: () => {
          const state = get()
          if (!state.userInfo) return 0

          const balance = parseFloat(state.userInfo.balance)
          const baseDeposit = parseFloat(state.userInfo.baseDeposit)
          const withdrawable = balance - baseDeposit

          // 如果可提现金额小于560元，返回0
          return withdrawable < 560 ? 0 : withdrawable
        },

        // 获取收益概览数据
        getProfitOverview: () => {
          const state = get()
          const userInfo = state.userInfo
          if (!userInfo) return { totalProfit: "0", profitRate: "0" }

          // 计算总收益（星投 + 星钱包）
          const totalProfit = parseFloat(userInfo.starInvestProfit) + parseFloat(userInfo.starWalletProfit)
          
          // 计算收益率
          const totalInvestment = parseFloat(userInfo.starInvestBalance) + parseFloat(userInfo.starWalletBalance)
          const profitRate = totalInvestment > 0 ? (totalProfit / totalInvestment * 100).toFixed(1) : "0"
          
          return {
            totalProfit: totalProfit.toFixed(2),
            profitRate: profitRate
          }
        },

        // 获取星投历史记录
        getStarInvestHistory: () => {
          const state = get()
          return state.tradeRecords
            .filter(record => 
              record.symbol?.startsWith('星投-') && 
              record.mentorName && 
              record.returnAmount !== undefined && 
              record.returnRate !== undefined
            )
            .map(record => ({
              date: new Date(record.createTime).toISOString().split('T')[0],
              mentorName: record.mentorName!,
              amount: record.total.toFixed(2),
              profit: (record.returnAmount || 0).toFixed(2),
              profitRate: (record.returnRate || 0).toFixed(1),
              mentorTrades: record.mentorTrades || []
            }))
        },

        // 获取当月星投统计数据
        getCurrentMonthStarInvestStats: () => {
          const state = get()
          const now = new Date()
          const currentMonth = now.toISOString().slice(0, 7) // 格式：YYYY-MM
          
          // 获取当月的星投记录
          const monthlyRecords = state.tradeRecords.filter(record => {
            const recordDate = new Date(record.createTime)
            return record.symbol?.startsWith('星投-') && 
                   record.mentorName === '陈维德' &&
                   recordDate.toISOString().slice(0, 7) === currentMonth
          })

          // 计算当月累计收益
          const totalProfit = monthlyRecords.reduce((sum, record) => 
            sum + (record.returnAmount || 0), 0
          )

          // 计算平均日收益率
          const daysInMonth = 30
          const totalRate = monthlyRecords.reduce((sum, record) => 
            sum + (record.returnRate || 0), 0
          )
          const averageRate = monthlyRecords.length > 0 ? 
            (totalRate / daysInMonth).toFixed(1) : "0"

          return {
            totalProfit: totalProfit.toFixed(2),
            averageRate: `${averageRate}%`
          }
        },
      }
    },
    {
      name: "app-storage",
      partialize: (state) => ({
        theme: state.theme,
        registeredUsers: state.registeredUsers,
        userInfo: state.userInfo,
        userBalance: state.userBalance,
        starWalletBalance: state.starWalletBalance,
        starInvestBalance: state.starInvestBalance,
        tradeRecords: state.tradeRecords,
        rechargeRecords: state.rechargeRecords,
        totalAssets: state.calculateTotalAssets()
      }),
      version: 6,
      migrate: (persistedState: any) => {
        return {
          ...persistedState,
          totalAssets: 0,
          userInfo: persistedState.userInfo || null,
          userBalance: persistedState.userBalance || 0,
          starWalletBalance: persistedState.starWalletBalance || 0,
          starInvestBalance: persistedState.starInvestBalance || 0,
          tradeRecords: persistedState.tradeRecords || [],
          theme: persistedState.theme || "light",
          registeredUsers: persistedState.registeredUsers || [{
            id: "ADMIN",
            username: "admin",
            nickname: "管理员",
            password: "admin888",
            inviteCode: "XC888888",
            referees: [],
            token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBRE1JTiIsInVzZXJuYW1lIjoiYWRtaW4iLCJ2aXBMZXZlbCI6OX0.c2lnbmF0dXJl", // 预生成的JWT格式token
            balance: "200000",
            baseDeposit: "0",
            starWalletBalance: "200000",
            starInvestBalance: "200000",
            vipLevel: 9,
            vipName: "超级管理员",
            teamCount: 0,
            directCount: 0,
            teamProfit: "0",
            totalProfit: "0",
            yesterdayProfit: "0",
            starInvestProfit: "0",
            starWalletProfit: "0",
            avatar: "/avatars/admin.jpg",
            createTime: new Date().toISOString(),
            isFirstLogin: true,
            commission: "0",
            teamPerformance: "0",
            completedTasks: [],
            currentTasks: [],
            taskHistory: []
          }],
          rechargeRecords: persistedState.rechargeRecords || []
        }
      }
    }
  )
) 