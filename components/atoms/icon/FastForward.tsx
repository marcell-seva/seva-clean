import React from 'react'
import { PropsIcon } from 'utils/types'

export const FastForward = ({ width, height }: PropsIcon) => {
  return (
    <svg
      width="30"
      height="24"
      viewBox="0 0 30 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height }}
    >
      <path
        d="M9 5L15.9632 11.9632L9 18.9263"
        stroke="#52627A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 5L21.9632 11.9632L15 18.9263"
        stroke="#52627A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
