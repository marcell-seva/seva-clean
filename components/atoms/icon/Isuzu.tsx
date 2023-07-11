import React from 'react'
import { PropsIcon } from 'utils/types'

const IsuzuBrand = '/v3/assets/icon/Isuzu-new.png'

export const Isuzu = ({ width = 50, height }: PropsIcon) => {
  return (
    <img
      src={IsuzuBrand}
      alt="Izuzu"
      style={{ width, height }}
      width={width}
      height={height}
    />
  )
}
