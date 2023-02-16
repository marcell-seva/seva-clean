import { Location } from './utils'

export interface PropsBrand {
  name: string
  src: string
  isActive: boolean
  onClick: any
}

export interface PropsCapsule {
  item: Location
  onClick: any
}

export interface PropsCard {
  item: {
    brand: string
    model: string
    image: string
    variants: any
  }
}

export interface PropsIcon {
  width: number
  height: number
  color?: string
}

export interface PropsTypeCar {
  name: string
  src: string
  onClick: any
  isActive?: boolean
}
