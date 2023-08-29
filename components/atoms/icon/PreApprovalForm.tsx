import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const PreApprovalForm = ({ width = 76, height = 84 }: PropsIcon) => {
  return (
    <svg
      width="76"
      height="84"
      viewBox="0 0 76 84"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height }}
    >
      <g filter="url(#filter0_d)">
        <rect x="16" y="15" width="44" height="52" rx="4" fill="#FCFCFC" />
      </g>
      <rect x="18" y="19" width="34" height="2" rx="1" fill="#52627A" />
      <rect x="18" y="34" width="26" height="2" rx="1" fill="#52627A" />
      <rect x="18" y="50" width="34" height="2" rx="1" fill="#52627A" />
      <rect
        x="18.25"
        y="23.25"
        width="39.5"
        height="7.5"
        rx="1.75"
        fill="white"
        stroke="#9EA3AC"
        strokeWidth="0.5"
      />
      <rect
        x="18.25"
        y="38.25"
        width="39.5"
        height="7.5"
        rx="1.75"
        fill="white"
        stroke="#9EA3AC"
        strokeWidth="0.5"
      />
      <rect
        x="18.25"
        y="55.25"
        width="39.5"
        height="7.5"
        rx="1.75"
        fill="white"
        stroke="#9EA3AC"
        strokeWidth="0.5"
      />
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0"
          width="76"
          height="84"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="8" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.0101215 0 0 0 0 0.0939085 0 0 0 0 0.220833 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  )
}
