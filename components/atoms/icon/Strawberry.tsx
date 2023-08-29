import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconStrawberry: React.FC<PropsIcon> = ({
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
        d="M5.75 11C5.75 10.3096 6.30964 9.75 7 9.75H33C33.6904 9.75 34.25 10.3096 34.25 11C34.25 11.6904 33.6904 12.25 33 12.25H7C6.30964 12.25 5.75 11.6904 5.75 11Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.75 20C8.75 19.3096 9.30964 18.75 10 18.75H30C30.6904 18.75 31.25 19.3096 31.25 20C31.25 20.6904 30.6904 21.25 30 21.25H10C9.30964 21.25 8.75 20.6904 8.75 20Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.75 29C11.75 28.3096 12.3096 27.75 13 27.75H27C27.6904 27.75 28.25 28.3096 28.25 29C28.25 29.6904 27.6904 30.25 27 30.25H13C12.3096 30.25 11.75 29.6904 11.75 29Z"
        fill={color}
      />
    </svg>
  )
}
