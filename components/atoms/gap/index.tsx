import React from 'react'
interface PropsGap {
  width?: number
  height?: number
}
export const Gap: React.FC<PropsGap> = ({ width, height }): JSX.Element => {
  return <div style={{ width, height }} />
}
