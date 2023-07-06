import React from 'react'
import { PropsIcon } from 'utils/types'

export const FastPrevious = ({ width, height }: PropsIcon) => {
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
        d="M21 19L14.0368 12.0368L21 5.07366"
        stroke="#52627A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 19L8.03683 12.0368L15 5.07366"
        stroke="#52627A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
