import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconFacebook: React.FC<PropsIcon> = ({
  width,
  height,
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
        d="M26.9137 21.8739L27.7558 16.4471H22.5684V12.9197C22.5684 11.4358 23.2926 9.98587 25.6084 9.98587H28V5.36461C26.6073 5.13935 25.2 5.01749 23.7895 5C19.52 5 16.7326 7.60317 16.7326 12.3092V16.4471H12V21.8739H16.7326V35H22.5684V21.8739H26.9137Z"
        fill="#337FFF"
      />
    </svg>
  )
}
