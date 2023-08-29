import { PropsIcon } from '../../../utils/types'
import React from 'react'

export const BackIcon = ({ width = 16, height = 16 }: PropsIcon) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 11 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height }}
    >
      <path
        d="M9.25 16.5834L1.70656 9.03994L9.25 1.4965"
        stroke="#05256E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
