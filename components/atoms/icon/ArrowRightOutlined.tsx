import React from 'react'
import { colors } from 'styles/colors'
import { PropsIcon } from 'utils/types'

export const ArrowRightOutlined = ({
  width = 16,
  height = 16,
  color = colors.offWhite,
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
        d="M9.52197 3.33337L14 8.00004L9.52197 12.6667"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="12.8218"
        y1="8.35449"
        x2="2.99973"
        y2="8.35449"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
