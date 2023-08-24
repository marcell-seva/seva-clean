import React, { ReactElement } from 'react'
import { colors } from 'styles/colors'
import { PropsIcon } from 'utils/types'

export const CameraFrame = ({
  width,
  height,
  color = colors.white,
}: PropsIcon): ReactElement => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 328 204"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="1.5"
        y="1.5"
        rx="6"
        width="325.001"
        height="199.287"
        stroke={color}
        strokeWidth="3"
      />
      <rect
        x="231.5"
        y="39.5"
        rx="6"
        width="77"
        height="93"
        stroke={color}
        strokeWidth="3"
      />
    </svg>
  )
}
