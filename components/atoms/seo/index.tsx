import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

interface SeoProps {
  title: string
  description: string
  image: string
}

const Seo: React.FC<SeoProps> = ({ title, description, image }) => {
  const router = useRouter()
  const currentUrl = router.asPath
  if (!title || !description || !image) {
    return null
  }
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, height=device-height, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"
      />
      <link rel="icon" href="/favicon.png" />

      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:secure_url" content={image} />

      <meta name="og:url" content={currentUrl} key="og:url" />
      <meta name="og:description" content={description} />
      <meta name="og:title" content={title} key="og:title" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  )
}

export default Seo
