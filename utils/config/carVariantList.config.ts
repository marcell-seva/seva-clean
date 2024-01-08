import { on } from 'events'
import elementId from 'utils/helpers/trackerId'
import { capitalizeFirstLetter, capitalizeWords } from 'utils/stringUtils'

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
export const getSeoFooterDealerTextDescription = (
  onPage?: string,
  brand?: string,
  dealerCount?: string,
  location?: string,
) => {
  const currentYear: number = new Date().getFullYear()
  if (onPage === 'main') {
    return `<p>Dealer atau showroom mobil adalah dealer yang bekerjasama dengan SEVA Astra dan dikenal akan kualitasnya dan dikenal dengan berbagai layanan, promo, dan keunggulan pelayanan. Dealer atau showroom mobil rekanan SEVA bisa jadi pilihan utama bagi pecinta mobil di Indonesia.
  <br /><br />
  Dealer-dealer rekananan SEVA hadir dengan berbagai pilihan varian mobil berkualitas untuk anda. Pengunjung juga dapat menikmati pengalaman melihat secara langsung dan test drive beragam pilihan mobil yang ditawarkan dengan berbagai fitur dan warna yang menarik.
  <br /><br />
  Setiap pembelian mobil di dealer atau showroom rekanan SEVA, anda akan mendapatkan penawaran promo mobil menarik dan diskon eksklusif lainnya. Program-program ini memberikan benefit tambahan bagi konsumen yang ingin membeli mobil dengan penawaran yang menguntungkan.
  <br /><br />
  Dealer mobil kami juga memberikan kemudahan dalam hal pembayaran dengan berbagai opsi kredit dan cicilan. Hal ini membuat pembelian mobil semakin terjangkau bagi konsumen, dengan paket kredit yang dapat disesuaikan dengan kebutuhan masing-masing.
Pelayanan purna jual di dealer atau showroom mobil SEVA tidak hanya terbatas pada penjualan mobil. Kami memiliki jaringan service center dan bengkel yang tersebar di berbagai lokasi di Indonesia. Dengan tim teknisi yang terlatih dan menggunakan peralatan canggih, layanan perawatan dan perbaikan mobil dijamin berkualitas tinggi.
  <br /><br />
  Dealer atau showroom mobil kami menjamin ketersediaan sparepart dan suku cadang asli. Hal ini memberikan kepastian kepada pelanggan bahwa perawatan mobil anda akan menggunakan komponen yang memiliki kualitas dan keandalan sesuai standar pabrik.
Dealer partner kami tidak hanya menjadi tempat pembelian mobil, tetapi juga mitra dalam menjaga kualitas mobilitas. Dari penawaran yang menggiurkan hingga layanan purna jual yang prima, dealer mobil rekanan SEVA telah terbukti sebagai dealer mobil yang dapat diandalkan dan berkualitas di tengah hiruk-pikuknya kebutuhan akan mobilitas di Indonesia.
  <br /><br />
  </p>`
  } else if (onPage === 'brand') {
    return `<p>Temukan beragam Dealer ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } yang bekerjasama dengan SEVA. Terdapat ${dealerCount} Dealer ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } yang dikenal akan kualitas, promo serta keunggulan pelayanannya. Dealer ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } bisa jadi pilihan utama bagi pecinta mobil ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } di Indonesia.
  <br /><br />
  Dealer ${
    brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
  } hadir dengan berbagai pilihan varian mobil berkualitas untuk anda. Pengunjung juga dapat menikmati pengalaman melihat secara langsung dan test drive beragam pilihan mobil yang ditawarkan dengan berbagai fitur dan warna yang menarik.
  <br /><br />
  Setiap pembelian mobil ${
    brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
  }, anda akan diberikan promo menarik dan diskon eksklusif lainnya. Program-program ini memberikan benefit tambahan bagi konsumen yang ingin membeli mobil dengan penawaran yang menguntungkan.
  <br /><br />
  Kami juga memberikan kemudahan dalam hal pembayaran dengan berbagai opsi kredit dan cicilan. Hal ini membuat pembelian mobil semakin terjangkau bagi konsumen, dengan paket kredit yang dapat disesuaikan dengan kebutuhan masing-masing.
  <br /><br />
  Pelayanan purna jual di ${
    brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
  } tidak hanya terbatas pada penjualan mobil. ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } memiliki jaringan service center dan bengkel yang tersebar di berbagai lokasi di Indonesia. Dengan tim teknisi yang terlatih dan menggunakan peralatan canggih, layanan perawatan dan perbaikan mobil dijamin berkualitas tinggi.
  <br /><br />
  ${
    brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
  } menjamin ketersediaan sparepart dan suku cadang asli ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    }. Hal ini memberikan kepastian kepada pelanggan bahwa perawatan mobil anda akan menggunakan komponen yang memiliki kualitas dan keandalan sesuai standar pabrik ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    }.
  <br /><br />
  Dealer ${
    brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
  } tidak hanya menjadi tempat pembelian mobil, tetapi juga mitra dalam menjaga kualitas mobilitas. Dari penawaran yang menggiurkan hingga layanan purna jual yang prima, Dealer ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } telah membuktikan dirinya sebagai dealer mobil baru yang dapat diandalkan dan berkualitas di tengah hiruk-pikuknya kebutuhan akan mobilitas di Indonesia.
  </p>`
  } else {
    return `<p>Temukan beragam Dealer ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } di ${capitalizeWords(location!)}. Dealer ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } di ${capitalizeWords(
      location!,
    )} dikenal akan kualitasnya dan dikenal dengan layanan hingga promo. Dealer ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } di ${capitalizeWords(
      location!,
    )} bisa jadi dealer atau showroom pilihan utama bagi pecinta mobil ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } di ${capitalizeWords(location!)}.
  <br /><br />
  Dealer ${
    brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
  } di ${capitalizeWords(
      location!,
    )} hadir dengan berbagai pilihan varian mobil berkualitas untuk anda. Pengunjung juga dapat menikmati pengalaman melihat secara langsung dan test drive beragam pilihan mobil yang ditawarkan dengan berbagai fitur dan warna yang menarik.
  <br /><br />
  Setiap pembelian mobil ${
    brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
  } di ${capitalizeWords(
      location!,
    )}, anda akan diberikan promo menarik dan diskon eksklusif lainnya. Program-program ini memberikan nilai lebih dan benefit tambahan bagi konsumen yang ingin membeli mobil dengan penawaran yang menguntungkan.
  <br /><br />
  Auto 2000 juga memberikan kemudahan dalam hal pembayaran dengan berbagai opsi kredit dan cicilan. Hal ini membuat pembelian mobil semakin terjangkau bagi konsumen, dengan paket kredit yang dapat disesuaikan dengan kebutuhan masing-masing.
  <br /><br />
  Pelayanan purna jual di seluruh dealer ${
    brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
  } ${capitalizeWords(location!)} tidak hanya terbatas pada penjualan mobil ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    }. Kami memiliki jaringan service center dan bengkel yang tersebar di berbagai lokasi di ${capitalizeWords(
      location!,
    )}. Dengan tim teknisi yang terlatih dan menggunakan peralatan canggih, layanan perawatan dan perbaikan mobil dijamin berkualitas tinggi.
  <br /><br />
  Dealer ${
    brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
  } menjamin ketersediaan sparepart dan suku cadang asli ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    }. Hal ini memberikan kepastian kepada pelanggan bahwa perawatan mobil anda akan menggunakan komponen yang memiliki kualitas dan keandalan sesuai standar pabrik ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    }.
  <br /><br />
  Dealer ${
    brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
  } di ${capitalizeWords(
      location!,
    )} tidak hanya menjadi tempat pembelian mobil, tetapi juga mitra dalam menjaga kualitas mobilitas. Dari penawaran yang menggiurkan hingga layanan purna jual yang prima, Dealer terbukti sebagai dealer mobil ${
      brand! !== 'bmw' ? capitalizeFirstLetter(brand!) : brand!.toUpperCase()
    } yang dapat diandalkan dan berkualitas di tengah hiruk-pikuknya kebutuhan akan mobilitas di Indonesia.
  <br /><br />
  </p>`
  }
}
