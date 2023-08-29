import React from 'react'
import { colors } from '../../../styles/colors'
import { PropsIcon } from '../../../utils/types'

interface DownOutlinedProps extends PropsIcon {
  color?: string
  marginBottom?: string
}

export const DownOutlined = ({
  color = colors.placeholder,
  width = 16,
  height = 9,
  marginBottom = '0px',
  ...restProps
}: DownOutlinedProps) => {
  return (
    <svg
      width="16"
      height="9"
      viewBox="0 0 16 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height, marginBottom }}
      {...restProps}
    >
      <path
        d="M15 1L8.03683 7.96317L1.07366 0.999999"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
