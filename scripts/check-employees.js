const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkEmployees() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        user: true
      }
    })

    console.log('员工列表：')
    console.log(JSON.stringify(employees, null, 2))

  } catch (error) {
    console.error('查询出错：', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkEmployees() 