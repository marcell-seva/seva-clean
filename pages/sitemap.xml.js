import getCurrentEnvironment from 'helpers/environments'
import { monthId } from './sitemap-used-car.xml'

const rootPath = getCurrentEnvironment.rootPath

const PLP_DATA_URL = `${rootPath}/mobil-baru/c`

const currentDate = new Date()
const currentMonth = monthId(currentDate.getMonth())
const currentYear = currentDate.getFullYear()

const SiteMap = () => {}

const generateSiteMap = () => {
  return `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
            <loc>${rootPath}</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>${rootPath}/sitemap-used-car.xml</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>${rootPath}/sitemap-new-car.xml</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>${rootPath}/sitemap_index.xml</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>
        <url>
            <loc>${rootPath}/info/sitemap_index.xml</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
        </url>        
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL} ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Beli mobil baru ${currentYear} - Harga OTR dengan Promo Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil toyota, mobil daihatsu, mobil bmw, mobil isuzu, mobil peugeot ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://images.prod.seva.id/Daihatsu/New%20Ayla/main_color/main_banner_daihatsu_ayla_ultrablacksolid_1.png</image:loc>
            </image:image>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL}/toyota ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Harga OTR Toyota ${currentYear} - Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil toyota ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FToyota%2FNew%20Calya%2Fmain_color%2Fcalya_main_1.webp&amp;w=256&amp;q=20</image:loc>
            </image:image>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL}/daihatsu ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Harga OTR Daihatsu ${currentYear} - Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil daihatsu ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FDaihatsu%2FNew%20Ayla%2Fmain_color%2Fmain_banner_daihatsu_ayla_ultrablacksolid_1.png&amp;w=384&amp;q=75</image:loc>
            </image:image>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL}/isuzu ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Harga OTR Isuzu ${currentYear} - Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil isuzu ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.torq.id%2FIsuzu%2FD-MAX%2Fmain_color%2Fdmax_black.png&amp;w=384&amp;q=75</image:loc>
            </image:image>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL}/peugeot ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Harga OTR Peugeot ${currentYear} - Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil peugeot ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.torq.id%2FPeugeot%2F2008%2Fmain_color%2F2008_Fusion_Orange.png&amp;w=384&amp;q=75</image:loc>
            </image:image>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL}/bmw ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Harga OTR BMW ${currentYear} - Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil bmw ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FBMW%2F2%20Series%20Gran%20Coupe%2Fmain_color%2FBMW_2_Series_218i_Gran_Coupe_main.webp&amp;w=384&amp;q=75</image:loc>
            </image:image>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL}?bodyType=MPV ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Daftar Mobil Baru MPV - Promo Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil toyota, mobil daihatsu, mobil bmw, mobil isuzu, mobil peugeot ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FDaihatsu%2FSigra%2Fmain_color%2Fsigra_main_1.webp&amp;w=384&amp;q=75</image:loc>
            </image:image>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL}?bodyType=SUV ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Daftar Mobil Baru SUV - Promo Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil toyota, mobil daihatsu, mobil bmw, mobil isuzu, mobil peugeot ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FDaihatsu%2FRocky%2Fmain_color%2Fmainbanner_rocky_6.png&amp;w=384&amp;q=75</image:loc>
            </image:image>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL}?bodyType=SEDAN ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Daftar Mobil Baru SEDAN - Promo Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil toyota, mobil daihatsu, mobil bmw, mobil isuzu, mobil peugeot ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FToyota%2FNew%20Vios%2Fmain_color%2Fvios_main_1.webp&amp;w=384&amp;q=75</image:loc>
            </image:image>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL}?bodyType=HATCHBACK ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Daftar Mobil Baru HATCHBACK - Promo Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil toyota, mobil daihatsu, mobil bmw, mobil isuzu, mobil peugeot ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FDaihatsu%2FNew%20Ayla%2Fmain_color%2Fmain_banner_daihatsu_ayla_ultrablacksolid_1.png&amp;w=384&amp;q=75</image:loc>
            </image:image>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc><![CDATA[ ${PLP_DATA_URL}?bodyType=SPORT ]]></loc>
            <priority>1.0</priority>
            <news:news>
                <news:name>ProductSeva</news:name>
                <news:language>id</news:language>
                <news:publication_date>2023-11-27</news:publication_date>
                <news:title>
                    <![CDATA[ Daftar Mobil Baru SPORT - Promo Cicilan bulan ${currentMonth} | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ mobil baru, mobil toyota, mobil daihatsu, mobil bmw, mobil isuzu, mobil peugeot ]]>
                </news:keywords>
            </news:news>
            <image:image xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
                <image:loc>https://www.seva.id/_next/image?url=https%3A%2F%2Fimages.prod.seva.id%2FToyota%2F86%2Fmain_color%2Fmain_banner_FT86_black.png&amp;w=384&amp;q=75</image:loc>
            </image:image>
        </url>
        <url>
            <loc>${rootPath}/akun/profil</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.5</priority>
        </url>
        <url>
            <loc>${rootPath}/fasilitas-dana</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.5</priority>
        </url>
        <url>
            <loc>${rootPath}/fasilitas-dana/form</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/teman-seva/onboarding</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/teman-seva/dashboard</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.5</priority>
        </url>
        <url>
            <loc>${rootPath}/teman-seva/dashboard/aktivitas-akun</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/teman-seva/dashboard/skema-1</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/teman-seva/dashboard/skema-2</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/teman-seva/dashboard/skema-3</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/teman-seva/dashboard/skema-4</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/teman-seva/dashboard/referral-code</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/masuk-akun</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/masuk-akun/otp</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/masuk-akun/berhasil</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/fasilitas-dana/success</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/pre-approval-start</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/pre-approval-question-flow</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/pre-approval-verify-ktp</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/pre-approval-image-crop</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/pre-approval-check</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/ocr-success</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/bank-selection</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url>
            <loc>${rootPath}/pre-approval-sms-sending</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>monthly</changefreq>
            <priority>1</priority>
        </url>
        <url xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
            <loc>${rootPath}/layanan-surat-kendaraan</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.5</priority>
            <image:image>
                <image:loc>https://seva.jumpapay.com/img/banner.08b529da.png</image:loc>
            </image:image>
        </url>
        <url>
            <loc>${rootPath}/landing-promo</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.5</priority>
        </url>
        <url>
            <loc>${rootPath}/kualifikasi-kredit</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.5</priority>
        </url>
        <url>
            <loc>${rootPath}/promo-giias</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.5</priority>
        </url>
        <url xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
            <loc>${rootPath}/ridwan-hanif</loc>
            <lastmod>2023-11-27</lastmod>
            <changefreq>daily</changefreq>
            <priority>1.0</priority>
            <news:news>                
                <language>id</language>            
                <news:language>id</news:language>                
                <news:title>                
                    <![CDATA[ Berani Beli Mobil Online bareng Gubernur Otomotif SEVA, Ridwan Hanif | SEVA ]]>
                </news:title>
                <news:keywords>
                    <![CDATA[ beli mobil online, ridwan hanif, gubernur otomotif seva ]]>
                </news:keywords>
            </news:news>
        </url>
    </urlset>`
}

export async function getServerSideProps({ res }) {
  const sitemap = generateSiteMap()

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default SiteMap
