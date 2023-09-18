import Image from 'next/image'
import React from 'react'
import { PropsIcon } from 'utils/types'

const IsuzuBrand = '/revamp/icon/Isuzu-new.png'

export const Isuzu = ({ width = 50, height = 50 }: PropsIcon) => {
  return (
    <Image
      src={IsuzuBrand}
      alt="Izuzu"
      style={{ width, height }}
      width={width}
      height={height}
    />
  )
}
