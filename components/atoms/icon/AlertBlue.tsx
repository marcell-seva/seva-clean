import React from 'react'
import { colors } from 'styles/colors'
import { PropsIcon } from 'utils/types'

export const AlertBlue = ({
  color = colors.primary1,
  width = 16,
  height = 16,
}: PropsIcon) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="8" transform="rotate(-180 8 8)" fill={color} />
      <path
        d="M7.99512 5L7.99512 8.5"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99512 10.5L8.00012 10.5"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
