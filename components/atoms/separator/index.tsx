import React from 'react'
export interface PropsSeparator {
  width: number
  height: number
  color?: string
}
export const Separator: React.FC<PropsSeparator> = ({
  width,
  height,
  color = '#AFB3BA',
}) => <div style={{ width, height, backgroundColor: color }} />
