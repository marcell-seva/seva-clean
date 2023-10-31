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

export const assuranceOptions = [
  {
    label: 'Full Comprehensive',
    name: 'Full Comprehensive',
    tenureAR: 60,
    tenureTLO: 0,
  },
  {
    label: '4 Tahun Comprehensive + 1 Tahun TLO',
    name: '4 Tahun Comprehensive + 1 Tahun TLO',
    tenureAR: 48,
    tenureTLO: 12,
  },
  {
    label: '3 Tahun Comprehensive + 2 Tahun TLO',
    name: '3 Tahun Comprehensive + 2 Tahun TLO',
    tenureAR: 36,
    tenureTLO: 24,
  },
  {
    label: '2 Tahun Comprehensive + 3 Tahun TLO',
    name: '2 Tahun Comprehensive + 3 Tahun TLO',
    tenureAR: 24,
    tenureTLO: 36,
  },
  {
    label: '1 Tahun Comprehensive + 4 Tahun TLO',
    name: '1 Tahun Comprehensive + 4 Tahun TLO',
    tenureAR: 12,
    tenureTLO: 48,
  },
  {
    label: 'Full TLO',
    name: 'Full TLO',
    tenureAR: 0,
    tenureTLO: 60,
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
