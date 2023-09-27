import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconSearch: React.FC<PropsIcon> = ({
  width,
  height,
  onClick,
  alt,
  color = '#05256E',
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
        d="M18.25 7.5C12.3129 7.5 7.5 12.3129 7.5 18.25C7.5 24.1871 12.3129 29 18.25 29C24.1871 29 29 24.1871 29 18.25C29 12.3129 24.1871 7.5 18.25 7.5ZM5 18.25C5 10.9322 10.9322 5 18.25 5C25.5678 5 31.5 10.9322 31.5 18.25C31.5 25.5678 25.5678 31.5 18.25 31.5C10.9322 31.5 5 25.5678 5 18.25Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M26.6994 26.6994C27.1876 26.2113 27.9791 26.2113 28.4672 26.6994L33.8006 32.0328C34.2887 32.5209 34.2887 33.3124 33.8006 33.8006C33.3124 34.2887 32.5209 34.2887 32.0328 33.8006L26.6994 28.4672C26.2113 27.9791 26.2113 27.1876 26.6994 26.6994Z"
        fill={color}
      />
    </svg>
  )
}
