import { monthId } from 'utils/handler/date'

function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}

function formatLocation(location: string) {
  return location.toLowerCase().split(' ').map(capitalizeFirstLetter).join(' ')
}

export const metaTitleTemplateOneSlug = (
  slug: string,
  brand: string,
  model: string,
  year: string,
  location?: string,
  isLoc?: boolean,
) => {
  const todayDate = new Date()
  const currentMonth = monthId(todayDate.getMonth())
  switch (slug) {
    case 'warna':
      return `Pilihan Warna ${brand} ${model} ${year} | SEVA`
    case 'eksterior':
      return `Tampilan Eksterior ${brand} ${model} ${year} | SEVA`
    case 'interior':
      return `Tampilan Interior ${brand} ${model} ${year} | SEVA`
    case 'video':
      return `Video Review ${brand} ${model} ${year} | SEVA`
    case '360-eksterior':
      return `Tampilan 360 Eksterior ${brand} ${model} ${year} | SEVA`
    case '360-interior':
      return `Tampilan 360 Interior ${brand} ${model} ${year} | SEVA`
    case 'spesifikasi':
      return `Spesifikasi ${brand} ${model} ${year} | SEVA`
    case 'harga':
      return `Harga OTR ${brand} ${model} ${year} Terbaru | SEVA`
    case 'kredit':
      return `Kredit ${brand} ${model} ${year}. Simulasi Cicilan dengan Harga OTR dan Promo ${currentMonth} | SEVA`
    default:
      return `${brand} ${model} ${year} - Spesifikasi, Harga OTR ${
        isLoc ? formatLocation(slug) : ''
      } dan Simulasi Cicilan | SEVA`
  }
}
export const metaTitleTemplateTwoSlug = (
  slug: string,
  brand: string,
  model: string,
  year: string,
  location?: string,
  isLoc?: boolean,
) => {
  const todayDate = new Date()
  const currentMonth = monthId(todayDate.getMonth())
  const oneSlug = slug.split('/')[0]
  const twoSlug = slug.split('/')[1]

  if (isLoc) {
    switch (oneSlug) {
      case 'warna':
        return `Pilihan Warna ${brand} ${model} ${year} - ${formatLocation(
          twoSlug,
        )} | SEVA`
      case 'eksterior':
        return `Tampilan Eksterior ${brand} ${model} ${year} - ${formatLocation(
          twoSlug,
        )} | SEVA`
      case 'interior':
        return `Tampilan Interior ${brand} ${model} ${year} - ${formatLocation(
          twoSlug,
        )} | SEVA`
      case 'video':
        return `Video Review ${brand} ${model} ${year} - ${formatLocation(
          twoSlug,
        )} | SEVA`
      case '360-eksterior':
        return `Tampilan 360 Eksterior ${brand} ${model} ${year} - ${formatLocation(
          twoSlug,
        )} | SEVA`
      case '360-interior':
        return `Tampilan 360 Interior ${brand} ${model} ${year} - ${formatLocation(
          twoSlug,
        )} | SEVA`
      case 'spesifikasi':
        return `Spesifikasi ${brand} ${model} ${year} - ${formatLocation(
          twoSlug,
        )} | SEVA`
      case 'harga':
        return `Harga ${brand} ${model} ${year} OTR ${formatLocation(
          twoSlug,
        )} | SEVA`
      case 'kredit':
        return `Simulasi Kredit Mobil ${brand} ${model} ${year} OTR ${formatLocation(
          twoSlug,
        )}. Promo ${currentMonth} | SEVA`
      default:
        return `${brand} ${model} ${year} - Spesifikasi, Harga OTR ${
          isLoc ? formatLocation(twoSlug) : ''
        } dan Simulasi Cicilan | SEVA`
    }
  } else {
    switch (slug) {
      case 'warna/ringkasan':
        return `${brand} ${model} ${year} - Harga OTR, Promo ${currentMonth}, Warna, Ringkasan | SEVA`
      case 'warna/spesifikasi':
        return `Spesifikasi & Fitur ${brand} ${model} ${year} | SEVA`
      case 'warna/harga':
        return `Harga OTR ${brand} ${model} ${year} | SEVA`
      case 'warna/kredit':
        return `Simulasi Kredit ${brand} ${model} - Dapatkan Skema Cicilan dengan Loan Calculator | SEVA`
      case 'eksterior/ringkasan':
        return `Eksterior ${brand} ${model} ${year} | SEVA`
      case 'eksterior/spesifikasi':
        return `Eksterior ${brand} ${model} ${year} - Spesifikasi & Fitur  | SEVA`
      case 'eksterior/harga':
        return `Eksterior ${brand} ${model} ${year} - Harga OTR | SEVA`
      case 'eksterior/kredit':
        return `Eksterior ${brand} ${model} ${year} - Cek Simulasi Kredit Mobil & Cicilan | SEVA`
      case 'interior/ringkasan':
        return `Interior ${brand} ${model} ${year} | SEVA`
      case 'interior/spesifikasi':
        return `Interior ${brand} ${model} ${year} - Spesifikasi & Fitur  | SEVA`
      case 'interior/harga':
        return `Interior ${brand} ${model} ${year} - Harga OTR | SEVA`
      case 'interior/kredit':
        return `Interior ${brand} ${model} ${year} - Cek Simulasi Kredit Mobil & Cicilan | SEVA`
      case '360-eksterior/ringkasan':
        return `Tampilan 360º Eksterior dan Ringkasan ${brand} ${model} ${year} | SEVA`
      case '360-eksterior/spesifikasi':
        return `Tampilan 360º Eksterior ${brand} ${model} ${year} - Spesifikasi & Fitur  | SEVA`
      case '360-eksterior/harga':
        return `Tampilan 360º Eksterior ${brand} ${model} ${year} - Harga OTR | SEVA`
      case '360-eksterior/kredit':
        return `Tampilan 360º Eksterior ${brand} ${model} ${year} - Cek Simulasi Kredit Mobil & Cicilan | SEVA`
      case '360-interior/ringkasan':
        return `Tampilan 360º Interior dan Ringkasan ${brand} ${model} ${year} | SEVA`
      case '360-interior/spesifikasi':
        return `Tampilan 360º Interior ${brand} ${model} ${year} - Spesifikasi & Fitur  | SEVA`
      case '360-interior/harga':
        return `Tampilan 360º Interior ${brand} ${model} ${year} - Harga OTR | SEVA`
      case '360-interior/kredit':
        return `Tampilan 360º Interior ${brand} ${model} ${year} - Simulasi Kredit Mobil & Cicilan | SEVA`
      case 'video/ringkasan':
        return `Review ${brand} ${model} ${year} | SEVA`
      case 'video/spesifikasi':
        return `Review ${brand} ${model} ${year} - Spesifikasi & Fitur  | SEVA`
      case 'video/harga':
        return `Review ${brand} ${model} ${year} - Harga OTR | SEVA`
      case 'video/kredit':
        return `Review ${brand} ${model} ${year} - Cek Simulasi Kredit Mobil & Cicilan | SEVA`
      default:
        return `${brand} ${model} ${year} - Spesifikasi, Harga OTR dan Simulasi Cicilan | SEVA`
    }
  }
}

