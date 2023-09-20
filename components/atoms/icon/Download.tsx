import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconDownload: React.FC<PropsIcon> = ({
  width,
  height,
  alt,
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
      <title>{alt}</title>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27.4 17.5803C27.8898 18.0669 27.8925 18.8583 27.4059 19.3481L20.526 26.274C20.2914 26.5103 19.9722 26.6431 19.6392 26.6431C19.3063 26.6431 18.9871 26.5103 18.7524 26.274L11.8725 19.3481C11.386 18.8583 11.3886 18.0669 11.8784 17.5803C12.3682 17.0938 13.1596 17.0964 13.6462 17.5862L19.6392 23.6194L25.6323 17.5862C26.1188 17.0964 26.9103 17.0938 27.4 17.5803Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.7215 24.0737C19.0312 24.0737 18.4715 23.514 18.4715 22.8237V7.99036C18.4715 7.3 19.0312 6.74036 19.7215 6.74036C20.4119 6.74036 20.9715 7.3 20.9715 7.99036V22.8237C20.9715 23.514 20.4119 24.0737 19.7215 24.0737Z"
        fill={color}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 18.7501C8.69036 18.7501 9.25 19.3097 9.25 20.0001V28.3334C9.25 30.4045 10.9289 32.0834 13 32.0834H25.6667C27.7377 32.0834 29.4167 30.4045 29.4167 28.3334V20.0001C29.4167 19.3097 29.9763 18.7501 30.6667 18.7501C31.357 18.7501 31.9167 19.3097 31.9167 20.0001V28.3334C31.9167 31.7852 29.1184 34.5834 25.6667 34.5834H13C9.54821 34.5834 6.75 31.7852 6.75 28.3334V20.0001C6.75 19.3097 7.30964 18.7501 8 18.7501Z"
        fill={color}
      />
    </svg>
  )
}
