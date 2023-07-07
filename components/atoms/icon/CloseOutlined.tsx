import React from 'react'
import { colors } from 'styles/colors'
import { PropsIcon } from 'utils/types'

export const CloseOutlined = ({
  width = 24,
  height = 24,
  color = colors.label,
}: PropsIcon) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: width, height: height }}
    >
      <path
        d="M6 6.00003L18.7742 18.7742"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 18.7742L18.7742 6.00001"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
