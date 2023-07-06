import { AgeGroup } from 'utils/enum'

export const t = {
  common: {
    errorMessage: 'Oops.. Sepertinya terjadi kesalahan. Coba lagi nanti.',
  },
  CarResultPage: {
    totalResult: ({ total }: any) => ` ${total} mobil baru `,
    resultWithBrand: ({ total, brand }: any) => ` ${total} mobil ${brand} `,
    whatsappMessage: ({ carName, dpRange, monthlyRange, tenure }: any) =>
      `Halo, saya tertarik dengan mobil ${carName} dengan DP sebesar Rp ${dpRange} jt dan cicilan per bulannya Rp ${monthlyRange} jt selama ${tenure} tahun.`,
  },
  funnelBackground: {
    link: {
      termsAndConditions: 'Syarat & ketentuan',
      privacyPolicy: 'Kebijakan privasi',
      contactUs: 'Hubungi kami',
      aboutUs: 'Tentang kami',
    },
  },
  shareModal: {
    title: 'Bagikan',
  },
}
