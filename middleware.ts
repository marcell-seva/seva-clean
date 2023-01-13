// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const token = request.cookies.get('seva._token')?.value
  const refreshToken = request.cookies.get('seva._refreshToken')?.value

  if (refreshToken != undefined) {
    if (token != undefined) {
      //set isLoggedIn true
      console.log(refreshToken)
    } else {
      //hit the refresh token and set token
      response.cookies.set({
        name: 'seva._token',
        value: 'newToken',
        path: '/',
      })
      // set isLoggedIn true
    }
  }
  return response
}
