import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number, decimals = 2): string {
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date)
}

export function formatPercent(num: number): string {
  return `${(num > 0 ? "+" : "")}${num.toFixed(2)}%`
}

// 格式化时间距离
export function formatTimeAgo(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date
  return formatDistanceToNow(d, { addSuffix: true, locale: zhCN })
}

export function formatMoney(amount: number) {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amount)
}

// 检查是否在交易时间内
export function isWithinTradingHours() {
  const now = new Date()
  const hours = now.getHours()
  const minutes = now.getMinutes()
  const currentTime = hours * 100 + minutes

  // 9:30 - 14:00
  return currentTime >= 930 && currentTime <= 1400
}

// 获取随机结算时间（9:00-11:30之间）
function getRandomSettlementTime() {
  const returnTime = new Date()
  returnTime.setDate(returnTime.getDate() + 1) // 第二天
  
  // 生成9:00-11:30之间的随机时间
  const minMinutes = 9 * 60 // 9:00
  const maxMinutes = 11 * 60 + 30 // 11:30
  const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes
  
  const hours = Math.floor(randomMinutes / 60)
  const minutes = randomMinutes % 60
  
  returnTime.setHours(hours, minutes, 0, 0)
  return returnTime
}

// 计算星投收益
export const calculateStarInvestReturn = (amount: number, mentorReturn: number = 0) => {
  const returnTime = getRandomSettlementTime()

  // 固定收益率1.2%
  const returnRate = 0.012
  const returnAmount = amount * returnRate

  return {
    returnTime,
    returnAmount: amount + returnAmount // 返回本金加收益
  }
}

// 计算星钱包收益
export function calculateStarWalletReturn(amount: number) {
  // 当天24点前投资，第二天10点返还，固定收益率1.2%
  const returnRate = 0.012 // 1.2%
  const profit = amount * returnRate
  return {
    returnTime: getNextReturnTime(10, 0), // 固定在第二天10点返还
    returnAmount: amount + profit // 返回本金加收益
  }
}

// 获取下一个返还时间
function getNextReturnTime(hour: number, minute: number) {
  const now = new Date()
  const returnTime = new Date(now)
  
  // 设置为明天的指定时间
  returnTime.setDate(now.getDate() + 1)
  returnTime.setHours(hour, minute, 0, 0)
  
  return returnTime
}

// 检查是否需要返还收益
export function shouldReturnProfit(investTime: string, returnTime: Date) {
  const now = new Date()
  const investDate = new Date(investTime)
  return now >= returnTime && investDate <= returnTime
}
