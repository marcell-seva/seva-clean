import React from 'react'
import { PropsIcon } from '_revamp/utils/types'

export const RotateRight: React.FC<PropsIcon> = ({
  width = 65,
  height = 30,
  color = '#000',
}): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 65 30"
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M65 23.746L54.476 20.62l2.653 2.01c-11.62.477-54.034-.134-54.034-10.14C3.095 3.11 28.55.171 38.967 0 27.973.17 0 2.483 0 13.115 0 26.248 47.946 26.61 58.148 26.312L55.714 30 65 23.746z"
      />
    </svg>
  )
}
