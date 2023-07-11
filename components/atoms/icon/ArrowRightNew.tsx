import React from 'react'
import { PropsIcon } from 'utils/types'

export const ArrowRightNew = ({
  width = 24,
  height = 24,
  color = '#52627A',
}: PropsIcon) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14.2827 5L20.9998 12L14.2827 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="19.7329"
        y1="12.0317"
        x2="3.99985"
        y2="12.0317"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
