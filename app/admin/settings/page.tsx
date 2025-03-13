"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

export default function AdminSettingsPage() {
  const { toast } = useToast()
  
  // 基本设置
  const [siteName, setSiteName] = useState("星辰投资")
  const [siteDescription, setSiteDescription] = useState("专业的投资交易平台")
  const [contactEmail, setContactEmail] = useState("support@xingchen.com")
  const [contactPhone, setContactPhone] = useState("400-123-4567")
  
  // 安全设置
  const [loginAttempts, setLoginAttempts] = useState("5")
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [twoFactorAuth, setTwoFactorAuth] = useState(false)
  const [passwordExpiry, setPasswordExpiry] = useState("90")
  
  // 通知设置
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [systemNotifications, setSystemNotifications] = useState(true)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  
  // 保存设置
  const handleSaveBasicSettings = () => {
    toast({
      title: "基本设置已保存",
      description: "网站基本信息设置已成功更新",
    })
  }
  
  const handleSaveSecuritySettings = () => {
    toast({
      title: "安全设置已保存",
      description: "系统安全设置已成功更新",
    })
  }
  
  const handleSaveNotificationSettings = () => {
    toast({
      title: "通知设置已保存",
      description: "系统通知设置已成功更新",
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">系统设置</h1>
      
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">基本设置</TabsTrigger>
          <TabsTrigger value="security">安全设置</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
        </TabsList>
        
        {/* 基本设置 */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>基本信息设置</CardTitle>
              <CardDescription>
                设置网站的基本信息和联系方式
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site-name">网站名称</Label>
                <Input 
                  id="site-name" 
                  value={siteName} 
                  onChange={(e) => setSiteName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site-description">网站描述</Label>
                <Textarea 
                  id="site-description" 
                  value={siteDescription} 
                  onChange={(e) => setSiteDescription(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">联系邮箱</Label>
                <Input 
                  id="contact-email" 
                  type="email" 
                  value={contactEmail} 
                  onChange={(e) => setContactEmail(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">联系电话</Label>
                <Input 
                  id="contact-phone" 
                  value={contactPhone} 
                  onChange={(e) => setContactPhone(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">系统时区</Label>
                <Select defaultValue="Asia/Shanghai">
                  <SelectTrigger>
                    <SelectValue placeholder="选择时区" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Shanghai">中国标准时间 (UTC+8)</SelectItem>
                    <SelectItem value="America/New_York">美国东部时间 (UTC-5)</SelectItem>
                    <SelectItem value="Europe/London">英国标准时间 (UTC+0)</SelectItem>
                    <SelectItem value="Asia/Tokyo">日本标准时间 (UTC+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveBasicSettings}>保存设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* 安全设置 */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>安全设置</CardTitle>
              <CardDescription>
                配置系统安全相关的设置
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-attempts">最大登录尝试次数</Label>
                <Input 
                  id="login-attempts" 
                  type="number" 
                  value={loginAttempts} 
                  onChange={(e) => setLoginAttempts(e.target.value)} 
                />
                <p className="text-xs text-gray-500">
                  用户连续登录失败达到此次数后将被临时锁定
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="session-timeout">会话超时时间（分钟）</Label>
                <Input 
                  id="session-timeout" 
                  type="number" 
                  value={sessionTimeout} 
                  onChange={(e) => setSessionTimeout(e.target.value)} 
                />
                <p className="text-xs text-gray-500">
                  用户无操作超过此时间后将自动登出
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-expiry">密码过期时间（天）</Label>
                <Input 
                  id="password-expiry" 
                  type="number" 
                  value={passwordExpiry} 
                  onChange={(e) => setPasswordExpiry(e.target.value)} 
                />
                <p className="text-xs text-gray-500">
                  用户密码超过此天数后需要重新设置，设为0表示永不过期
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="two-factor">双因素认证</Label>
                  <p className="text-xs text-gray-500">
                    启用后管理员登录需要进行双重验证
                  </p>
                </div>
                <Switch 
                  id="two-factor" 
                  checked={twoFactorAuth}
                  onCheckedChange={setTwoFactorAuth}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecuritySettings}>保存设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* 通知设置 */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
              <CardDescription>
                配置系统通知和提醒方式
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">邮件通知</Label>
                  <p className="text-xs text-gray-500">
                    启用系统邮件通知功能
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">短信通知</Label>
                  <p className="text-xs text-gray-500">
                    启用系统短信通知功能
                  </p>
                </div>
                <Switch 
                  id="sms-notifications" 
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="system-notifications">系统内通知</Label>
                  <p className="text-xs text-gray-500">
                    启用系统内部消息通知
                  </p>
                </div>
                <Switch 
                  id="system-notifications" 
                  checked={systemNotifications}
                  onCheckedChange={setSystemNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode" className="text-red-500 font-medium">维护模式</Label>
                  <p className="text-xs text-gray-500">
                    启用后除管理员外所有用户将无法访问系统
                  </p>
                </div>
                <Switch 
                  id="maintenance-mode" 
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
              {maintenanceMode && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-sm text-yellow-800">
                    警告：维护模式已启用，普通用户将无法访问系统。请在系统维护完成后关闭此模式。
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotificationSettings}>保存设置</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 