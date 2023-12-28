import Seo from 'components/atoms/seo'
import { Dealer } from 'components/organisms'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useEffect } from 'react'
import {
  getCities,
  getMobileFooterMenu,
  getMobileHeaderMenu,
  getRecommendation,
} from 'services/api'
import { useUtils } from 'services/context/utilsContext'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { defaultSeoImage } from 'utils/helpers/const'

const DealerLandingPage = ({
  dataMobileMenu,
  dataCities,
  dataRecommendation,
  dataFooterMenu,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const metaTitle = `Dealer Mobil Baru di Indonesia, Cari yang Terdekat di Seva.id`
  const metaDesc = `Cari dealer mobil baru terdekat di kota Anda di seluruh Indonesia. Hubungi dealer dan dapatkan info harga, test drive event, dan promo spesial hanya di Seva.id`
  const { saveMobileWebTopMenus, saveCities, saveMobileWebFooterMenus } =
    useUtils()
  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveCities(dataCities)
    saveMobileWebFooterMenus(dataFooterMenu)
  }, [])

  return (
    <div>
      <Seo title={metaTitle} description={metaDesc} image={defaultSeoImage} />
      <Dealer dataRecommendation={dataRecommendation} />
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )
  const params = `?city=jakarta&cityId=118`
  try {
    const [recommendationRes, menuMobileRes, citiesRes, footerMenuRes]: any =
      await Promise.all([
        getRecommendation(params),
        getMobileHeaderMenu(),
        getCities(),
        getMobileFooterMenu(),
      ])

    const [dataRecommendation, dataMobileMenu, dataCities, dataFooterMenu] =
      await Promise.all([
        recommendationRes.carRecommendations,
        menuMobileRes.data,
        citiesRes,
        footerMenuRes.data,
      ])
    return {
      props: {
        dataRecommendation,
        dataMobileMenu,
        dataCities,
        dataFooterMenu,
      },
    }
  } catch (error: any) {
    return serverSideManualNavigateToErrorPage(error?.response?.status)
  }
}

export default DealerLandingPage
