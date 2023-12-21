import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const DoneTickToast: React.FC<PropsIcon> = ({
  width,
  height,
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 12.3137L9.65685 17.9706L20.9706 6.65687"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
