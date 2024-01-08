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
import { CityOtrOption } from 'utils/types'
import { DealerBrand } from 'utils/types/utils'

const DealerBrandLocation = ({
  dataMobileMenu,
  dataCities,
  dataRecommendation,
  dataFooterMenu,
  dataDealerBranch,
  dataTagArticle,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const router = useRouter()
  const getUrlBrand = router.query.brand?.toString() ?? ''
  const getUrlLocation =
    router.query.location?.toString().replaceAll('-', ' ') ?? ''

  const metaTitle = `Temukan ${dataDealerBranch.length.toString()} Dealer Mobil ${
    getUrlBrand.toLowerCase() === 'bmw'
      ? getUrlBrand.toUpperCase()
      : capitalizeFirstLetter(getUrlBrand)
  } di ${capitalizeWords(getUrlLocation)} | SEVA`
  const metaDesc = `Temukan dealer ${
    getUrlBrand.toLowerCase() === 'bmw'
      ? getUrlBrand.toUpperCase()
      : capitalizeFirstLetter(getUrlBrand)
  } di ${capitalizeWords(
    getUrlLocation,
  )}. Dapatkan informasi mengenai harga OTR ${capitalizeWords(
    getUrlLocation,
  )} dan penawaran terbaik di Seva.id`

  const {
    saveMobileWebTopMenus,
    saveCities,
    saveMobileWebFooterMenus,
    saveDealerBrandLocation,
    saveDealerArticles,
    saveDataSearchUsedCar,
  } = useUtils()
  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveCities(dataCities)
    saveMobileWebFooterMenus(dataFooterMenu)
    saveDealerBrandLocation(dataDealerBranch)
    saveDealerArticles(dataTagArticle)
    saveDataSearchUsedCar(dataSearchUsedCar)
  }, [])

  return (
    <div>
      <Seo title={metaTitle} description={metaDesc} image={defaultSeoImage} />
      <Dealer dataRecommendation={dataRecommendation} page="location" />
    </div>
  )
}

export const getServerSideProps = async (context: any) => {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )

  const { brand, location } = context.query

  const params = `?brand=${
    brand === 'bmw' ? brand.toUpperCase() : capitalizeWords(brand)
  }&city=jakarta&cityId=118`
  try {
    const [
      recommendationRes,
      menuMobileRes,
      citiesRes,
      footerMenuRes,
      dealerBrandRes,
      tagArticleRes,
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
      dataDealerBrand,
      dataTagArticle,
      dataSearchUsedCar,
    ] = await Promise.all([
      recommendationRes.carRecommendations,
      menuMobileRes.data,
      citiesRes,
      footerMenuRes.data,
      dealerBrandRes.data,
      tagArticleRes,
      dataSearchRes.data,
    ])

    const checkCityByCityCode = (index: string) => {
      return dataDealerBrand.find(
        (item: DealerBrand) =>
          item.cityName.replace(/ /g, '-').toLocaleLowerCase() ===
          index.replace(/ /g, '-').toLocaleLowerCase(),
      )
    }

    let finalLocation: DealerBrand = checkCityByCityCode(location)

    const [DealerBranchLocationRes]: any = await Promise.all([
      getDealer(
        `?brand=${
          brand === 'bmw' ? brand.toUpperCase() : capitalizeWords(brand)
        }&city=${finalLocation.cityId}`,
      ),
    ])

    const [dataDealerBranch] = await Promise.all([DealerBranchLocationRes.data])

    return {
      props: {
        dataRecommendation,
        dataMobileMenu,
        dataCities,
        dataFooterMenu,
        dataDealerBranch,
        dataTagArticle,
        dataSearchUsedCar,
      },
    }
  } catch (error: any) {
    return serverSideManualNavigateToErrorPage(error?.response?.status)
  }
}

export default DealerBrandLocation
