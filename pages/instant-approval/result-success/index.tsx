/* eslint-disable react/no-children-prop */
import Seo from 'components/atoms/seo'
import { CreditQualificationSuccess } from 'components/organisms/resultPages/success'
import { InferGetServerSidePropsType } from 'next'
import { useMemo } from 'react'
import { getMetaTagData } from 'services/api'

import styles from 'styles/pages/kualifikasi-kredit-result.module.scss'
import { defaultSeoImage } from 'utils/helpers/const'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'

export interface Params {
  brand: string
  model: string
  tab: string
}

const CreditQualificationPageSuccess = ({
  meta: dataHead,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useProtectPage()
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

export const getServerSideProps = async (ctx: any) => {
  const model = (ctx.query.model as string)?.replaceAll('-', '')

  try {
    const [meta]: any = await Promise.all([getMetaTagData(model as string)])
    return { props: { meta: meta.data } }
  } catch (e) {
    return { props: { meta: {} } }
  }
}
