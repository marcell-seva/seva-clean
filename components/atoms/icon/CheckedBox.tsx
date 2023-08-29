import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconCheckedBox: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
  fillColor = 'white',
  isActive,
}): JSX.Element => {
  return isActive ? (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.773438" width="15" height="15" rx="3.5" fill={color} />
      <g clipPath="url(#clip0_4593_89017)">
        <path
          d="M6.50008 10.3584L4.41508 8.27336L3.70508 8.97836L6.50008 11.7734L12.5001 5.77336L11.7951 5.06836L6.50008 10.3584Z"
          fill={fillColor}
        />
      </g>
      <rect
        x="0.5"
        y="0.773438"
        width="15"
        height="15"
        rx="3.5"
        stroke={color}
      />
      <defs>
        <clipPath id="clip0_4593_89017">
          <rect
            width="12"
            height="12"
            fill={fillColor}
            transform="translate(2 2.27344)"
          />
        </clipPath>
      </defs>
    </svg>
  ) : (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.773438" width="15" height="15" rx="3.5" fill="white" />
      <rect
        x="0.5"
        y="0.773438"
        width="15"
        height="15"
        rx="3.5"
        stroke="#AFB3BA"
      />
    </svg>
  )
}
