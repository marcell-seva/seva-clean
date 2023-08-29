import React from 'react'
import { colors } from 'styles/colors'
import { PropsIcon } from '../../../utils/types'

export const CloseOutlined2 = ({
  width = 24,
  height = 24,
  color = colors.label,
}: PropsIcon) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15 1L1 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0.999999 1L15 15"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
