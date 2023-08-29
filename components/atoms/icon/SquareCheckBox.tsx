import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconSquareCheckBox: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#AFB3BA',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill="white" />
      <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" stroke={color} />
    </svg>
  )
}
