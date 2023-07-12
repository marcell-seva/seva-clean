import React from 'react'
import { PropsIcon } from 'utils/types'

export const IconWarningCircle: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
  fillColor = 'white',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="16" fill={color} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 13.5C20.8284 13.5 21.5 14.1716 21.5 15L21.5 22C21.5 22.8284 20.8284 23.5 20 23.5C19.1716 23.5 18.5 22.8284 18.5 22L18.5 15C18.5 14.1716 19.1716 13.5 20 13.5Z"
        fill={fillColor}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.5 26C18.5 25.1716 19.1716 24.5 20 24.5H20.01C20.8384 24.5 21.51 25.1716 21.51 26C21.51 26.8284 20.8384 27.5 20.01 27.5H20C19.1716 27.5 18.5 26.8284 18.5 26Z"
        fill={fillColor}
      />
    </svg>
  )
}
