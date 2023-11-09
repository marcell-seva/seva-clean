/* eslint-disable react/no-children-prop */
import Seo from 'components/atoms/seo'
import { CreditQualificationSuccess } from 'components/organisms/resultPages/success'
import React, { useEffect, useMemo } from 'react'
import { defaultSeoImage } from 'utils/helpers/const'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import styles from 'styles/pages/kualifikasi-kredit-result.module.scss'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import {
  getCities,
  getMobileFooterMenu,
  getMobileHeaderMenu,
  getAnnouncementBox as gab,
} from 'services/api'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { CityOtrOption } from 'utils/types'
import { MobileWebFooterMenuType } from 'utils/types/props'
import { MobileWebTopMenuType } from 'utils/types/utils'
import { useUtils } from 'services/context/utilsContext'
import { getToken } from 'utils/handler/auth'

export interface Params {
  brand: string
  model: string
  tab: string
}

const CreditQualificationPageSuccess = ({
  dataMobileMenu,
  dataFooter,
  dataCities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useProtectPage()

  const {
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
    saveDataAnnouncementBox,
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
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    getAnnouncementBox()
  }, [])

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.container}>
        <CreditQualificationSuccess />
      </div>
    </>
  )
}

export default CreditQualificationPageSuccess

export const getServerSideProps: GetServerSideProps<{
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )

  try {
    const [menuMobileRes, footerRes, cityRes]: any = await Promise.all([
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
    ])

    return {
      props: {
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
      },
    }
  } catch (e: any) {
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}
