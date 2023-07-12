import React from 'react'
import { PropsIcon } from 'utils/types'

const PeugeotBrand = '/v3/assets/icon/peugeot.png'

export const Peugeot = ({ width = 50, height = 40 }: PropsIcon) => {
  return (
    <img
      src={PeugeotBrand}
      alt="Peugeot"
      style={{ width, height }}
      width={width}
      height={height}
    />
  )
}
