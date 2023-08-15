import React from 'react'
import { colors } from 'styles/colors'
import { PropsIcon } from 'utils/types'

export const Loading = ({
  color = colors.offWhite,
  width = 24,
  height = 24,
  className,
}: PropsIcon) => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: width, height: height }}
      className={className}
    >
      <path
        d="M9.99992 1.66665C8.35174 1.66664 6.74058 2.15539 5.37017 3.07106C3.99976 3.98674 2.93165 5.28823 2.30092 6.81095C1.67019 8.33367 1.50516 10.0092 1.82671 11.6257C2.14825 13.2422 2.94192 14.7271 4.10736 15.8925C5.2728 17.058 6.75766 17.8516 8.37416 18.1732C9.99067 18.4947 11.6662 18.3297 13.1889 17.699C14.7117 17.0682 16.0132 16.0001 16.9288 14.6297C17.8445 13.2593 18.3333 11.6482 18.3333 9.99998"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
