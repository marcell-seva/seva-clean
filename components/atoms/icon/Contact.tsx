import React from 'react'
import { PropsIcon } from 'utils/types'

export const Contact = ({ width = 88, height = 88 }: PropsIcon) => {
  return (
    <svg
      width="88"
      height="88"
      viewBox="0 0 88 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width, height }}
    >
      <g filter="url(#filter0_d)">
        <circle cx="44" cy="43" r="28" fill="#EC0A23" />
        <path
          d="M38.001 33C34.6873 33 32.001 35.6863 32.001 39V43C32.001 43.2403 32.0151 43.4774 32.0426 43.7104C32.0149 43.802 32 43.8993 32 44V52.8258C32 53.6801 33.0021 54.141 33.6508 53.585L38.4383 49.4815C38.8008 49.1708 39.2624 49 39.7398 49H50.001C53.3147 49 56.001 46.3137 56.001 43V39C56.001 35.6863 53.3147 33 50.001 33H38.001Z"
          fill="white"
          stroke="white"
          strokeWidth="2"
        />
      </g>
      <defs>
        <filter
          id="filter0_d"
          x="0"
          y="0"
          width="88"
          height="88"
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
