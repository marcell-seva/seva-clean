import React from 'react'

const FlagUSAImg = '/revamp/illustration/FlagUSA.png'

interface FlagUSAProps {
  width?: number
  height?: number
}

export const FlagUSA = ({ width = 24, height = 16 }: FlagUSAProps) => {
  return <img src={FlagUSAImg} alt="usa flag" style={{ width, height }} />
}
