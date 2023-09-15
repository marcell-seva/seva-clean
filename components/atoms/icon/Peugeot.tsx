import Image from 'next/image'
import React from 'react'
import { PropsIcon } from 'utils/types'

const PeugeotBrand = '/revamp/icon/peugeot.png'

export const Peugeot = ({ width = 50, height = 40 }: PropsIcon) => {
  return (
    <Image
      src={PeugeotBrand}
      alt="Peugeot"
      style={{ width, height }}
      width={width}
      height={height}
    />
  )
}
