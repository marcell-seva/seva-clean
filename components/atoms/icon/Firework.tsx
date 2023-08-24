import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const Firework: React.FC<PropsIcon> = ({
  width = 31,
  height = 31,
  color = '#F1C551',
}): JSX.Element => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 31 31"
      fill="none"
    >
      <path d="M15.694 0H14.5977V4.32985H15.694V0Z" fill={color} />
      <path d="M15.694 25.9824H14.5977V30.3123H15.694V25.9824Z" fill={color} />
      <path
        d="M8.04585 1.75719L7.09644 2.30566L9.26013 6.05532L10.2095 5.50685L8.04585 1.75719Z"
        fill={color}
      />
      <path
        d="M21.0312 24.2588L20.0818 24.8073L22.2455 28.5569L23.1949 28.0084L21.0312 24.2588Z"
        fill={color}
      />
      <path
        d="M2.30182 7.10705L1.75366 8.05701L5.50118 10.2219L6.04934 9.27198L2.30182 7.10705Z"
        fill={color}
      />
      <path
        d="M24.7965 20.104L24.2483 21.054L27.9958 23.2189L28.544 22.2689L24.7965 20.104Z"
        fill={color}
      />
      <path d="M4.32738 14.6078H0V15.7047H4.32738V14.6078Z" fill={color} />
      <path
        d="M30.2949 14.6078H25.9675V15.7047H30.2949V14.6078Z"
        fill={color}
      />
      <path
        d="M5.50406 20.0987L1.7561 22.2632L2.30415 23.2132L6.05211 21.0487L5.50406 20.0987Z"
        fill={color}
      />
      <path
        d="M27.9916 7.10882L24.2437 9.27332L24.7917 10.2234L28.5397 8.05888L27.9916 7.10882Z"
        fill={color}
      />
      <path
        d="M9.26379 24.2628L7.1001 28.0125L8.04951 28.5609L10.2132 24.8113L9.26379 24.2628Z"
        fill={color}
      />
      <path
        d="M22.2494 1.76121L20.0857 5.51086L21.0351 6.05934L23.1988 2.30968L22.2494 1.76121Z"
        fill={color}
      />
    </svg>
  )
}
