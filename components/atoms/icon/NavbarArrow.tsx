import React from 'react'
import { IconProps } from '../iconType'

export const NavbarArrow = ({ width = 8, height = 4 }: IconProps) => {
  return (
    <svg
      width="8"
      height="4"
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height }}
    >
      <path d="M8 0H0L4 4L8 0Z" fill="#031838" />
    </svg>
  )
}
