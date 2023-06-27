import React from 'react'
import { PropsIcon } from '../../../utils/types'

export const IconList: React.FC<PropsIcon> = ({
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
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.5 14.3099C8.88071 14.3099 10 13.1906 10 11.8099C10 10.4292 8.88071 9.30994 7.5 9.30994C6.11929 9.30994 5 10.4292 5 11.8099C5 13.1906 6.11929 14.3099 7.5 14.3099ZM13.2485 10.573C12.5582 10.573 11.9985 11.1326 11.9985 11.823C11.9985 12.5134 12.5582 13.073 13.2485 13.073H33.75C34.4404 13.073 35 12.5134 35 11.823C35 11.1326 34.4404 10.573 33.75 10.573H13.2485ZM13.2485 18.5452C12.5582 18.5452 11.9985 19.1048 11.9985 19.7952C11.9985 20.4855 12.5582 21.0452 13.2485 21.0452H33.75C34.4404 21.0452 35 20.4855 35 19.7952C35 19.1048 34.4404 18.5452 33.75 18.5452H13.2485ZM11.9985 27.7673C11.9985 27.077 12.5582 26.5173 13.2485 26.5173H33.75C34.4404 26.5173 35 27.077 35 27.7673C35 28.4577 34.4404 29.0173 33.75 29.0173H13.2485C12.5582 29.0173 11.9985 28.4577 11.9985 27.7673ZM10 19.7822C10 21.1629 8.88071 22.2822 7.5 22.2822C6.11929 22.2822 5 21.1629 5 19.7822C5 18.4015 6.11929 17.2822 7.5 17.2822C8.88071 17.2822 10 18.4015 10 19.7822ZM7.5 30.2544C8.88071 30.2544 10 29.1351 10 27.7544C10 26.3737 8.88071 25.2544 7.5 25.2544C6.11929 25.2544 5 26.3737 5 27.7544C5 29.1351 6.11929 30.2544 7.5 30.2544Z"
        fill={color}
      />
    </svg>
  )
}
