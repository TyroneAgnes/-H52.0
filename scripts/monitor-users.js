const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function monitorUsers() {
  try {
    console.log('开始监控用户数据...')
    
    // 获取初始用户列表
    const initialUsers = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        createdAt: true
      }
    })
    
    console.log('当前用户列表：')
    console.log(JSON.stringify(initialUsers, null, 2))
    
    // 每5秒检查一次用户变化
    setInterval(async () => {
      const currentUsers = await prisma.user.findMany({
        select: {
          id: true,
          username: true,
          role: true,
          createdAt: true
        }
      })
      
      console.log('\n最新用户列表：')
      console.log(JSON.stringify(currentUsers, null, 2))
    }, 5000)
    
  } catch (error) {
    console.error('监控过程中出错:', error)
  }
}

monitorUsers() 