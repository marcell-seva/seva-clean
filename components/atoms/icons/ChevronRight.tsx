import React from 'react'
import { PropsIcon } from 'utils/types'

export const IconChevronRight: React.FC<PropsIcon> = ({
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
        d="M14.1161 9.11612C14.6043 8.62796 15.3957 8.62796 15.8839 9.11612L25.8839 19.1161C26.372 19.6043 26.372 20.3957 25.8839 20.8839L15.8839 30.8839C15.3957 31.372 14.6043 31.372 14.1161 30.8839C13.628 30.3957 13.628 29.6043 14.1161 29.1161L23.2322 20L14.1161 10.8839C13.628 10.3957 13.628 9.60427 14.1161 9.11612Z"
        fill={color}
      />
    </svg>
  )
}
