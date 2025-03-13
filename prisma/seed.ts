import { PrismaClient, Role } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

const main = async () => {
  // 创建管理员账号
  const hashedPassword = await hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: Role.ADMIN,
      inviteCode: 'ADMIN01',
      vipLevel: 9,
      vipName: '超级管理员'
    }
  })

  console.log('Created admin user:', admin)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 