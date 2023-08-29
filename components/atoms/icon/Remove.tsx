import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconRemove: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
  onClick,
}): JSX.Element => {
  return (
    <svg
      onClick={onClick}
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
        d="M14.6964 25.7882C14.1106 25.2024 14.1106 24.2527 14.6964 23.6669L23.1817 15.1816C23.7675 14.5958 24.7172 14.5958 25.303 15.1816C25.8888 15.7674 25.8888 16.7171 25.303 17.3029L16.8177 25.7882C16.232 26.374 15.2822 26.374 14.6964 25.7882Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.6967 15.182C15.2825 14.5962 16.2322 14.5962 16.818 15.182L25.3033 23.6673C25.8891 24.2531 25.8891 25.2028 25.3033 25.7886C24.7175 26.3744 23.7677 26.3744 23.1819 25.7886L14.6967 17.3033C14.1109 16.7175 14.1109 15.7678 14.6967 15.182Z"
        fill="white"
      />
    </svg>
  )
}
