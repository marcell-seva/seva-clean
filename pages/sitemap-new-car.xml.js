import getCurrentEnvironment from 'helpers/environments'
import { monthId, escapeCdata } from './sitemap-used-car.xml'

const rootPath = getCurrentEnvironment.rootPath
const apiBaseUrl = getCurrentEnvironment.apiBaseUrl

const PDP_DATA_URL = `${rootPath}/mobil-baru/p`

const currentDate = new Date()
const currentMonth = monthId(currentDate.getMonth())
const currentYear = currentDate.getFullYear()

const upperTabs = [
  {
    path: '/warna',
    metaPrefix: 'Pilihan Warna',
  },
  {
    path: '/eksterior',
    metaPrefix: 'Tampilan Eksterior',
  },
  {
    path: '/interior',
    metaPrefix: 'Tampilan Interior',
  },
  {
    path: '/video',
    metaPrefix: 'Video Review',
  },
  {
    path: '/360-eksterior',
    metaPrefix: 'Tampilan 360 Eksterior',
  },
  {
    path: '/360-interior',
    metaPrefix: 'Tampilan 360 Interior',
  },
]

const lowerTabs = [
  {
    path: '/ringkasan',
    getTitle(brand, model) {
      return `${brand} ${model} ${currentYear} - Spesifikasi, Harga OTR dan Simulasi Cicilan | SEVA`
    },
    getKeywords(brand, model) {
      return `Ringkasan ${model}, ${model}, ${brand} ${model}, Mobil ${brand}`
    },
  },
  {
    path: '/spesifikasi',
    getTitle(brand, model) {
      return `Spesifikasi ${brand} ${model} ${currentYear} | SEVA`
    },
    getKeywords(brand, model) {
      return `Spesifikasi ${model}, ${model}, ${brand} ${model}, Mobil ${brand}`
    },
  },
  {
    path: '/harga',
    getTitle(brand, model) {
      return `Harga OTR ${brand} ${model} ${currentYear} Terbaru | SEVA`
    },
    getKeywords(brand, model) {
      return `Harga OTR ${model}, ${model}, ${brand} ${model}, Mobil ${brand}`
    },
  },
  {
    path: '/kredit',
    getTitle(brand, model) {
      return `Kredit ${brand} ${model} ${currentYear}. Simulasi Cicilan dengan Harga OTR dan Promo ${currentMonth} | SEVA`
    },
    getKeywords(brand, model) {
      return `Kredit ${model}, ${model}, ${brand} ${model}, Mobil ${brand}`
    },
  },
]

const SiteMap = () => {}

