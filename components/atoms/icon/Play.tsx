import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconPlay: React.FC<PropsIcon> = ({
  width,
  height,
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
    >
      <title>{alt}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.58496 10.6854C9.58496 8.10668 12.4441 6.55507 14.6062 7.96041L28.9364 17.275C30.9081 18.5567 30.9081 21.4433 28.9364 22.7249L14.6062 32.0396C12.4441 33.4449 9.58496 31.8933 9.58496 29.3146V10.6854ZM13.2437 10.0565C12.7448 9.73221 12.085 10.0903 12.085 10.6854V29.3146C12.085 29.9097 12.7448 30.2678 13.2437 29.9434L27.5739 20.6288C28.0289 20.3331 28.0289 19.6669 27.5739 19.3711L13.2437 10.0565Z"
        fill={color}
      />
    </svg>
  )
}
