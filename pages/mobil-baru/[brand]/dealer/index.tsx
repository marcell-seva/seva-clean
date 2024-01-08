import Seo from 'components/atoms/seo'
import { Dealer } from 'components/organisms'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  getCities,
  getDealer,
  getMobileFooterMenu,
  getMobileHeaderMenu,
  getRecommendation,
  getTagArticle,
  getUsedCarSearch,
} from 'services/api'
import { useUtils } from 'services/context/utilsContext'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { defaultSeoImage } from 'utils/helpers/const'
import { capitalizeFirstLetter, capitalizeWords } from 'utils/stringUtils'

const DealerBrand = ({
  dataMobileMenu,
  dataCities,
  dataRecommendation,
  dataFooterMenu,
  dataDealerBranch,
  dataTagArticle,
  dataTotalBranch,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const getUrlBrand = router.query.brand?.toString() ?? ''
  const metaTitle = `Temukan ${dataTotalBranch.dealerCount.toString()} Dealer Mobil ${
    getUrlBrand.toLowerCase() === 'bmw'
      ? getUrlBrand.toUpperCase()
      : capitalizeFirstLetter(getUrlBrand)
  } di Indonesia | SEVA`
  const metaDesc = `Temukan dealer ${
    getUrlBrand.toLowerCase() === 'bmw'
      ? getUrlBrand.toUpperCase()
      : capitalizeFirstLetter(getUrlBrand)
  } terdekat dengan Anda. Dapatkan informasi mengenai harga dan penawaran terbaik dari dealer rekanan SEVA hanya di Seva.id`

  const {
    saveMobileWebTopMenus,
    saveCities,
    saveMobileWebFooterMenus,
    saveDealerBrand,
    saveDealerArticles,
    saveDataSearchUsedCar,
  } = useUtils()
  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveCities(dataCities)
    saveMobileWebFooterMenus(dataFooterMenu)
    saveDealerBrand(dataDealerBranch)
    saveDealerArticles(dataTagArticle)
    saveDataSearchUsedCar(dataSearchUsedCar)
  }, [])

  return (
    <div>
      <Seo title={metaTitle} description={metaDesc} image={defaultSeoImage} />
      <Dealer
        dataRecommendation={dataRecommendation}
        page="brand"
        dealerCount={dataTotalBranch}
      />
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )

  const { brand } = context.query

  const params = `?brand=${
    brand === 'bmw' ? brand.toUpperCase() : capitalizeWords(brand)
  }&city=jakarta&cityId=118`
  try {
    const [
      recommendationRes,
      menuMobileRes,
      citiesRes,
      footerMenuRes,
      dealerBranchRes,
      articleRes,
      dataSearchRes,
    ]: any = await Promise.all([
      getRecommendation(params),
      getMobileHeaderMenu(),
      getCities(),
      getMobileFooterMenu(),
      getDealer(
        `?brand=${
          brand === 'bmw' ? brand.toUpperCase() : capitalizeWords(brand)
        }`,
      ),
      getTagArticle(`?tag_name=${brand.toLowerCase()}`),
      getUsedCarSearch(''),
    ])

    const [
      dataRecommendation,
      dataMobileMenu,
      dataCities,
      dataFooterMenu,
      dataDealerBranch,
      dataTagArticle,
      dataTotalBranch,
      dataSearchUsedCar,
    ] = await Promise.all([
      recommendationRes.carRecommendations,
      menuMobileRes.data,
      citiesRes,
      footerMenuRes.data,
      dealerBranchRes.data,
      articleRes,
      dealerBranchRes.meta,
      dataSearchRes.data,
    ])
    return {
      props: {
        dataRecommendation,
        dataMobileMenu,
        dataCities,
        dataFooterMenu,
        dataDealerBranch,
        dataTagArticle,
        dataTotalBranch,
        dataSearchUsedCar,
      },
    }
  } catch (error: any) {
    return serverSideManualNavigateToErrorPage(error?.response?.status)
  }
}

export default DealerBrand