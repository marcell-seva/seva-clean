/* eslint-disable react/no-children-prop */
import Seo from 'components/atoms/seo'
import { CreditQualificationSuccess } from 'components/organisms/resultPages/success'
import { useRouter } from 'next/router'
import React, { useMemo } from 'react'
import { defaultSeoImage } from 'utils/helpers/const'
import { useFetch } from 'utils/hooks/useFetch/useFetch'
import { MetaTagApiResponse } from 'utils/types/utils'
import styles from 'styles/pages/kualifikasi-kredit-result.module.scss'

export interface Params {
  brand: string
  model: string
  tab: string
}

const CreditQualificationPageSuccess = () => {
  // useProtectPage()
  const metaTagBaseApi =
    'https://api.sslpots.com/api/meta-seos/?filters[master_model][model_code][$contains]='
  const router = useRouter()
  const model = router.query.model as string
  const { data: dataHead } = useFetch<MetaTagApiResponse[]>(
    metaTagBaseApi + model?.replaceAll('-', ''),
  )

  const head = useMemo(() => {
    const title =
      dataHead && dataHead.length > 0
        ? dataHead[0].attributes.meta_title
        : 'SEVA'
    const description =
      dataHead && dataHead.length > 0
        ? dataHead[0].attributes.meta_description
        : ''

    return { title, description }
  }, [dataHead])

  return (
    <>
      <Seo
        title={head.title}
        description={head.description}
        image={defaultSeoImage}
      />
      <div className={styles.container}>
        <CreditQualificationSuccess />
      </div>
    </>
  )
}

export default CreditQualificationPageSuccess
