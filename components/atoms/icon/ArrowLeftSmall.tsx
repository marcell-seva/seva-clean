import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const ArrowLeftSmall: React.FC<PropsIcon> = ({
  width = 15,
  height = 15,
  color = '#52627A',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.5 15.8333L6.69736 10.0306L12.5 4.22797"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
