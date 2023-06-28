import React from 'react'
import { PropsIcon } from 'utils/types'

export const RotateLeft: React.FC<PropsIcon> = ({
  width = 65,
  height = 30,
  color = '#000',
}): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 65 30"
    >
      <path
        fill={color}
        fillRule="evenodd"
        d="M0 23.746l10.524-3.127-2.653 2.01c11.62.477 54.034-.134 54.034-10.14C61.905 3.11 36.45.171 26.033 0 37.027.17 65 2.483 65 13.115 65 26.248 17.054 26.61 6.852 26.312L9.286 30 0 23.746z"
      />
    </svg>
  )
}