export const metaTitleTemplateThreeSlug = (
  slug: string,
  brand: string,
  model: string,
  year: string,
  location?: string,
) => {
  const todayDate = new Date()
  const currentMonth = monthId(todayDate.getMonth())
  const twoSlug = slug.split('/').splice(0, 2).join('/')
  const threeSlug = slug.split('/')[2]
  switch (twoSlug) {
    case 'warna/ringkasan':
      return `${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Harga OTR, Promo ${currentMonth}, Warna, Ringkasan | SEVA`
    case 'warna/spesifikasi':
      return `Spesifikasi & Fitur ${brand} ${model} ${formatLocation(
        threeSlug,
      )} | SEVA`
    case 'warna/harga':
      return `Harga OTR ${formatLocation(threeSlug)} | SEVA`
    case 'warna/kredit':
      return `Simulasi Kredit ${brand} ${model} ${formatLocation(
        threeSlug,
      )} - Dapatkan Skema Cicilan dengan Loan Calculator | SEVA`
    case 'eksterior/ringkasan':
      return `Eksterior ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} | SEVA`
    case 'eksterior/spesifikasi':
      return `Eksterior ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Spesifikasi & Fitur  | SEVA`
    case 'eksterior/harga':
      return `Eksterior ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Harga OTR ${formatLocation(threeSlug)} | SEVA`
    case 'eksterior/kredit':
      return `Eksterior ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Cek Simulasi Kredit Mobil & Cicilan | SEVA`
    case 'interior/ringkasan':
      return `Interior ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} | SEVA`
    case 'interior/spesifikasi':
      return `Interior ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Spesifikasi & Fitur  | SEVA`
    case 'interior/harga':
      return `Interior ${brand} ${model} ${year} - Harga OTR ${formatLocation(
        threeSlug,
      )} | SEVA`
    case 'interior/kredit':
      return `Interior ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Cek Simulasi Kredit Mobil & Cicilan | SEVA`
    case '360-eksterior/ringkasan':
      return `Tampilan Eksterior 360º dan Ringkasan ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} | SEVA`
    case '360-eksterior/spesifikasi':
      return `Tampilan Eksterior 360º ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Spesifikasi & Fitur  | SEVA`
    case '360-eksterior/harga':
      return `Tampilan Eksterior 360º ${brand} ${model} ${year} - Harga OTR ${formatLocation(
        threeSlug,
      )} | SEVA`
    case '360-eksterior/kredit':
      return `Tampilan Eksterior 360º ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Cek Simulasi Kredit Mobil & Cicilan | SEVA`
    case '360-interior/ringkasan':
      return `Tampilan Interior 360º dan Ringkasan ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} | SEVA`
    case '360-interior/spesifikasi':
      return `Tampilan Interior 360º ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Spesifikasi & Fitur  | SEVA`
    case '360-interior/harga':
      return `Tampilan Interior 360º ${brand} ${model} ${year} - Harga OTR ${formatLocation(
        threeSlug,
      )} | SEVA`
    case '360-interior/kredit':
      return `Tampilan Interior 360º ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Simulasi Kredit Mobil & Cicilan | SEVA`
    case 'video/ringkasan':
      return `Review ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} | SEVA`
    case 'video/spesifikasi':
      return `Review ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Spesifikasi & Fitur  | SEVA`
    case 'video/harga':
      return `Review ${brand} ${model} ${year} - Harga OTR ${formatLocation(
        threeSlug,
      )} | SEVA`
    case 'video/kredit':
      return `Review ${brand} ${model} ${year} ${formatLocation(
        threeSlug,
      )} - Cek Simulasi Kredit Mobil & Cicilan | SEVA`
    default:
      return `${brand} ${model} ${year} - Spesifikasi, Harga OTR dan Simulasi Cicilan | SEVA`
  }
}

