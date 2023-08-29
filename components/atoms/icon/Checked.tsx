import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconChecked: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
  fillColor = 'white',
}): JSX.Element => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8.0001" cy="8.0001" r="6.4" fill={color} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.17574 7.66991C5.41005 7.4356 5.78995 7.4356 6.02426 7.66991L7.29706 8.9427L10.2669 5.97286C10.5012 5.73854 10.8811 5.73854 11.1154 5.97286C11.3497 6.20717 11.3497 6.58707 11.1154 6.82138L7.29706 10.6398L5.17574 8.51844C4.94142 8.28412 4.94142 7.90423 5.17574 7.66991Z"
        fill={fillColor}
      />
    </svg>
  )
}
