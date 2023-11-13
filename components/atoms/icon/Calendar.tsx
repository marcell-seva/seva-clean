import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconCalendar: React.FC<PropsIcon> = ({
  width,
  height,
  color = '#05256E',
  alt,
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
        d="M13.3334 4.08337C14.0238 4.08337 14.5834 4.64302 14.5834 5.33337V6.75004H25.4167V5.33337C25.4167 4.64302 25.9764 4.08337 26.6667 4.08337C27.3571 4.08337 27.9167 4.64302 27.9167 5.33337V6.75004H30.3334C32.6806 6.75004 34.5834 8.65283 34.5834 11V30.3334C34.5834 32.6806 32.6806 34.5834 30.3334 34.5834H9.66675C7.31953 34.5834 5.41675 32.6806 5.41675 30.3334V11C5.41675 8.65283 7.31954 6.75004 9.66675 6.75004H12.0834V5.33337C12.0834 4.64302 12.6431 4.08337 13.3334 4.08337ZM9.66675 9.25004C8.70025 9.25004 7.91675 10.0335 7.91675 11V13.4167H32.0834V11C32.0834 10.0335 31.2999 9.25004 30.3334 9.25004H9.66675ZM32.0834 15.9167H7.91675V30.3334C7.91675 31.2999 8.70025 32.0834 9.66675 32.0834H30.3334C31.2999 32.0834 32.0834 31.2999 32.0834 30.3334V15.9167ZM11.4167 21.3334C11.4167 20.643 11.9764 20.0834 12.6667 20.0834H14.0001C14.6904 20.0834 15.2501 20.643 15.2501 21.3334C15.2501 22.0237 14.6904 22.5834 14.0001 22.5834H12.6667C11.9764 22.5834 11.4167 22.0237 11.4167 21.3334ZM18.0834 21.3334C18.0834 20.643 18.6431 20.0834 19.3334 20.0834H20.6667C21.3571 20.0834 21.9167 20.643 21.9167 21.3334C21.9167 22.0237 21.3571 22.5834 20.6667 22.5834H19.3334C18.6431 22.5834 18.0834 22.0237 18.0834 21.3334ZM24.7501 21.3334C24.7501 20.643 25.3097 20.0834 26.0001 20.0834H27.3334C28.0238 20.0834 28.5834 20.643 28.5834 21.3334C28.5834 22.0237 28.0238 22.5834 27.3334 22.5834H26.0001C25.3097 22.5834 24.7501 22.0237 24.7501 21.3334ZM11.4167 26.6667C11.4167 25.9764 11.9764 25.4167 12.6667 25.4167H14.0001C14.6904 25.4167 15.2501 25.9764 15.2501 26.6667C15.2501 27.3571 14.6904 27.9167 14.0001 27.9167H12.6667C11.9764 27.9167 11.4167 27.3571 11.4167 26.6667ZM18.0834 26.6667C18.0834 25.9764 18.6431 25.4167 19.3334 25.4167H20.6667C21.3571 25.4167 21.9167 25.9764 21.9167 26.6667C21.9167 27.3571 21.3571 27.9167 20.6667 27.9167H19.3334C18.6431 27.9167 18.0834 27.3571 18.0834 26.6667ZM24.7501 26.6667C24.7501 25.9764 25.3097 25.4167 26.0001 25.4167H27.3334C28.0238 25.4167 28.5834 25.9764 28.5834 26.6667C28.5834 27.3571 28.0238 27.9167 27.3334 27.9167H26.0001C25.3097 27.9167 24.7501 27.3571 24.7501 26.6667Z"
        fill={color}
      />
    </svg>
  )
}