const generateSiteMap = ({ cities, carRecommendations, videoReviews }) => {
  let defaultSiteMap = ''
  let upperTabSiteMap = ''
  let lowerTabSiteMap = ''
  let locationSiteMap = ''

  // generate default sitemap
  carRecommendations.forEach((car) => {
    const filteredVideos = videoReviews.filter(
      (video) => video.modelId === car.id,
    )

    defaultSiteMap += `<url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
        <loc>
            ${escapeCdata(
              `${PDP_DATA_URL}/${car.brand
                .toLowerCase()
                .replace(/ /g, '-')}/${car.model
                .toLowerCase()
                .replace(/ /g, '-')}`,
            )}
        </loc>
        <lastmod>2023-11-24</lastmod>
        <priority>1.0</priority>
        <news:news>
            <news:name>ProductSeva</news:name>
            <news:language>id</news:language>
            <news:title>${escapeCdata(
              `${car.brand} ${car.model} ${currentYear} - Spesifikasi, Harga OTR dan Simulasi Cicilan | SEVA`,
            )}</news:title>
            <news:keywords>${escapeCdata(
              `${car.model}, ${car.brand} ${car.model}, Mobil ${car.brand}`,
            )}</news:keywords>
        </news:news>
        <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <image:loc>${car.images[0].replace('&', '&amp;')}</image:loc>
        </image:image>
        ${
          filteredVideos.length > 0
            ? `<video:video xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
          <video:thumbnail_loc>${filteredVideos[0].thumbnail.replace(
            '&',
            '&amp;',
          )}</video:thumbnail_loc>
          <video:title>${filteredVideos[0].title.replace(
            '&',
            '&amp;',
          )}</video:title>
          <video:player_loc>${filteredVideos[0].link.replace(
            '&',
            '&amp;',
          )}</video:player_loc>
        </video:video>`
            : ''
        }
    </url>
    `
  })

  // generate upper tab sitemap
  upperTabs.forEach((tab) => {
    // every each tab generate sitemap
    carRecommendations.forEach((car) => {
      const filteredVideos = videoReviews.filter(
        (video) => video.modelId === car.id,
      )

      upperTabSiteMap += `<url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            <loc>
                ${escapeCdata(
                  `${PDP_DATA_URL}/${car.brand
                    .toLowerCase()
                    .replace(/ /g, '-')}/${car.model
                    .toLowerCase()
                    .replace(/ /g, '-')}${tab.path}`,
                )}
            </loc>
            <lastmod>2023-11-24</lastmod>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:title>${escapeCdata(
                  `${tab.metaPrefix} ${car.brand} ${car.model} ${currentYear} | SEVA`,
                )}</news:title>
                <news:keywords>${escapeCdata(
                  `${tab.metaPrefix} ${car.model}, ${car.model}, ${car.brand} ${car.model}, Mobil ${car.brand}`,
                )}</news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>${car.images[0].replace('&', '&amp;')}</image:loc>
            </image:image>
            ${
              filteredVideos.length > 0
                ? `<video:video xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
              <video:thumbnail_loc>${filteredVideos[0].thumbnail.replace(
                '&',
                '&amp;',
              )}</video:thumbnail_loc>
              <video:title>${filteredVideos[0].title.replace(
                '&',
                '&amp;',
              )}</video:title>
              <video:player_loc>${filteredVideos[0].link.replace(
                '&',
                '&amp;',
              )}</video:player_loc>
            </video:video>`
                : ''
            }
        </url>
        `
    })
  })

  // generate lower tab sitemap
  lowerTabs.forEach((tab) => {
    // every each tab generate sitemap
    carRecommendations.forEach((car) => {
      const filteredVideos = videoReviews.filter(
        (video) => video.modelId === car.id,
      )

      lowerTabSiteMap += `<url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            <loc>
                ${escapeCdata(
                  `${PDP_DATA_URL}/${car.brand
                    .toLowerCase()
                    .replace(/ /g, '-')}/${car.model
                    .toLowerCase()
                    .replace(/ /g, '-')}${tab.path}`,
                )}
            </loc>
            <lastmod>2023-11-24</lastmod>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:title>${escapeCdata(
                  tab.getTitle(car.brand, car.model),
                )}</news:title>
                <news:keywords>${escapeCdata(
                  tab.getKeywords(car.brand, car.model),
                )}</news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>${car.images[0].replace('&', '&amp;')}</image:loc>
            </image:image>
            ${
              filteredVideos.length > 0
                ? `<video:video xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
              <video:thumbnail_loc>${filteredVideos[0].thumbnail.replace(
                '&',
                '&amp;',
              )}</video:thumbnail_loc>
              <video:title>${filteredVideos[0].title.replace(
                '&',
                '&amp;',
              )}</video:title>
              <video:player_loc>${filteredVideos[0].link.replace(
                '&',
                '&amp;',
              )}</video:player_loc>
            </video:video>`
                : ''
            }
        </url>
        `
    })
  })

  // generate brand model location sitemap
  cities.forEach((city) => {
    // every city generate sitemap
    carRecommendations.forEach((car) => {
      const filteredVideos = videoReviews.filter(
        (video) => video.modelId === car.id,
      )

      locationSiteMap += `<url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
            <loc>
                ${escapeCdata(
                  `${PDP_DATA_URL}/${car.brand
                    .toLowerCase()
                    .replace(/ /g, '-')}/${car.model
                    .toLowerCase()
                    .replace(/ /g, '-')}/${city.cityName
                    .toLowerCase()
                    .replace(/ /g, '-')}`,
                )}
            </loc>
            <lastmod>2023-11-24</lastmod>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:title>${escapeCdata(
                  `${car.brand} ${car.model} ${currentYear} - Spesifikasi Harga OTR ${city.cityName} dan Simulasi Cicilan | SEVA`,
                )}</news:title>
                <news:keywords>${escapeCdata(
                  `${car.model}, ${car.brand} ${car.model}, Mobil ${car.brand}, Mobil Baru ${city.cityName}`,
                )}</news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>${car.images[0].replace('&', '&amp;')}</image:loc>
            </image:image>
            ${
              filteredVideos.length > 0
                ? `<video:video xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
              <video:thumbnail_loc>${filteredVideos[0].thumbnail.replace(
                '&',
                '&amp;',
              )}</video:thumbnail_loc>
              <video:title>${filteredVideos[0].title.replace(
                '&',
                '&amp;',
              )}</video:title>
              <video:player_loc>${filteredVideos[0].link.replace(
                '&',
                '&amp;',
              )}</video:player_loc>
            </video:video>`
                : ''
            }
        </url>
        `
    })
  })

  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${defaultSiteMap}${upperTabSiteMap}${lowerTabSiteMap}${locationSiteMap}</urlset>`
}

export async function getServerSideProps({ res }) {
  const requestCities = await fetch(`${apiBaseUrl}/city/fe-selector`)
  const cities = await requestCities.json()

  const requestCarRecommendations = await fetch(
    `${apiBaseUrl}/recommendations/new-funnel?city=jakarta&cityId=118`,
  )
  const responseCarRecommendations = await requestCarRecommendations.json()
  const { carRecommendations } = responseCarRecommendations

  const requestCarVideoReviews = await fetch(`${apiBaseUrl}/car-video-review`)
  const responseCarVideoReviews = await requestCarVideoReviews.json()
  const { data: videoReviews } = responseCarVideoReviews

  const sitemap = generateSiteMap({ cities, carRecommendations, videoReviews })

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
