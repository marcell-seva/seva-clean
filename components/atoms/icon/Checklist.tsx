import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconChecklist: React.FC<PropsIcon> = ({
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
        d="M5.25253 19.1086C6.03358 18.3276 7.29991 18.3276 8.08096 19.1086L16.0948 27.1225L33.5368 9.68051C34.3179 8.89946 35.5842 8.89946 36.3652 9.68051C37.1463 10.4616 37.1463 11.7279 36.3652 12.5089L16.0948 32.7793L5.25253 21.937C4.47149 21.156 4.47149 19.8897 5.25253 19.1086Z"
        fill={color}
      />
    </svg>
  )
}
