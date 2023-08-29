import React from 'react'
import { Property } from 'csstype'
import { colors } from 'styles/colors'

interface CheckedCircleOutlinedProps {
  width?: Property.Width<string | number>
  height?: Property.Height<string | number>
  color?: string
  strokeColor?: string
  className?: string
}

export const CheckedCircleOutlined = ({
  width = 24,
  height = 24,
  color = colors.placeholder,
  strokeColor = colors.inputBg,
  className,
}: CheckedCircleOutlinedProps) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: width,
        height: height,
      }}
      className={className}
    >
      <circle cx="12" cy="12" r="12" fill={color} />
      <path
        d="M16.5 9L10.3125 15.75L7.5 12.6818"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
