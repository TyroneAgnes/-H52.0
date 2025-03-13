"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function RulesPage() {
  const [starInvestRule, setStarInvestRule] = useState({
    baseRate: "8", // 基础收益率
    bonusRate: "2", // 额外奖励率
    settlementTime: "每日0点", // 结算时间
  })

  const [starWalletRule, setStarWalletRule] = useState({
    annualRate: "6", // 年化收益率
    minAmount: "1000", // 最小投资金额
    lockPeriod: "30", // 锁定期(天)
  })

  const [crawlerRule, setCrawlerRule] = useState({
    crawlTime: "每日9点", // 抓取时间
    dataSource: "新浪财经", // 数据来源
    retryTimes: "3", // 重试次数
  })

  const [exchangeRate, setExchangeRate] = useState({
    usdtRate: "7.23", // USDT兑换人民币汇率
    updateTime: "实时", // 更新频率
    spread: "0.1", // 买卖价差
  })

  const handleSave = (section: string) => {
    console.log(`保存${section}设置`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">平台规则设置</h2>
      </div>

      <Tabs defaultValue="star-invest" className="space-y-4">
        <TabsList>
          <TabsTrigger value="star-invest">星投收益规则</TabsTrigger>
          <TabsTrigger value="star-wallet">星钱包规则</TabsTrigger>
          <TabsTrigger value="crawler">数据抓取规则</TabsTrigger>
          <TabsTrigger value="exchange">汇率设置</TabsTrigger>
        </TabsList>

        <TabsContent value="star-invest">
          <Card>
            <CardHeader>
              <CardTitle>星投收益规则设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label>基础收益率(%)</label>
                  <Input 
                    value={starInvestRule.baseRate}
                    onChange={e => setStarInvestRule({...starInvestRule, baseRate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label>额外奖励率(%)</label>
                  <Input 
                    value={starInvestRule.bonusRate}
                    onChange={e => setStarInvestRule({...starInvestRule, bonusRate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label>结算时间</label>
                  <Input 
                    value={starInvestRule.settlementTime}
                    onChange={e => setStarInvestRule({...starInvestRule, settlementTime: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave("星投")}>保存设置</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="star-wallet">
          <Card>
            <CardHeader>
              <CardTitle>星钱包规则设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label>年化收益率(%)</label>
                  <Input 
                    value={starWalletRule.annualRate}
                    onChange={e => setStarWalletRule({...starWalletRule, annualRate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label>最小投资金额(元)</label>
                  <Input 
                    value={starWalletRule.minAmount}
                    onChange={e => setStarWalletRule({...starWalletRule, minAmount: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label>锁定期(天)</label>
                  <Input 
                    value={starWalletRule.lockPeriod}
                    onChange={e => setStarWalletRule({...starWalletRule, lockPeriod: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave("星钱包")}>保存设置</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crawler">
          <Card>
            <CardHeader>
              <CardTitle>数据抓取规则设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label>抓取时间</label>
                  <Input 
                    value={crawlerRule.crawlTime}
                    onChange={e => setCrawlerRule({...crawlerRule, crawlTime: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label>数据来源</label>
                  <Input 
                    value={crawlerRule.dataSource}
                    onChange={e => setCrawlerRule({...crawlerRule, dataSource: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label>重试次数</label>
                  <Input 
                    value={crawlerRule.retryTimes}
                    onChange={e => setCrawlerRule({...crawlerRule, retryTimes: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave("数据抓取")}>保存设置</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exchange">
          <Card>
            <CardHeader>
              <CardTitle>汇率设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <label>USDT兑换人民币汇率</label>
                  <Input 
                    value={exchangeRate.usdtRate}
                    onChange={e => setExchangeRate({...exchangeRate, usdtRate: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label>更新频率</label>
                  <Input 
                    value={exchangeRate.updateTime}
                    onChange={e => setExchangeRate({...exchangeRate, updateTime: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <label>买卖价差(%)</label>
                  <Input 
                    value={exchangeRate.spread}
                    onChange={e => setExchangeRate({...exchangeRate, spread: e.target.value})}
                  />
                </div>
              </div>
              <Button onClick={() => handleSave("汇率")}>保存设置</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 