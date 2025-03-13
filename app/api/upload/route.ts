import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return NextResponse.json({ 
        code: 1,
        message: "未找到文件" 
      }, { status: 400 })
    }

    // 获取文件后缀
    const ext = file.name.split(".").pop()
    // 生成随机文件名
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${ext}`
    
    // 将文件保存到public/uploads目录
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // 确保uploads目录存在
    const uploadDir = join(process.cwd(), "public", "uploads")
    await writeFile(join(uploadDir, fileName), buffer)
    
    // 返回文件URL
    return NextResponse.json({
      code: 0,
      data: {
        url: `/uploads/${fileName}`
      },
      message: "上传成功"
    })
    
  } catch (error) {
    console.error("文件上传失败:", error)
    return NextResponse.json({
      code: 1,
      message: "文件上传失败"
    }, { status: 500 })
  }
} 