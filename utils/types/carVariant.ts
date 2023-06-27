export interface CarVariant {
  dp: number
  dpAmount: number
  id: string
  loanRank: string
  monthlyInstallment: number
  priceValue: number
  tenure: number
}

export interface ModelVariant {
  carSeats: number
  code: string
  discount: number
  engineCapacity: number
  fuelType: string
  id: string
  name: string
  priceValue: number
  transmission: string
}
