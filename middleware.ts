import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ADMIN_TOKEN_NAME, USER_TOKEN_NAME } from '@/lib/constants'

// 不需要登录就能访问的路由
const publicRoutes = [
  '/login',
  '/register',
  '/api/login',
  '/api/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/market',
  '/admin/login',     // 添加管理员登录页
  '/api/admin/login'  // 添加管理员登录API
]

// 检查路径是否匹配公开路由
const isPublicRoute = (path: string) => {
  return publicRoutes.some(route => path.startsWith(route))
}

// 添加默认导出
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')
  const adminToken = request.cookies.get(ADMIN_TOKEN_NAME)

  // 管理员API路由处理
  if (pathname.startsWith('/api/admin/') && !isPublicRoute(pathname)) {
    if (!adminToken) {
      console.log('管理员API访问无admin_token:', pathname)
      return NextResponse.json(
        { error: '请先登录管理员账号', code: 1 },
        { status: 401 }
      )
    }
    
    console.log('管理员API访问有admin_token:', pathname)
    
    // 为API请求添加Authorization头
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${adminToken.value}`)
    requestHeaders.set('X-Admin', 'true')
    
    // 确保所有API请求都支持credentials
    if (!requestHeaders.has('credentials')) {
      requestHeaders.set('credentials', 'include')
    }
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }
  
  // 普通用户API路由处理
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin/') && !isPublicRoute(pathname)) {
    if (!token) {
      console.log('API访问无token:', pathname)
      return NextResponse.json(
        { error: '请先登录', code: 1 },
        { status: 401 }
      )
    }
    
    console.log('API访问有token:', pathname)
    
    // 为API请求添加Authorization头
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('Authorization', `Bearer ${token.value}`)
    
    // 确保所有API请求都支持credentials
    if (!requestHeaders.has('credentials')) {
      requestHeaders.set('credentials', 'include')
    }
    
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  }

  // 如果是页面路由
  if (!pathname.startsWith('/api/')) {
    // 管理员路径特殊处理
    if (pathname.startsWith('/admin/')) {
      // 如果访问管理员登录页，即使有token也不重定向
      if (pathname === '/admin/login') {
        console.log('访问管理员登录页面')
        return NextResponse.next()
      }
      
      // 如果访问其他管理员页面但没有管理员token，重定向到管理员登录页
      if (!adminToken) {
        console.log('访问管理员页面无admin_token，重定向到管理员登录页:', pathname)
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      
      // 有管理员token访问管理员页面，在API层验证权限
      console.log('访问管理员页面:', pathname)
      return NextResponse.next()
    }
    
    // 非管理员页面的处理
    // 如果是公开路由且已登录，重定向到首页
    if (isPublicRoute(pathname) && token) {
      // 不重定向管理员相关页面
      if (!pathname.startsWith('/admin/')) {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }

    // 如果不是公开路由且未登录，重定向到登录页
    if (!isPublicRoute(pathname) && !token) {
      console.log('页面访问无token，重定向到登录页:', pathname)
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // 针对充值页面，放宽限制，不检查token格式
    if (pathname.startsWith('/recharge')) {
      console.log('访问充值页面，存在token:', !!token)
    }
  }

  return NextResponse.next()
}

// 配置需要进行中间件处理的路由
export const config = {
  matcher: [
    /*
     * 匹配所有路由，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico
     * - avatars (头像文件)
     */
    '/((?!_next/static|_next/image|favicon.ico|avatars).*)',
  ],
} 