export const metaDescTemplateOneSlug = (
  slug: string,
  brand: string,
  model: string,
  year: string,
  carOTR?: string,
  location?: string,
  warna?: number,
) => {
  switch (slug) {
    case 'warna':
      return `Lihat pilihan warna yang tersedia untuk ${brand} ${model} ${year} di ${location}. Pilih dari ${
        warna ? warna : '1'
      } Pilihan warna mobil ${model}`
    case 'eksterior':
      return `Temukan foto eksterior ${brand} ${model} ${year}. Lihat tampilan body mobil, grille, headlights, tampak depan, dan tampak samping`
    case 'interior':
      return `Temukan foto interior ${brand} ${model} ${year}. Lihat tampilan kabin, konfigurasi, dan kenyamanan interior ${model}`
    case 'video':
      return `Tonton video review lengkap  ${brand} ${model} ${year}. Lihat impresi dan kesan berkendara mobil ${model}`
    case '360-eksterior':
      return `Lihat tampilan 360 eksterior ${brand} ${model} ${year}. Mulai dari grill, headlights, velg, tampak depan, tampak samping, dan tampak belakang`
    case '360-interior':
      return `Lihat tampilan 360 interior ${brand} ${model} ${year}. Mulai dari kabin mobil, jok, hingga head unit`
    case 'spesifikasi':
      return `Dapatkan Informasi lengkap mengenai spesifikasi ${brand} ${model} ${year} terbaru di SEVA`
    case 'harga':
      return `Daftar harga ${brand} ${model} ${year}. Harga mulai dari ${carOTR}, dapatkan informasi mengenai harga OTR ${brand} ${model} terbaru di SEVA`
    case 'kredit':
      return `Hitung simulasi cicilan ${brand} ${model} ${year}. Dapatkan skema cicilan mobil ${model} dengan Loan Calculator di SEVA`
    default:
      return `Beli mobil ${brand} ${model} ${year} baru secara kredit. OTR ${location} harga mulai ${carOTR}, cari tau spesifikasi, daftar harga, dan simulasi kredit`
  }
}

