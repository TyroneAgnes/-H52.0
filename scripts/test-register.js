const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function testRegister() {
  try {
    console.log('开始测试注册流程...')
    
    // 1. 检查当前用户数量
    const beforeCount = await prisma.user.count()
    console.log('注册前用户数量:', beforeCount)
    
    // 2. 创建测试用户
    const testUser = {
      username: 'testuser123',
      password: await hash('testpass123', 10),
      inviteCode: 'TEST123',
      referralCode: 'ADMIN123'
    }
    
    console.log('准备创建用户:', testUser.username)
    
    // 3. 创建用户
    const newUser = await prisma.user.create({
      data: testUser
    })
    
    console.log('用户创建成功:', newUser)
    
    // 4. 再次检查用户数量
    const afterCount = await prisma.user.count()
    console.log('注册后用户数量:', afterCount)
    
    // 5. 查询新创建的用户
    const foundUser = await prisma.user.findUnique({
      where: { username: testUser.username }
    })
    
    console.log('查询新用户:', foundUser)
    
  } catch (error) {
    console.error('测试过程中出错:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testRegister() 