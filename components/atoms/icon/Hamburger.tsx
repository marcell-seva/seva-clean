import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconHamburger: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
  alt,
  onClick,
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
    >
      <title>{alt}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.75 11C5.75 10.3096 6.30964 9.75 7 9.75H33C33.6904 9.75 34.25 10.3096 34.25 11C34.25 11.6904 33.6904 12.25 33 12.25H7C6.30964 12.25 5.75 11.6904 5.75 11Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.75 20C5.75 19.3096 6.30964 18.75 7 18.75H33C33.6904 18.75 34.25 19.3096 34.25 20C34.25 20.6904 33.6904 21.25 33 21.25H7C6.30964 21.25 5.75 20.6904 5.75 20Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.75 29C5.75 28.3096 6.30964 27.75 7 27.75H33C33.6904 27.75 34.25 28.3096 34.25 29C34.25 29.6904 33.6904 30.25 33 30.25H7C6.30964 30.25 5.75 29.6904 5.75 29Z"
        fill={color}
      />
    </svg>
  )
}
