// 代理中心规则说明
export const AgentRules = {
  // 代理等级说明
  levelRules: {
    title: "代理等级说明",
    description: "代理等级从普通代理开始，通过发展团队成员逐步升级",
    levels: [
      { level: "普通代理", requirements: "注册成为会员即可" },
      { level: "白羊座", requirements: "团队人数达到2人" },
      { level: "金牛座", requirements: "直推3人，团队人数达到3人" },
      { level: "巨蟹座", requirements: "直推5人，团队人数达到10人" },
      { level: "狮子座", requirements: "直推6人，团队人数达到30人" },
      { level: "处女座", requirements: "直推7人，团队人数达到100人" },
      { level: "天秤座", requirements: "直推8人，团队人数达到300人" },
      { level: "天蝎座", requirements: "直推10人，团队人数达到1000人" },
      { level: "射手座", requirements: "直推12人，团队人数达到3000人" },
      { level: "摩羯座", requirements: "直推15人，团队人数达到10000人" },
      { level: "水瓶座", requirements: "直推20人，团队人数达到20000人" },
      { level: "双鱼座", requirements: "直推30人，团队人数达到50000人" },
      { level: "双子座(教皇)", requirements: "直推40人，团队人数达到80000人" }
    ]
  },

  // 任务中心说明
  taskRules: {
    title: "任务中心说明",
    description: "完成任务可获得相应奖励，奖励直接计入佣金",
    tasks: [
      {
        name: "周薪任务",
        description: "每周邀请1人并确保充值10000以上",
        reward: "无固定奖励",
        period: "自然周期内完成"
      },
      {
        name: "五星拱月",
        description: "邀请5人并确保每人充值10000以上",
        reward: "奖励2888元",
        period: "可重复完成，无时间限制"
      },
      {
        name: "新人三天挑战",
        description: "注册3天内完成1人推广(充值10000以上)",
        reward: "奖励428元",
        period: "注册3天内"
      },
      {
        name: "七天五星",
        description: "7天内邀请5人(每人充值10000以上)",
        reward: "奖励728元",
        period: "注册7天内"
      },
      {
        name: "十五天团队",
        description: "15天内邀请15人(每人充值10000以上)",
        reward: "奖励2188元",
        period: "注册15天内"
      },
      {
        name: "三十天团队",
        description: "30天内邀请30人(每人充值10000以上)",
        reward: "奖励4288元",
        period: "注册30天内"
      }
    ]
  },

  // 佣金说明
  commissionRules: {
    title: "佣金说明",
    description: "佣金来源于完成任务的奖励，可随时提现至余额",
    notes: [
      "完成任务后奖励自动计入佣金",
      "佣金可随时提现至余额",
      "提现无手续费",
      "无提现限额"
    ]
  },

  // 团队业绩说明
  teamPerformanceRules: {
    title: "团队业绩说明",
    description: "团队业绩是指团队成员完成任务获得的资金总和",
    notes: [
      "包含直接和间接成员的任务奖励",
      "团队业绩永久累计",
      "可用于等级晋升参考"
    ]
  }
} 