import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconSquareCheckedBox: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill={color} />
      <g clipPath="url(#clip0_1383_947)">
        <path
          d="M6.50008 10.085L4.41508 8L3.70508 8.705L6.50008 11.5L12.5001 5.5L11.7951 4.795L6.50008 10.085Z"
          fill="white"
        />
      </g>
      <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke={color} />
      <defs>
        <clipPath id="clip0_1383_947">
          <rect
            width="12"
            height="12"
            fill="white"
            transform="translate(2 2)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
