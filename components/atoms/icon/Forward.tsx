import React from 'react'
import { PropsIcon } from 'utils/types'

export const Forward = ({ width, height }: PropsIcon) => {
  return (
    <svg
      width="9"
      height="16"
      viewBox="0 0 9 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height }}
    >
      <path
        d="M1 1L7.96317 7.96317L1 14.9263"
        stroke="#52627A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
