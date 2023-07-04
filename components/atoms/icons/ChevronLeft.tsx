import React from 'react'
import { PropsIcon } from 'utils/types'

export const IconChevronLeft: React.FC<PropsIcon> = ({
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
        d="M25.8839 9.11612C25.3957 8.62796 24.6043 8.62796 24.1161 9.11612L14.1161 19.1161C13.628 19.6043 13.628 20.3957 14.1161 20.8839L24.1161 30.8839C24.6043 31.372 25.3957 31.372 25.8839 30.8839C26.372 30.3957 26.372 29.6043 25.8839 29.1161L16.7678 20L25.8839 10.8839C26.372 10.3957 26.372 9.60427 25.8839 9.11612Z"
        fill={color}
      />
    </svg>
  )
}
