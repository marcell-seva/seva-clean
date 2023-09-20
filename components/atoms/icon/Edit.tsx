import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconEdit: React.FC<PropsIcon> = ({
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
        d="M26.6653 5.06656C26.6653 5.06656 29.9631 3.5646 32.8364 6.43792C35.7097 9.31124 34.2078 12.609 34.2078 12.609L15.0087 31.8081L6.43774 32.8366L7.46626 24.2656L26.6653 5.06656ZM9.84544 25.4219L9.29904 29.9753L13.8524 29.4289L32.0169 11.2643C32.059 11.0777 32.0961 10.8377 32.0998 10.5665C32.1085 9.93683 31.9487 9.08578 31.0686 8.20568C30.1885 7.32559 29.3375 7.16582 28.7078 7.1745C28.4366 7.17825 28.1966 7.21528 28.01 7.25738L9.84544 25.4219Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M29.3223 16.776L22.139 9.59272L23.9067 7.82495L31.09 15.0083L29.3223 16.776Z"
        fill={color}
      />
    </svg>
  )
}
