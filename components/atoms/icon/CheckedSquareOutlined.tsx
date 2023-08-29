import React from 'react'
import { Property } from 'csstype'

interface CheckedSquareOutlinedProps {
  width?: Property.Width<string | number>
  height?: Property.Height<string | number>
  color?: string
}

export const CheckedSquareOutlined = ({
  width = 16,
  height = 16,
}: CheckedSquareOutlinedProps) => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height }}
    >
      <rect width="16" height="16" rx="2" fill="#2825A4" />
      <path
        d="M11 6L6.875 10.5L5 8.45455"
        stroke="#F2F5F9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
