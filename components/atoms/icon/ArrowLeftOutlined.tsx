import React from 'react'
import { colors } from 'styles/colors'
import { PropsIcon } from 'utils/types'

export const ArrowLeftOutlined = ({
  width = 20,
  height = 20,
  color = colors.secondary,
}: PropsIcon) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: width, height: height }}
    >
      <path
        d="M9.7168 5L2.99972 12L9.7168 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="1"
        y1="-1"
        x2="16.7331"
        y2="-1"
        transform="matrix(1 0 0 -1 3.26758 11.0317)"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
