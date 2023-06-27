import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconClose: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
  onClick,
  datatestid,
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      data-testid={datatestid}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.11612 9.11613C9.60427 8.62797 10.3957 8.62797 10.8839 9.11613L30.884 29.1163C31.3722 29.6044 31.3722 30.3959 30.884 30.884C30.3959 31.3722 29.6044 31.3722 29.1163 30.884L9.11612 10.8839C8.62796 10.3957 8.62796 9.60428 9.11612 9.11613Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.11612 30.884C8.62796 30.3959 8.62796 29.6044 9.11612 29.1162L29.1163 9.11612C29.6044 8.62796 30.3959 8.62796 30.884 9.11612C31.3722 9.60427 31.3722 10.3957 30.884 10.8839L10.8839 30.884C10.3957 31.3722 9.60427 31.3722 9.11612 30.884Z"
        fill={color}
      />
    </svg>
  )
}
