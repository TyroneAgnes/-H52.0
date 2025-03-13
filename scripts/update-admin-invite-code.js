const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function updateAdminInviteCode() {
  try {
    // 查找管理员用户
    const admin = await prisma.user.findFirst({
      where: {
        username: 'admin'
      }
    })

    if (!admin) {
      console.log('未找到管理员用户')
      return
    }

    // 更新管理员的推荐码
    const updatedAdmin = await prisma.user.update({
      where: {
        id: admin.id
      },
      data: {
        inviteCode: 'XC888888'
      }
    })

    console.log('管理员推荐码更新成功:', updatedAdmin)
  } catch (error) {
    console.error('更新失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminInviteCode() 