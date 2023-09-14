import { CarVariant } from 'utils/types/utils'

export interface CarModel {
  brand: string
  height: number
  highestAssetPrice: number
  id: string
  image: string
  images: Array<string>
  length: number
  loanRank: string
  lowestAssetPrice: number
  model: string
  numberOfPopulation: number
  variants: CarVariant[]
  width: number
}

export interface BodyTypes {
  body_type: string
  data_count: number
}
