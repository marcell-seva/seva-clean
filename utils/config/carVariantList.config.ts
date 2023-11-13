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

export const getSeoFooterTextDescription = (brand?: string, model?: string) => {
  const currentYear: number = new Date().getFullYear()
  return `<p>Pada era modern ini, mobil telah menjadi bagian penting dari kehidupan sehari-hari kita. Mobil tidak hanya berfungsi sebagai alat transportasi yang memudahkan perjalanan, tetapi juga merupakan simbol status dan gaya hidup.
  <br /><br />
  Setiap tahun, produsen mobil di seluruh dunia terus berinovasi dan menghadirkan berbagai model mobil baru dengan teknologi canggih dan desain yang menarik. Setiap mobil ${brand} terbaru, tentunya memiliki kelebihannya di masing-masing model.
  <br /><br />
  Tahun ${currentYear} juga menjadi momen penting dalam sejarah perkembangan mobil ${brand}, dengan munculnya beberapa model yang sangat dinanti-nantikan.
  <br /><br />
  Desain eksterior dan interior menjadi faktor penting dalam menarik minat konsumen terhadap model mobil ${brand} ${model}. Produsen mobil saat ini berfokus pada desain yang menggoda dengan garis-garis yang aerodinamis, lampu LED yang elegan, dan detail yang halus. 
  <br /><br />
  Desain mobil ${brand} ${model} terbaru juga mengalami perubahan yang signifikan. Dari mobil-mobil berbentuk kotak pada era awal, kita sekarang melihat mobil dengan desain aerodinamis yang elegan dan futuristik. 
  <br /><br />
  Setiap produsen mobil umumnya memiliki berbagai model mobil yang mencakup berbagai segmen, seperti mobil keluarga, SUV, sedan, <i>hatchback</i>, dan lain sebagainya. Selain itu, Astra juga mempunyai beberapa mobil yang ada saat ini di antaranya adalah Toyota, Daihatsu, Peugeot, sampai BMW. 
  <br /><br />
  Mobil telah memiliki dampak yang besar dalam kehidupan kita. Kebebasan dan fleksibilitas yang ditawarkan oleh mobil memungkinkan kita untuk bepergian ke tempat-tempat yang lebih jauh dengan lebih mudah.
  <br /><br />
  Untuk mengetahui berbagai model mobil ${brand} ${model} yang ada saat ini, bisa mencari tahunya di SEVA.  SEVA merupakan sebuah <i>platform</i> pencarian mobil baru dari Astra Financial. Melalui SEVA, kamu bisa mendapatkan mobil impian yang sesuai dengan kemampuan finansial. 
  <br /><br />
  Selain pencarian mobil, SEVA juga memiliki dukungan keuangan untuk lebih memudahkan proses <a href="https://www.seva.id/blog/step-by-step-cara-beli-mobil-online-032022-kg/">pembelian mobil</a>. Dengan begitu, pembelian mobil akan menjadi lebih aman dan nyaman.
  <br /><br />
  Mengusung <i>tagline</i>&nbsp;<b>#JelasDariAwal</b>, pengguna <b>SEVA</b> dapat menemukan mobil baru, memilih skema pembiayaan yang tepat, hingga melakukan transaksi pembayaran dalam satu <i>platform</i> digital. Tunggu apalagi, beli mobil di <b>SEVA</b> yuk dari sekarang.</p>`
}
