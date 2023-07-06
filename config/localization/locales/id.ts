export const t = {
  common: {
    errorMessage: 'Oops.. Sepertinya terjadi kesalahan. Coba lagi nanti.',
  },
  CarResultPage: {
    whatsappMessage: ({ carName, dpRange, monthlyRange, tenure }: any) =>
      `Halo, saya tertarik dengan mobil ${carName} dengan DP sebesar Rp ${dpRange} jt dan cicilan per bulannya Rp ${monthlyRange} jt selama ${tenure} tahun.`,
  },
  shareModal: {
    title: 'Bagikan',
  },
}
