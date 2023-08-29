import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const PreApprovalOTP = ({ width = 60, height = 80 }: PropsIcon) => {
  return (
    <svg
      width="60"
      height="80"
      viewBox="0 0 60 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height }}
    >
      <g filter="url(#filter0_d)">
        <rect x="16" y="15" width="28" height="48" rx="4" fill="#031838" />
        <rect x="17" y="17" width="26" height="44" rx="2" fill="white" />
        <rect x="18" y="35" width="3.16667" height="4" rx="1" fill="#E4E9F1" />
        <rect x="18" y="55" width="24" height="4" rx="1" fill="#2825A4" />
        <rect
          x="22.167"
          y="35"
          width="3.16667"
          height="4"
          rx="1"
          fill="#E4E9F1"
        />
        <rect
          x="26.334"
          y="35"
          width="3.16667"
          height="4"
          rx="1"
          fill="#E4E9F1"
        />
        <rect
          x="30.501"
          y="35"
          width="3.16667"
          height="4"
          rx="1"
          fill="#E4E9F1"
        />
        <rect
          x="34.668"
          y="35"
          width="3.16667"
          height="4"
          rx="1"
          fill="#E4E9F1"
        />
        <rect
          x="38.835"
          y="35"
          width="3.16667"
          height="4"
          rx="1"
          fill="#E4E9F1"
        />
        <rect x="18" y="23" width="24" height="2" rx="1" fill="#031838" />
        <rect x="18" y="27" width="12" height="1" rx="0.5" fill="#9EA3AC" />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0"
          width="60"
          height="80"
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
