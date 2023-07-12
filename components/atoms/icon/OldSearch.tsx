import React from 'react'
import { colors } from '../../../styles/colors'
import elementId from 'helpers/elementIds'
import { PropsIcon } from 'utils/types'

export const Search = ({
  width = 18,
  height = 18,
  color = colors.placeholder,
}: PropsIcon) => {
  return (
    <svg
      data-testid={elementId.Homepage.GlobalHeader.IconSearch}
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: width,
        height: height,
      }}
    >
      <path
        d="M11 20C15.9706 20 20 15.9706 20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 22L18 18"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
