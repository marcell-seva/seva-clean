import React from 'react'
import { PropsIcon } from 'utils/types'

export const ThreeDots = ({ width = 20, height }: PropsIcon) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height, width }}
    >
      <circle cx="10" cy="10" r="10" fill="#E4E9F1" />
      <circle cx="10" cy="10" r="1" fill="#9EA3AC" />
      <circle cx="14" cy="10" r="1" fill="#9EA3AC" />
      <circle cx="6" cy="10" r="1" fill="#9EA3AC" />
    </svg>
  )
}
