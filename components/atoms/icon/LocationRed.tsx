import React from 'react'
import elementId from 'helpers/elementIds'
import { PropsIcon } from 'utils/types'

export const LocationRed = ({
  color = '#D83130',
  width = 18,
  height = 18,
}: PropsIcon) => {
  return (
    <svg
      data-testid={elementId.Homepage.GlobalHeader.IconSearch}
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.9996 7.99978C15.9996 10.9986 11.9457 14.7896 9.89115 16.5184C9.21266 17.0893 8.24099 17.0893 7.56251 16.5184C5.50799 14.7896 1.4541 10.9986 1.4541 7.99978C1.4541 3.98316 4.71021 0.727051 8.72683 0.727051C12.7434 0.727051 15.9996 3.98316 15.9996 7.99978Z"
        stroke={color}
        strokeWidth="1"
      />
      <circle
        cx="8.72772"
        cy="8.00018"
        r="2.18182"
        stroke={color}
        strokeWidth="1"
      />
    </svg>
  )
}
