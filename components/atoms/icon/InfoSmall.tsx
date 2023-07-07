import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconInfoSmall: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#404040',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="5.99984" cy="6" r="4.58333" stroke={color} />
      <path
        d="M6.05078 7.87436L5.99745 5.79171"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.95459 4.12558L5.94926 3.91731"
        stroke={color}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
