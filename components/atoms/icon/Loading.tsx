import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconLoading: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#52627A',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.00065 1.16732C5.84693 1.16732 4.71911 1.50944 3.75983 2.15041C2.80054 2.79139 2.05287 3.70243 1.61135 4.76833C1.16984 5.83423 1.05432 7.00712 1.2794 8.13868C1.50448 9.27023 2.06006 10.3096 2.87586 11.1254C3.69167 11.9412 4.73107 12.4968 5.86262 12.7219C6.99418 12.947 8.16707 12.8315 9.23297 12.3899C10.2989 11.9484 11.2099 11.2008 11.8509 10.2415C12.4919 9.28219 12.834 8.15438 12.834 7.00065"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
