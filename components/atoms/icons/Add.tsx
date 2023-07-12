import React from 'react'
import { PropsIcon } from 'utils/types'

export const IconAdd: React.FC<PropsIcon> = ({
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
      <circle cx="20" cy="20" r="16" fill={color} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.9995 27.9852C19.1711 27.9852 18.4995 27.3137 18.4995 26.4852L18.4995 14.4852C18.4995 13.6568 19.1711 12.9852 19.9995 12.9852C20.8279 12.9852 21.4995 13.6568 21.4995 14.4852V26.4852C21.4995 27.3137 20.8279 27.9852 19.9995 27.9852Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5 20.4854C12.5 19.6569 13.1715 18.9854 14 18.9854L26 18.9854C26.8284 18.9854 27.5 19.6569 27.5 20.4854C27.5 21.3138 26.8284 21.9854 26 21.9854L14 21.9854C13.1715 21.9854 12.5 21.3138 12.5 20.4854Z"
        fill="white"
      />
    </svg>
  )
}
