import { PLP } from 'components/organism'
import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

const NewCarResultPage = ({
  meta,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.description} />
      </Head>
      <PLP />
    </>
  )
}

export default NewCarResultPage

type PLPProps = {
  title: string
  description: string
}

const getBrand = (brand: string | string[] | undefined) => {
  if (brand === 'toyota') {
    return 'Toyota'
  } else if (brand === 'daihatsu') {
    return 'Daihatsu'
  } else if (brand === 'bmw') {
    return 'Bmw'
  } else {
    return ''
  }
}

export const getServerSideProps: GetServerSideProps<{
  meta: PLPProps
}> = async (ctx) => {
  const brand = getBrand(ctx.query.brand)
  const metaTagBaseApi =
    'https://api.sslpots.com/api/meta-seos/?filters[location_page3][$eq]=CarSearchResult'
  const meta = { title: 'SEVA', description: '' }
  try {
    const fetchMeta = await axios.get(metaTagBaseApi + brand)

    const metaData = fetchMeta.data.data
    if (metaData && metaData.length > 0) {
      meta.title = metaData[0].attributes.meta_title
      meta.description = metaData[0].attributes.meta_description
    }

    return { props: { meta } }
  } catch (e) {
    return { props: { meta } }
  }
}
