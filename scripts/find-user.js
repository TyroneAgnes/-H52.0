const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function findUser() {
  try {
    // 查询所有用户
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        nickname: true,
        createdAt: true,
        role: true
      }
    })

    console.log('所有用户列表：')
    console.log(JSON.stringify(users, null, 2))

    // 特别查找手机号用户
    const phoneUser = await prisma.user.findFirst({
      where: {
        username: '13100131000'
      }
    })

    console.log('\n查找手机号用户：')
    console.log(JSON.stringify(phoneUser, null, 2))

  } catch (error) {
    console.error('查询出错：', error)
  } finally {
    await prisma.$disconnect()
  }
}

findUser() 