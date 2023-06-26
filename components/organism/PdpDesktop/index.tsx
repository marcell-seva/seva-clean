import React from 'react'
import { useRouter } from 'next/router'

export default function index() {
  const router = useRouter()
  console.log('qwe', router.query)
  return <h1>DEKSTOP SLUGS:</h1>
}
