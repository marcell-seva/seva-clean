import { NextRequest, NextResponse } from 'next/server'

const Middleware = (req: NextRequest) => {
  if (req.nextUrl.pathname === '/partnership/PTBC') {
    return NextResponse.redirect(
      new URL(req.nextUrl.origin + req.nextUrl.pathname.toLowerCase()),
    )
  }

  return NextResponse.next()
}

export default Middleware
