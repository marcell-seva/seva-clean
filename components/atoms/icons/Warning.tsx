import React from 'react'
import { PropsIcon } from 'utils/types'

export const IconWarning: React.FC<PropsIcon> = ({
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
        d="M20.5 5C19.6716 5 19 5.67157 19 6.5V26.5C19 27.3284 19.6716 28 20.5 28C21.3284 28 22 27.3284 22 26.5V6.5C22 5.67157 21.3284 5 20.5 5ZM20.5 35C21.3284 35 22 34.3284 22 33.5C22 32.6716 21.3284 32 20.5 32C19.6716 32 19 32.6716 19 33.5C19 34.3284 19.6716 35 20.5 35Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18 6.5C18 5.11929 19.1193 4 20.5 4C21.8807 4 23 5.11929 23 6.5V26.5C23 27.8807 21.8807 29 20.5 29C19.1193 29 18 27.8807 18 26.5V6.5ZM23 33.5C23 34.8807 21.8807 36 20.5 36C19.1193 36 18 34.8807 18 33.5C18 32.1193 19.1193 31 20.5 31C21.8807 31 23 32.1193 23 33.5ZM19 6.5C19 5.67157 19.6716 5 20.5 5C21.3284 5 22 5.67157 22 6.5V26.5C22 27.3284 21.3284 28 20.5 28C19.6716 28 19 27.3284 19 26.5V6.5ZM22 33.5C22 34.3284 21.3284 35 20.5 35C19.6716 35 19 34.3284 19 33.5C19 32.6716 19.6716 32 20.5 32C21.3284 32 22 32.6716 22 33.5Z"
        fill={color}
      />
    </svg>
  )
}
