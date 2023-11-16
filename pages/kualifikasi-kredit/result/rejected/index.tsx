/* eslint-disable react/no-children-prop */
import Seo from 'components/atoms/seo'
import { CreditQualificationRejected } from 'components/organisms/resultPages/rejected'
import React, { useMemo } from 'react'
import { defaultSeoImage } from 'utils/helpers/const'
import styles from 'styles/pages/kualifikasi-kredit-result.module.scss'

import { InferGetServerSidePropsType } from 'next'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { getMetaTagData } from 'services/api'
import {
  getCities,
  getMobileFooterMenu,
  getMobileHeaderMenu,
  getAnnouncementBox as gab,
} from 'services/api'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'

export interface Params {
  brand: string
  model: string
  tab: string
}

const CreditQualificationPageRejected = ({}: InferGetServerSidePropsType<
  typeof getServerSideProps
>) => {
  useProtectPage()

  return (
    <>
      <div className={styles.container}>
        <CreditQualificationRejected />
      </div>
    </>
  )
}

export default CreditQualificationPageRejected

export const getServerSideProps = async (ctx: any) => {
  const model = (ctx.query.model as string)?.replaceAll('-', '')

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