export const metaDescTemplateTwoSlug = (
  slug: string,
  brand: string,
  model: string,
  year: string,
  carOTR?: string,
  location?: string,
  color?: number,
  isLoc?: boolean,
) => {
  const oneSlug = slug.split('/')[0]
  const twoSlug = slug.split('/')[1]
  if (isLoc) {
    switch (oneSlug) {
      case 'warna':
        return `Lihat beragam pilihan warna yang tersedia untuk ${brand} ${model} ${year} di ${formatLocation(
          twoSlug,
        )}.  Pilih dari ${color ? color : '1'} pilihan warna mobil ${model}`
      case 'eksterior':
        return `Temukan foto eksterior ${brand} ${model} ${year} di ${formatLocation(
          twoSlug,
        )}. Lihat tampilan body mobil, grille, headlights, tampak depan, dan tampak samping.`
      case 'interior':
        return `Temukan foto interior ${brand} ${model} ${year} di ${formatLocation(
          twoSlug,
        )}. Lihat tampilan kabin, konfigurasi, dan kenyamanan interior ${model}.`
      case '360-eksterior':
        return `Lihat tampilan 360 eksterior ${brand} ${model} ${year} di ${formatLocation(
          twoSlug,
        )}. Mulai dari grill, headlights, velg, tampak depan, tampak samping, dan tampak belakang.`
      case '360-interior':
        return `Lihat tampilan 360 interior ${brand} ${model} ${year} di ${formatLocation(
          twoSlug,
        )}. Mulai dari kabin mobil, jok, hingga head unit. `
      case 'video':
        return `Tonton video review lengkap ${brand} ${model} ${year} di ${formatLocation(
          twoSlug,
        )}. Lihat impresi dan kesan berkendara mobil ${model}`
      case 'spesifikasi':
        return `Dapatkan informasi lengkap mengenai spesifikasi ${brand} ${model} ${year} OTR ${formatLocation(
          twoSlug,
        )} di SEVA.`
      case 'harga':
        return `Daftar harga ${brand} ${model} ${year} OTR ${formatLocation(
          twoSlug,
        )}. Bandingkan harga ${brand} ${model} dan hitung simulasi cicilan mobil ${model}`
      case 'kredit':
        return `Hitung simulasi cicilan ${brand} ${model} ${year} OTR ${formatLocation(
          twoSlug,
        )}. Dapatkan skema cicilan mobil ${model} dengan Loan Calculator di SEVA`
      default:
        return `Beli mobil ${brand} ${model} ${year} baru secara kredit di SEVA. Harga mulai ${carOTR}, cari tau spesifikasi, daftar harga, dan simulasi kredit.`
    }
  } else {
    switch (slug) {
      case 'warna/ringkasan':
        return `Pilihan Warna dan Ringkasan ${brand} ${model} ${year}. Dapatkan informasi lengkap mengenai ${brand} ${model} ${year} di SEVA`
      case 'warna/spesifikasi':
        return `Spesifikasi lengkap ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA`
      case 'warna/harga':
        return `Daftar Harga OTR ${brand} ${model} ${year} di Indonesia. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA`
      case 'warna/kredit':
        return `Hitung simulasi kredit ${brand} ${model} ${year} harga OTR di Indonesia. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA`
      case 'eksterior/ringkasan':
        return `Lihat foto eksterior dan ringkasan ${brand} ${model} ${year}`
      case 'eksterior/spesifikasi':
        return `Tampilan eksterior dan detail spesifikasi  ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA`
      case 'eksterior/harga':
        return `Tampilan eksterior dan daftar harga ${brand} ${model} ${year}. Dapatkan informasi ${brand} ${model} ${year} terbaru di SEVA.`
      case 'eksterior/kredit':
        return `Tampilan eksterior dan simulasi kredit ${brand} ${model} ${year}. Dapatkan informasi ${brand} ${model} ${year} terbaru di SEVA.`
      case 'interior/ringkasan':
        return `Tampilan interior dan ringkasan mobil ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case 'interior/spesifikasi':
        return `Tampilan interior dan spesifikasi dari ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case 'interior/harga':
        return `Tampilan interior dan daftar harga ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case 'interior/kredit':
        return `Tampilan Interior dan simulasi kredit ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case '360-eksterior/ringkasan':
        return `Tampilan 360 eksterior dan ringkasan mobil ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA. `
      case '360-eksterior/spesifikasi':
        return `Tampilan 360 eksterior dan spesifikasi dari ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case '360-eksterior/harga':
        return `Tampilan 360 eksterior dan daftar harga ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case '360-eksterior/kredit':
        return `Tampilan 360 eksterior dan simulasi kredit ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case '360-interior/ringkasan':
        return `Tampilan 360 interior dan ringkasan mobil ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA. `
      case '360-interior/spesifikasi':
        return `Tampilan 360 interior dan spesifikasi dari ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case '360-interior/harga':
        return `Tampilan 360 interior dan daftar harga ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case '360-interior/kredit':
        return `Tampilan 360 interior dan simulasi kredit ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case 'video/ringkasan':
        return `Tonton video review lengkap ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA. `
      case 'video/spesifikasi':
        return `Tonton video review lengkap ${brand} ${model} ${year} dan spesifikasi dari mobil ${model}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case 'video/harga':
        return `Tonton video review lengkap ${brand} ${model} ${year} dan daftar harga mobil ${model}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      case 'video/kredit':
        return `Tonton video review ${brand} ${model} ${year} dan simulasi kredit mobil ${model}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
      default:
        return `Beli mobil ${brand} ${model} ${year} baru secara kredit di SEVA. Harga mulai ${carOTR}, cari tau spesifikasi, daftar harga, dan simulasi kredit.`
    }
  }
}

export const metaDescTemplateThreeSlug = (
  slug: string,
  brand: string,
  model: string,
  year: string,
  carOTR?: string,
  location?: string,
) => {
  const twoSlug = slug.split('/').splice(0, 2).join('/')
  const threeSlug = slug.split('/')[2]
  switch (twoSlug) {
    case 'warna/ringkasan':
      return `Lihat pilihan warna ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi lengkap mengenai ${brand} ${model} ${year} di SEVA`
    case 'warna/spesifikasi':
      return `Lihat spesifikasi lengkap ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA`
    case 'warna/harga':
      return `Daftar Harga OTR ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )} . Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA`
    case 'warna/kredit':
      return `Hitung simulasi kredit ${brand} ${model} ${year} harga OTR di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA`
    case 'eksterior/ringkasan':
      return `Lihat foto eksterior dan ringkasan ${brand} ${model} ${year}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA`
    case 'eksterior/spesifikasi':
      return `Lihat tampilan eksterior dan detail spesifikasi ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA`
    case 'eksterior/harga':
      return `Lihat tampilan eksterior dan daftar harga ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi ${brand} ${model} ${year} terbaru di SEVA.`
    case 'eksterior/kredit':
      return `Lihat tampilan eksterior dan simulasi kredit ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi ${brand} ${model} ${year} terbaru di SEVA.`
    case 'interior/ringkasan':
      return `Lihat tampilan interior dan ringkasan mobil ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
    case 'interior/spesifikasi':
      return `Lihat tampilan interior dan spesifikasi dari ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
    case 'interior/harga':
      return `Lihat tampilan interior dan daftar harga ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
    case 'interior/kredit':
      return `Lihat tampilan Interior dan simulasi kredit ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
    case '360-eksterior/ringkasan':
      return `Lihat tampilan 360 eksterior dan ringkasan mobil ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA. `
    case '360-eksterior/spesifikasi':
      return `Lihat tampilan 360 eksterior dan spesifikasi dari ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
    case '360-eksterior/harga':
      return `Lihat tampilan 360 eksterior dan daftar harga ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
    case '360-eksterior/kredit':
      return `Lihat tampilan 360 eksterior dan simulasi kredit ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
    case '360-interior/ringkasan':
      return `Lihat tampilan 360 interior dan ringkasan mobil ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA. `
    case '360-interior/spesifikasi':
      return `Lihat tampilan 360 interior dan spesifikasi dari ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
    case '360-interior/harga':
      return `Lihat tampilan 360 interior dan daftar harga ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
    case '360-interior/kredit':
      return `Lihat tampilan 360 interior dan simulasi kredit ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA.`
    case 'video/ringkasan':
      return `Tonton video review lengkap ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai ${brand} ${model} ${year} terbaru di SEVA. `
    case 'video/spesifikasi':
      return `Tonton video review lengkap ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai spesifikasi ${brand} ${model} ${year} terbaru di SEVA.`
    case 'video/harga':
      return `Tonton video review lengkap ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan informasi mengenai daftar harga ${brand} ${model} ${year} terbaru di SEVA.`
    case 'video/kredit':
      return `Video review ${brand} ${model} ${year} di ${formatLocation(
        threeSlug,
      )}. Dapatkan simulasi kredit ${brand} ${model} ${year} terbaru di SEVA.`
    default:
      return `Beli mobil ${brand} ${model} ${year} baru secara kredit di SEVA. Harga mulai ${carOTR}, cari tau spesifikasi, daftar harga, dan simulasi kredit.`
  }
}
