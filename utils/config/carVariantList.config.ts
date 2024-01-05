import elementId from 'utils/helpers/trackerId'

export const upperSectionNavigationTab = [
  {
    label: 'Warna',
    value: 'Warna',
    testid: elementId.Tab + 'warna',
  },
  {
    label: 'Eksterior',
    value: 'Eksterior',
    testid: elementId.Tab + 'eksterior',
  },
  {
    label: 'Interior',
    value: 'Interior',
    testid: elementId.Tab + 'interior',
  },
  {
    label: 'Video',
    value: 'Video',
    testid: elementId.Tab + 'video',
  },
  {
    label: '360º Eksterior',
    value: '360º Eksterior',
    testid: elementId.Tab + '360-exterior',
  },
  {
    label: '360º Interior',
    value: '360º Interior',
    testid: elementId.Tab + '360-interior',
  },
]

export const lowerSectionNavigationTab = [
  {
    label: 'Ringkasan',
    value: 'Ringkasan',
    testid: elementId.Tab + 'ringkasan',
  },
  {
    label: 'Spesifikasi',
    value: 'Spesifikasi',
    testid: elementId.Tab + 'spesifikasi',
  },
  {
    label: 'Harga',
    value: 'Harga',
    testid: elementId.Tab + 'harga',
  },
  {
    label: 'Kredit',
    value: 'Kredit',
    testid: elementId.Tab + 'kredit',
  },
]

export const getSeoFooterTextDescription = (
  brand?: string,
  model?: string,
  bodyType?: string,
) => {
  const currentYear: number = new Date().getFullYear()
  return `<p>Bagi anda yang ingin memiliki mobil baru dengan harga dan cicilan terjangkau? ${model} adalah pilihan yang tepat. SEVA, platform resmi dari Astra, memberikan kemudahan dalam proses pembelian mobil ${brand} ${model}. Dengan penawaran harga kompetitif, promo dan diskon yang menarik, serta fasilitas kredit yang mudah.
  <br /><br />
  ${brand} ${model} telah lama menjadi pilihan populer di segmen ${bodyType} di Indonesia, dari segi eksterior ${model} menampilkan tampilan modern yang menarik, Gril depan yang menonjol memberikan kesan tangguh dan maskulin. Lampu depan yang stylish dilengkapi dengan LED yang memberikan pencahayaan optimal.
  <br /><br />
  Interior ${model} dirancang dengan fokus pada ruang dan fungsionalitas. Material berkualitas tinggi yang digunakan dalam pembuatan interior menjadikan ${model} nyaman dan tahan lama. Sistem suspensi yang disesuaikan dengan baik mengurangi getaran jalan dan memberikan perjalanan yang halus, bahkan di medan yang tidak rata. 
  <br /><br />
  Harga mobil baru ${brand} ${model} dijamin sangat kompetitif, terutama dengan adanya diskon khusus dan penawaran kredit yang menguntungkan konsumen. Astra, melalui SEVA, menyediakan kemudahan dengan proses pembelian yang cepat dan transparan, serta memudahkan konsumen untuk mendapatkan informasi terkini seputar harga dan promo yang sedang berlangsung.
  <br /><br />
  SEVA juga menawarkan keistimewaan dengan program Instant Approval untuk kredit pembelian mobil baru. Konsumen dapat dengan cepat mengetahui persetujuan kredit mereka, memungkinkan untuk segera memiliki ${brand} ${model} impian mereka tanpa menunggu waktu yang lama.
  <br /><br />
  Bagi para konsumen atau pecinta mobil ${model} yang tengah mencari mobil baru, tidak ada salahnya untuk cek penawaran menarik yang ditawarkan oleh Astra melalui SEVA. Dapatkan keistimewaan promo diskon, penawaran kredit yang menguntungkan, serta proses pembelian yang cepat dan transparan untuk memiliki ${brand} ${model} impian Anda.
  </p>`
}
