export const sortOptions = [
  {
    label: 'Harga Terendah',
    value: 'lowToHigh',
    testid: 'sorting-harga-terendah',
  },
  {
    label: 'Harga Tertinggi',
    value: 'highToLow',
    testid: 'sorting-harga-tertinggi',
  },
]

export const sortOptionsUsedCar = [
  {
    label: 'Relevansi',
    value: 'relevance',
    testid: 'sorting-relevansi',
  },
  {
    label: 'Harga Terendah',
    value: 'lowToHigh',
    testid: 'sorting-harga-terendah',
  },
  {
    label: 'Harga Tertinggi',
    value: 'highToLow',
    testid: 'sorting-harga-tertinggi',
  },
  {
    label: 'Mobil Terbaru',
    value: 'newest',
    testid: 'sorting-mobil-terbaru',
  },
  {
    label: 'Mobil Terlama',
    value: 'oldest',
    testid: 'sorting-mobil-terlama',
  },
]

export const ageOptions = [
  { label: '18-27', value: '18-27', testid: '18-27' },
  { label: '28-34', value: '28-34', testid: '28-34' },
  { label: '35-50', value: '35-50', testid: '35-50' },
  { label: '>51', value: '>51', testid: '>51' },
]

export const RequiredFunnelErrorMessage = {
  downPaymentAmount: 'Wajib mengisi maksimum DP',
  tenure: 'Wajib pilih tenor',
  monthlyIncome: 'Wajib mengisi pendapatanmu',
  age: 'Wajib pilih kategori umur',
}

export const MinAmountMessage = {
  downPayemntAmount: 'Minimum DP sebesar Rp20 jt.',
  monthlyIncome: 'Pendapatan yang kamu masukkan terlalu rendah',
}

export const overMaxWarning = 'Harga yang kamu masukkan terlalu tinggi.'
export const underMinWarning = 'Harga yang kamu masukkan terlalu rendah.'
export const overMaxTwoWarning = 'Harga harus lebih kecil dari harga maksimum.'
export const underMinTwoWarning = 'Harga harus lebih besar dari harga minimum.'
