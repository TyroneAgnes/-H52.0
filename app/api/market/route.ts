import { NextResponse } from "next/server"
import { MarketData, MarketIndex } from "@/lib/store"

// 模拟市场指数数据
const mockIndexData: MarketIndex[] = [
  {
    title: "恒生指数",
    value: 16589.44,
    change: -112.74,
    changePercent: -0.68,
    isPositive: false,
    updateTime: new Date().toISOString()
  },
  {
    title: "恒生科技指数",
    value: 3345.89,
    change: -42.56,
    changePercent: -1.26,
    isPositive: false,
    updateTime: new Date().toISOString()
  },
  {
    title: "国企指数",
    value: 5842.31,
    change: -38.25,
    changePercent: -0.65,
    isPositive: false,
    updateTime: new Date().toISOString()
  }
]

// 定义各市场的板块和股票数据
const marketSectors = {
  "港股": {
    "科技互联网": [
      { symbol: "00700", name: "腾讯控股", price: 298.40, change: -3.60, changePercent: -1.19, volume: 12345678, isPositive: false },
      { symbol: "09988", name: "阿里巴巴", price: 72.35, change: -1.25, changePercent: -1.70, volume: 8765432, isPositive: false },
      { symbol: "09618", name: "京东集团", price: 94.55, change: 1.25, changePercent: 1.34, volume: 5678901, isPositive: true },
      { symbol: "03690", name: "美团-W", price: 68.85, change: -0.95, changePercent: -1.36, volume: 7890123, isPositive: false }
    ],
    "金融保险": [
      { symbol: "01398", name: "工商银行", price: 3.85, change: 0.05, changePercent: 1.32, volume: 234567890, isPositive: true },
      { symbol: "02318", name: "中国平安", price: 43.25, change: -0.55, changePercent: -1.26, volume: 12345678, isPositive: false },
      { symbol: "00939", name: "建设银行", price: 4.75, change: 0.08, changePercent: 1.71, volume: 98765432, isPositive: true },
      { symbol: "01288", name: "农业银行", price: 2.95, change: 0.03, changePercent: 1.03, volume: 45678901, isPositive: true }
    ],
    "医药生物": [
      { symbol: "02269", name: "药明生物", price: 27.85, change: -0.45, changePercent: -1.59, volume: 6789012, isPositive: false },
      { symbol: "03759", name: "康龙化成", price: 48.50, change: 1.20, changePercent: 2.54, volume: 3456789, isPositive: true },
      { symbol: "01801", name: "药明康德", price: 52.35, change: -0.85, changePercent: -1.60, volume: 4567890, isPositive: false },
      { symbol: "00241", name: "阿里健康", price: 3.15, change: 0.05, changePercent: 1.61, volume: 5678901, isPositive: true }
    ],
    "新能源": [
      { symbol: "01211", name: "比亚迪", price: 168.90, change: 2.30, changePercent: 1.38, volume: 8901234, isPositive: true },
      { symbol: "02594", name: "比亚迪电子", price: 23.45, change: -0.35, changePercent: -1.47, volume: 2345678, isPositive: false },
      { symbol: "00175", name: "吉利汽车", price: 9.85, change: 0.15, changePercent: 1.55, volume: 7890123, isPositive: true },
      { symbol: "02015", name: "理想汽车-W", price: 98.55, change: -1.45, changePercent: -1.45, volume: 3456789, isPositive: false }
    ],
    "消费零售": [
      { symbol: "02020", name: "安踏体育", price: 85.25, change: 1.35, changePercent: 1.61, volume: 4567890, isPositive: true },
      { symbol: "06862", name: "海底捞", price: 15.78, change: -0.22, changePercent: -1.37, volume: 5678901, isPositive: false },
      { symbol: "02331", name: "李宁", price: 25.45, change: 0.35, changePercent: 1.39, volume: 6789012, isPositive: true },
      { symbol: "00291", name: "华润啤酒", price: 45.85, change: -0.65, changePercent: -1.40, volume: 7890123, isPositive: false }
    ],
    "地产建筑": [
      { symbol: "01109", name: "华润置地", price: 12.88, change: 0.18, changePercent: 1.42, volume: 8901234, isPositive: true },
      { symbol: "00688", name: "中国海外", price: 15.76, change: -0.24, changePercent: -1.50, volume: 9012345, isPositive: false },
      { symbol: "03323", name: "中国建材", price: 6.89, change: 0.09, changePercent: 1.32, volume: 1234567, isPositive: true },
      { symbol: "00914", name: "中建控股", price: 4.56, change: -0.06, changePercent: -1.30, volume: 2345678, isPositive: false }
    ]
  },
  "美股": {
    "科技巨头": [
      { symbol: "AAPL", name: "苹果", price: 182.52, change: 1.87, changePercent: 1.04, volume: 23456789, isPositive: true },
      { symbol: "MSFT", name: "微软", price: 404.65, change: 5.23, changePercent: 1.31, volume: 34567890, isPositive: true },
      { symbol: "GOOGL", name: "谷歌A", price: 142.75, change: -1.25, changePercent: -0.87, volume: 12345678, isPositive: false },
      { symbol: "META", name: "脸书", price: 485.95, change: 6.85, changePercent: 1.43, volume: 9876543, isPositive: true }
    ],
    "芯片半导体": [
      { symbol: "NVDA", name: "英伟达", price: 875.35, change: 15.65, changePercent: 1.82, volume: 45678901, isPositive: true },
      { symbol: "AMD", name: "超微", price: 178.45, change: -2.35, changePercent: -1.30, volume: 23456789, isPositive: false },
      { symbol: "INTC", name: "英特尔", price: 42.85, change: 0.65, changePercent: 1.54, volume: 34567890, isPositive: true },
      { symbol: "TSM", name: "台积电", price: 128.95, change: -1.85, changePercent: -1.42, volume: 12345678, isPositive: false }
    ],
    "新能源车": [
      { symbol: "TSLA", name: "特斯拉", price: 175.45, change: -2.55, changePercent: -1.43, volume: 56789012, isPositive: false },
      { symbol: "NIO", name: "蔚来", price: 5.85, change: 0.15, changePercent: 2.63, volume: 34567890, isPositive: true },
      { symbol: "XPEV", name: "小鹏", price: 9.25, change: -0.15, changePercent: -1.60, volume: 23456789, isPositive: false },
      { symbol: "LI", name: "理想", price: 32.85, change: 0.55, changePercent: 1.70, volume: 12345678, isPositive: true }
    ],
    "互联网": [
      { symbol: "AMZN", name: "亚马逊", price: 178.35, change: 2.45, changePercent: 1.39, volume: 45678901, isPositive: true },
      { symbol: "BABA", name: "阿里巴巴", price: 72.45, change: -1.15, changePercent: -1.56, volume: 34567890, isPositive: false },
      { symbol: "PDD", name: "拼多多", price: 128.75, change: 2.25, changePercent: 1.78, volume: 23456789, isPositive: true },
      { symbol: "JD", name: "京东", price: 25.85, change: -0.45, changePercent: -1.71, volume: 12345678, isPositive: false }
    ],
    "金融支付": [
      { symbol: "V", name: "维萨", price: 275.85, change: 3.45, changePercent: 1.27, volume: 23456789, isPositive: true },
      { symbol: "MA", name: "万事达", price: 468.95, change: -5.85, changePercent: -1.23, volume: 12345678, isPositive: false },
      { symbol: "PYPL", name: "贝宝", price: 62.35, change: 0.85, changePercent: 1.38, volume: 34567890, isPositive: true },
      { symbol: "SQ", name: "方块", price: 75.45, change: -1.15, changePercent: -1.50, volume: 23456789, isPositive: false }
    ],
    "生物医药": [
      { symbol: "PFE", name: "辉瑞", price: 27.85, change: -0.35, changePercent: -1.24, volume: 45678901, isPositive: false },
      { symbol: "MRNA", name: "莫德纳", price: 98.75, change: 1.45, changePercent: 1.49, volume: 23456789, isPositive: true },
      { symbol: "JNJ", name: "强生", price: 158.95, change: 2.25, changePercent: 1.44, volume: 34567890, isPositive: true },
      { symbol: "ABBV", name: "艾伯维", price: 168.35, change: -2.45, changePercent: -1.44, volume: 12345678, isPositive: false }
    ]
  },
  "期货": {
    "贵金属": [
      { symbol: "AU", name: "黄金", price: 2185.50, change: 15.50, changePercent: 0.71, volume: 234567, isPositive: true },
      { symbol: "AG", name: "白银", price: 24.85, change: -0.35, changePercent: -1.39, volume: 345678, isPositive: false },
      { symbol: "PT", name: "铂金", price: 928.75, change: 8.75, changePercent: 0.95, volume: 123456, isPositive: true },
      { symbol: "PD", name: "钯金", price: 1045.25, change: -12.75, changePercent: -1.21, volume: 234567, isPositive: false }
    ],
    "能源": [
      { symbol: "CL", name: "原油", price: 82.45, change: 1.25, changePercent: 1.54, volume: 456789, isPositive: true },
      { symbol: "NG", name: "天然气", price: 2.185, change: -0.035, changePercent: -1.58, volume: 345678, isPositive: false },
      { symbol: "HO", name: "取暖油", price: 2.685, change: 0.045, changePercent: 1.71, volume: 234567, isPositive: true },
      { symbol: "RB", name: "汽油", price: 2.485, change: -0.035, changePercent: -1.39, volume: 345678, isPositive: false }
    ],
    "基本金属": [
      { symbol: "HG", name: "铜", price: 3.985, change: 0.055, changePercent: 1.40, volume: 234567, isPositive: true },
      { symbol: "AL", name: "铝", price: 2.285, change: -0.035, changePercent: -1.51, volume: 345678, isPositive: false },
      { symbol: "ZN", name: "锌", price: 2.485, change: 0.035, changePercent: 1.43, volume: 234567, isPositive: true },
      { symbol: "NI", name: "镍", price: 16.785, change: -0.215, changePercent: -1.27, volume: 123456, isPositive: false }
    ],
    "农产品": [
      { symbol: "S", name: "大豆", price: 1185.75, change: 15.25, changePercent: 1.30, volume: 345678, isPositive: true },
      { symbol: "C", name: "玉米", price: 438.25, change: -5.75, changePercent: -1.29, volume: 456789, isPositive: false },
      { symbol: "W", name: "小麦", price: 585.50, change: 7.50, changePercent: 1.30, volume: 234567, isPositive: true },
      { symbol: "CT", name: "棉花", price: 85.65, change: -1.35, changePercent: -1.55, volume: 345678, isPositive: false }
    ],
    "软商品": [
      { symbol: "KC", name: "咖啡", price: 185.65, change: 2.65, changePercent: 1.45, volume: 234567, isPositive: true },
      { symbol: "SB", name: "白糖", price: 22.85, change: -0.35, changePercent: -1.51, volume: 345678, isPositive: false },
      { symbol: "CC", name: "可可", price: 4285.00, change: 55.00, changePercent: 1.30, volume: 123456, isPositive: true },
      { symbol: "P", name: "棕榈油", price: 885.75, change: -12.25, changePercent: -1.36, volume: 234567, isPositive: false }
    ],
    "畜牧产品": [
      { symbol: "LH", name: "生猪", price: 85.675, change: 1.325, changePercent: 1.57, volume: 234567, isPositive: true },
      { symbol: "EG", name: "鸡蛋", price: 1.485, change: -0.025, changePercent: -1.66, volume: 345678, isPositive: false },
      { symbol: "LC", name: "肉牛", price: 185.45, change: 2.55, changePercent: 1.39, volume: 234567, isPositive: true },
      { symbol: "WL", name: "羊毛", price: 485.75, change: -6.25, changePercent: -1.27, volume: 123456, isPositive: false }
    ]
  },
  "日股": {
    "汽车制造": [
      { symbol: "7203", name: "丰田", price: 3285.00, change: 45.00, changePercent: 1.39, volume: 2345678, isPositive: true },
      { symbol: "7267", name: "本田", price: 1685.50, change: -23.50, changePercent: -1.38, volume: 1234567, isPositive: false },
      { symbol: "7201", name: "日产", price: 585.25, change: 7.25, changePercent: 1.25, volume: 3456789, isPositive: true },
      { symbol: "7269", name: "铃木", price: 885.75, change: -12.25, changePercent: -1.36, volume: 2345678, isPositive: false }
    ],
    "电子科技": [
      { symbol: "6758", name: "索尼", price: 12850.00, change: 150.00, changePercent: 1.18, volume: 1234567, isPositive: true },
      { symbol: "6501", name: "日立", price: 8785.00, change: -115.00, changePercent: -1.29, volume: 2345678, isPositive: false },
      { symbol: "6752", name: "松下", price: 1485.50, change: 20.50, changePercent: 1.40, volume: 3456789, isPositive: true },
      { symbol: "6502", name: "东芝", price: 4585.25, change: -64.75, changePercent: -1.39, volume: 2345678, isPositive: false }
    ],
    "金融银行": [
      { symbol: "8306", name: "三菱UFJ", price: 1285.50, change: 17.50, changePercent: 1.38, volume: 4567890, isPositive: true },
      { symbol: "8316", name: "三井住友", price: 5885.00, change: -82.00, changePercent: -1.37, volume: 3456789, isPositive: false },
      { symbol: "8411", name: "瑞穗金融", price: 2485.75, change: 34.75, changePercent: 1.42, volume: 2345678, isPositive: true },
      { symbol: "8331", name: "千叶银行", price: 785.25, change: -10.75, changePercent: -1.35, volume: 1234567, isPositive: false }
    ],
    "通信服务": [
      { symbol: "9432", name: "NTT", price: 485.75, change: 6.75, changePercent: 1.41, volume: 2345678, isPositive: true },
      { symbol: "9434", name: "软银", price: 6285.00, change: -88.00, changePercent: -1.38, volume: 3456789, isPositive: false },
      { symbol: "9613", name: "NTT数据", price: 1885.50, change: 26.50, changePercent: 1.42, volume: 2345678, isPositive: true },
      { symbol: "4689", name: "雅虎日本", price: 485.25, change: -6.75, changePercent: -1.37, volume: 1234567, isPositive: false }
    ],
    "零售商业": [
      { symbol: "9983", name: "快递", price: 2485.75, change: 34.75, changePercent: 1.42, volume: 2345678, isPositive: true },
      { symbol: "8267", name: "永旺", price: 3285.00, change: -46.00, changePercent: -1.38, volume: 3456789, isPositive: false },
      { symbol: "3382", name: "七和控股", price: 885.50, change: 12.50, changePercent: 1.43, volume: 2345678, isPositive: true },
      { symbol: "8905", name: "永旺梦乐城", price: 1285.25, change: -17.75, changePercent: -1.36, volume: 1234567, isPositive: false }
    ],
    "工业机械": [
      { symbol: "7011", name: "三菱重工", price: 785.50, change: 10.50, changePercent: 1.35, volume: 2345678, isPositive: true },
      { symbol: "6301", name: "小松制作", price: 3485.00, change: -48.00, changePercent: -1.36, volume: 3456789, isPositive: false },
      { symbol: "6305", name: "日立建机", price: 2885.75, change: 40.75, changePercent: 1.43, volume: 2345678, isPositive: true },
      { symbol: "6361", name: "荏原", price: 685.25, change: -9.75, changePercent: -1.40, volume: 1234567, isPositive: false }
    ]
  }
}

export async function GET(request: Request) {
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url)
    const market = searchParams.get('market')
    
    // 模拟随机价格波动
    const now = new Date().toISOString()
    
    // 更新指数数据
    const indices = mockIndexData.map(index => ({
      ...index,
      value: index.value * (1 + (Math.random() - 0.5) * 0.01),
      change: index.change + (Math.random() - 0.5) * 0.5,
      changePercent: index.changePercent + (Math.random() - 0.5) * 0.1,
      updateTime: now
    }))

    // 根据市场类型获取数据
    const marketData = market ? marketSectors[market as keyof typeof marketSectors] : {}

    // 为每个股票添加更新时间和市场信息
    const processedMarketData = Object.entries(marketData || {}).reduce((acc, [sector, stocks]) => {
      acc[sector] = stocks.map(stock => ({
        ...stock,
        market: market || "",
        updateTime: now
      }))
      return acc
    }, {} as any)

    return NextResponse.json({
      code: 0,
      data: {
        indices,
        sectors: processedMarketData
      },
      message: "获取成功"
    })
  } catch (error) {
    console.error("获取市场数据失败:", error)
    return NextResponse.json({
      code: 1,
      message: "服务器错误"
    }, { status: 500 })
  }
} 