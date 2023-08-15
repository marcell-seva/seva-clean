import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const Triangle: React.FC<PropsIcon> = ({
  width = 13,
  height = 15,
  color = '#FEEBB9',
}): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 13 15"
      fill="none"
    >
      <path
        d="M1.12579 14.247L12.2422 7.12109L0.97489 0.1461L1.12579 14.247Z"
        fill={color}
      />
    </svg>
  )
}
