const PLP_DATA_URL = 'https://www.seva.id/mobil-bekas/c'
const PDP_DATA_URL = 'https://www.seva.id/mobil-bekas/p'

export const monthId = (month) => {
  return {
    0: 'Januari',
    1: 'Februari',
    2: 'Maret',
    3: 'April',
    4: 'Mei',
    5: 'Juni',
    6: 'Juli',
    7: 'Agustus',
    8: 'September',
    9: 'Oktober',
    10: 'November',
    11: 'Desember',
  }[month]
}

async function getDataImagePLP(data) {
  const requestPLP = await fetch(
    `https://api.sevaio.xyz/used-car/?sortBy=lowToHigh&page=1&perPage=10&brand=${data}`,
  )
  const posts = await requestPLP.json().then((res) => {
    return console.log(res.carData[0])
  })
}

function escapeCdata(data) {
  return `<![CDATA[ ${data} ]]>`
}

function generateSiteMap(posts, brand, month, metaDesc) {
  const filtered = posts.filter((data) => brand.has(data.brandName))
  const distinctData = new Set()
  const distinctFilteredPosts = []

  for (const post of posts) {
    if (!distinctData.has(post.brandName)) {
      distinctData.add(post.brandName)
      distinctFilteredPosts.push(post)
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      <loc>
          <![CDATA[ ${PLP_DATA_URL} ]]>
      </loc>
      <priority>1.0</priority>
      <news:news>
          <news:name>ProductSeva</news:name>
          <news:language>id</news:language>
          <news:publication_date>2023-11-02</news:publication_date>
          <news:title>
              ${escapeCdata(
                `Daftar Mobil Bekas - Promo Cicilan ${month} | SEVA`,
              )}
          </news:title>
          <news:keywords>
              ${escapeCdata(metaDesc)}
          </news:keywords>
      </news:news>
      <image:image>
          <image:loc>${filtered[0].mainImage}</image:loc>
      </image:image>
          </url>
           ${distinctFilteredPosts
             .map(({ mainImage, carId, brandName }) => {
               return `
             <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <loc>
                    <![CDATA[ ${PLP_DATA_URL}/${brandName
                 .toLowerCase()
                 .replace(/ /g, '-')} ]]>
                </loc>
                <priority>1.0</priority>
                <news:news>
                    <news:name>ProductSeva</news:name>
                    <news:language>id</news:language>
                    <news:publication_date>2023-11-02</news:publication_date>
                    <news:title>
                        ${escapeCdata(
                          `Daftar Mobil ${brandName} Bekas - Promo Cicilan Oktober | SEVA`,
                        )}
                    </news:title>
                    <news:keywords>
                        ${escapeCdata(metaDesc)}
                    </news:keywords>
                </news:news>
                <image:image>
                    <image:loc>${mainImage}</image:loc>
                </image:image>
             </url>
           `
             })
             .join('')}
           ${posts
             .map(
               ({
                 mainImage,
                 carId,
                 brandName,
                 modelName,
                 variantName,
                 cityName,
                 year,
               }) => {
                 return `
             <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <loc>
                    <![CDATA[ ${PDP_DATA_URL}/${brandName
                   .toLowerCase()
                   .replace(/ /g, '-')}-${modelName
                   .toLowerCase()
                   .replace(/ /g, '-')}-${variantName
                   .toLowerCase()
                   .replace(/ /g, '-')
                   .replace(/\//g, '-')}-${year}-${cityName
                   .toLowerCase()
                   .replace(/ /g, '-')}-${carId} ]]>
                </loc>
                <lastmod>2023-11-02</lastmod>
                <priority>1.0</priority>
                <news:news>
                    <news:name>ProductSeva</news:name>
                    <news:language>id</news:language>
                    <news:publication_date>2023-11-02</news:publication_date>
                    <news:title>
                        ${escapeCdata(
                          `Beli mobil bekas ${brandName} ${modelName} ${variantName} ${year} di ${cityName} | SEVA`,
                        )}
                    </news:title>
                    <news:keywords>
                        ${escapeCdata(
                          `mobil ${brandName.toLowerCase()} bekas, ${brandName.toLowerCase()} ${modelName.toLowerCase()}, ${modelName.toLowerCase()} ${variantName.toLowerCase()}`,
                        )}
                    </news:keywords>
                </news:news>
                <image:image>
                    <image:loc>${mainImage}</image:loc>
                </image:image>
             </url>
           `
               },
             )
             .join('')}
           ${posts
             .map(
               ({
                 mainImage,
                 carId,
                 brandName,
                 modelName,
                 variantName,
                 cityName,
                 year,
               }) => {
                 return `
             <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <loc>
                    <![CDATA[ ${PDP_DATA_URL}/${brandName
                   .toLowerCase()
                   .replace(/ /g, '-')}-${modelName
                   .toLowerCase()
                   .replace(/ /g, '-')}-${variantName
                   .toLowerCase()
                   .replace(/ /g, '-')
                   .replace(/\//g, '-')}-${year}-${cityName
                   .toLowerCase()
                   .replace(/ /g, '-')}-${carId}/kredit ]]>
                </loc>
                <lastmod>2023-11-02</lastmod>
                <priority>1.0</priority>
                <news:news>
                    <news:name>ProductSeva</news:name>
                    <news:language>id</news:language>
                    <news:publication_date>2023-11-02</news:publication_date>
                    <news:title>
                        ${escapeCdata(
                          `Kredit mobil bekas ${brandName} ${modelName} ${variantName} ${year} di ${cityName} | SEVA`,
                        )}
                    </news:title>
                    <news:keywords>
                        ${escapeCdata(
                          `mobil ${brandName.toLowerCase()} bekas, kredit mobil ${modelName.toLowerCase()}, kredit mobil bekas, ${modelName.toLowerCase()} ${variantName.toLowerCase()}`,
                        )}
                    </news:keywords>
                </news:news>
                <image:image>
                    <image:loc>${mainImage}</image:loc>
                </image:image>
             </url>
           `
               },
             )
             .join('')}
         </urlset>
       `
}
function SiteMap() {}

export async function getServerSideProps({ res }) {
  const fetchedData = []

  const requestPLP = await fetch(
    `https://api.sevaio.xyz/used-car/?sortBy=lowToHigh&page=1&perPage=100`,
  )
  const posts = await requestPLP.json()

  let currentPage = 1
  const totalPage = posts.meta.totalPage

  while (currentPage <= totalPage) {
    const requestPLP = await fetch(
      `https://api.sevaio.xyz/used-car/?sortBy=lowToHigh&page=${currentPage}&perPage=100`,
    )

    const response = await requestPLP.json()

    if (response.carData) {
      fetchedData.push(...response.carData)
    }
    currentPage++
  }

  const requestBrand = await fetch(
    `https://api.sevaio.xyz/used-car/get-list-brand?isAll=true`,
  )
  const brand = await requestBrand.json()

  const brandNameSet = new Set(brand.data.map((data) => data.makeName))

  const metaDesc = ['mobil bekas'].concat(
    brand.data.map((data) => `mobil ${data.makeCode}`),
  )

  const todayDate = new Date()
  const currentMonth = monthId(todayDate.getMonth())

  const sitemap = generateSiteMap(
    fetchedData,
    brandNameSet,
    currentMonth,
    metaDesc,
  )

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
