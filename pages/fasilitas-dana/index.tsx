import React, { useEffect } from 'react'
import { RefinancingLandingPageContent } from 'components/organisms'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  getMenu,
  getMobileHeaderMenu,
  getMobileFooterMenu,
  getCities,
  getAnnouncementBox as gab,
  getUsedCarSearch,
} from 'services/api'
import { getToken } from 'utils/handler/auth'
import {
  CityOtrOption,
  MobileWebTopMenuType,
  NavbarItemResponse,
  SearchUsedCar,
} from 'utils/types/utils'
import { MobileWebFooterMenuType } from 'utils/types/props'
import { useUtils } from 'services/context/utilsContext'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'

const RefinancingPage = ({
  dataMobileMenu,
  dataFooter,
  dataCities,
  dataDesktopMenu,
  dataSearchUsedCar,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const metaTitle =
    'Fasilitas Dana SEVA. Dana Tunai Jaminan BPKB Aman dari ACC | SEVA'
  const metaDesc =
    'Jaminkan BPKB mobilmu di SEVA dan dapatkan Fasilitas Dana tunai untuk beragam kebutuhan terjamin dari ACC.'

  const {
    saveDesktopWebTopMenu,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataAnnouncementBox,
    saveDataSearchUsedCar,
  } = useUtils()

  const getAnnouncementBox = async () => {
    try {
      const res: any = await gab({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    saveDesktopWebTopMenu(dataDesktopMenu)
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    saveDataSearchUsedCar(dataSearchUsedCar)
    getAnnouncementBox()
  }, [])

  return (
    <>
      <Seo title={metaTitle} description={metaDesc} image={defaultSeoImage} />
      <RefinancingLandingPageContent />
    </>
  )
}

export default RefinancingPage

export const getServerSideProps: GetServerSideProps<{
  dataDesktopMenu: NavbarItemResponse[]
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
  dataSearchUsedCar: SearchUsedCar[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )
  const params = new URLSearchParams()
  params.append('query', ' ' as string)

  try {
    const [
      menuDesktopRes,
      menuMobileRes,
      footerRes,
      cityRes,
      dataSearchRes,
    ]: any = await Promise.all([
      getMenu(),
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
      getUsedCarSearch('', { params }),
    ])

    return {
      props: {
        dataDesktopMenu: menuDesktopRes.data,
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
        dataSearchUsedCar: dataSearchRes.data,
      },
    }
  } catch (e: any) {
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}
