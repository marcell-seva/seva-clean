import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconPlus: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20 4.75C20.6904 4.75 21.25 5.30964 21.25 6V34C21.25 34.6904 20.6904 35.25 20 35.25C19.3096 35.25 18.75 34.6904 18.75 34V6C18.75 5.30964 19.3096 4.75 20 4.75Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.75 20C4.75 19.3096 5.30964 18.75 6 18.75H34C34.6904 18.75 35.25 19.3096 35.25 20C35.25 20.6904 34.6904 21.25 34 21.25H6C5.30964 21.25 4.75 20.6904 4.75 20Z"
        fill={color}
      />
    </svg>
  )
}
