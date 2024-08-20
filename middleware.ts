import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value
  const url = req.nextUrl.clone()

  if (!token && url.pathname === '/signin') {
    return NextResponse.next()
  }

  if (!token) {
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }

  if (token && url.pathname === '/signin') {
    url.pathname = '/admin'
    return NextResponse.redirect(url)
  }

  try {
    const response = await axios.post(
      'http://localhost:3000/api/verify-token',
      JSON.stringify({ token })
    )

    if (response.status === 200) {
      return NextResponse.next()
    } else {
      url.pathname = '/signin'
      return NextResponse.redirect(url)
    }
  } catch (error: any) {
    url.pathname = '/signin'
    return NextResponse.redirect(url)
  }
}

export const config = {
  matcher: ['/admin/:path*', '/signin'],
}
