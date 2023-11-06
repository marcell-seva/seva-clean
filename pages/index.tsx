import { InferGetServerSidePropsType } from 'next'
import { createContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

import { useIsMobileSSr } from 'utils/hooks/useIsMobileSsr'
import { HomepageMobile } from 'components/organisms'
import { getIsSsrMobile } from 'utils/getIsSsrMobile'
import { getCity } from 'utils/hooks/useGetCity'
import { useCar } from 'services/context/carContext'
import { useUtils } from 'services/context/utilsContext'
import {
  Article,
  Banner,
  MobileWebTopMenuType,
  NavbarItemResponse,
  TestimonialData,
} from 'utils/types/utils'
import Script from 'next/script'
import { getToken } from 'utils/handler/auth'
import {
  getRecommendation,
  getBanner,
  getMobileHeaderMenu,
  getCities,
  getTestimony,
  getUsage,
  getMainArticle,
  getTypeCar,
  getCarofTheMonth,
  getMenu,
  getAnnouncementBox as gab,
  getMobileFooterMenu,
  getMinMaxYearsUsedCar,
  getModelUsedCar,
} from 'services/api'

interface HomePageDataLocalContextType {
  dataBanner: any
  dataDesktopMenu: NavbarItemResponse[]
  dataMobileMenu: MobileWebTopMenuType[]
  dataCities: any
  dataTestimony: any
  dataRecToyota: any
  dataRecMVP: any
  dataUsage: any
  dataMainArticle: any
  dataTypeCar: any
  dataCarofTheMonth: any
  dataFooterMenu: any
  dataMinMaxYearUsedCar: any
  dataModelUsedCar: any
}
/**
 * used to pass props without drilling through components
 */
export const HomePageDataLocalContext =
  createContext<HomePageDataLocalContextType>({
    dataBanner: null,
    dataDesktopMenu: [],
    dataMobileMenu: [],
    dataCities: null,
    dataTestimony: null,
    dataRecToyota: null,
    dataRecMVP: null,
    dataUsage: null,
    dataMainArticle: null,
    dataTypeCar: null,
    dataCarofTheMonth: null,
    dataFooterMenu: [],
    dataMinMaxYearUsedCar: null,
    dataModelUsedCar: [],
  })

export default function WithTracker({
  dataReccomendation,
  dataBanner,
  dataDesktopMenu,
  dataMobileMenu,
  dataCities,
  dataTestimony,
  dataRecToyota,
  dataRecMVP,
  dataUsage,
  dataMainArticle,
  dataTypeCar,
  dataCarofTheMonth,
  dataMinMaxYearUsedCar,
  dataModelUsedCar,
  ssr,
  dataFooterMenu,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { saveTypeCar, saveCarOfTheMonth, saveRecommendationToyota } = useCar()
  const {
    saveArticles,
    saveDesktopWebTopMenu,
    saveMobileWebTopMenus,
    saveDataAnnouncementBox,
    saveMobileWebFooterMenus,
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
    saveArticles(dataMainArticle)
    saveCarOfTheMonth(dataCarofTheMonth)
    saveTypeCar(dataTypeCar)
    saveRecommendationToyota(dataRecToyota)
    getAnnouncementBox()
    saveMobileWebFooterMenus(dataFooterMenu)
  }, [])

  return (
    <HomePageDataLocalContext.Provider
      value={{
        dataBanner,
        dataDesktopMenu,
        dataMobileMenu,
        dataCities,
        dataTestimony,
        dataRecToyota,
        dataRecMVP,
        dataUsage,
        dataMainArticle,
        dataTypeCar,
        dataCarofTheMonth,
        dataFooterMenu,
        dataMinMaxYearUsedCar,
        dataModelUsedCar,
      }}
    >
      <Script
        id="product-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            jsonLD(dataMainArticle, dataBanner, dataTestimony),
          ),
        }}
        key="product-jsonld"
      />
      <HomepageMobile dataReccomendation={dataReccomendation} ssr={ssr} />
    </HomePageDataLocalContext.Provider>
  )
}

export async function getServerSideProps(context: any) {
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )
  const params = `?city=jakarta&cityId=118`
  try {
    const [
      recommendationRes,
      bannerRes,
      menuMobileRes,
      citiesRes,
      testimonyRes,
      recTotoyaRes,
      MVPRes,
      usageRes,
      mainArticleRes,
      typeCarRes,
      carofTheMonthRes,
      menuDesktopRes,
      footerMenuRes,
      minmaxYearRes,
      modelUsedCarRes,
    ]: any = await Promise.all([
      getRecommendation(params),
      getBanner(),
      getMobileHeaderMenu(),
      getCities(),
      getTestimony(),
      getRecommendation('?brand=Toyota&city=jakarta&cityId=118'),
      getRecommendation('?bodyType=MPV&city=jakarta&cityId=118'),
      getUsage(),
      getMainArticle('65'),
      getTypeCar('?city=jakarta'),
      getCarofTheMonth('?city=' + getCity().cityCode),
      getMenu(),
      getMobileFooterMenu(),
      getMinMaxYearsUsedCar(''),
      getModelUsedCar(''),
    ])

    const [
      dataReccomendation,
      dataBanner,
      dataMobileMenu,
      dataCities,
      dataTestimony,
      dataRecToyota,
      dataRecMVP,
      dataUsage,
      dataMainArticle,
      dataTypeCar,
      dataCarofTheMonth,
      dataDesktopMenu,
      dataFooterMenu,
      dataMinMaxYearUsedCar,
      dataModelUsedCar,
    ] = await Promise.all([
      recommendationRes.carRecommendations,
      bannerRes.data,
      menuMobileRes.data,
      citiesRes,
      testimonyRes.data,
      recTotoyaRes.carRecommendations,
      MVPRes.carRecommendations,
      usageRes.data.attributes,
      mainArticleRes,
      typeCarRes,
      carofTheMonthRes.data,
      menuDesktopRes.data,
      footerMenuRes.data,
      minmaxYearRes.data,
      modelUsedCarRes.data,
    ])
    return {
      props: {
        dataReccomendation,
        dataBanner,
        dataMobileMenu,
        dataCities,
        dataTestimony,
        dataRecToyota,
        dataRecMVP,
        dataUsage,
        dataMainArticle,
        dataTypeCar,
        dataCarofTheMonth,
        dataMinMaxYearUsedCar,
        dataModelUsedCar,
        isSsrMobile: getIsSsrMobile(context),
        dataDesktopMenu,
        ssr: 'success',
        dataFooterMenu,
      },
    }
  } catch (error) {
    return {
      props: {
        dataBanner: null,
        dataDesktopMenu: [],
        dataMobileMenu: [],
        dataCities: null,
        dataTestimony: null,
        dataRecToyota: null,
        dataRecMVP: null,
        dataUsage: null,
        dataMainArticle: null,
        dataTypeCar: null,
        dataCarofTheMonth: null,
        dataMinMaxYearUsedCar: null,
        dataModelUsedCar: [],
        ssr: 'failed',
      },
    }
  }
}

const jsonLD = (
  dataMainArticles: Article[],
  dataBanners: Banner[],
  dataReviews: TestimonialData[],
) => {
  return {
    Organization: {
      '@type': 'Organization',
      name: 'SEVA by Astra',
      url: 'https://www.seva.id/',
      logo: 'https://www.seva.id/static/media/seva-header.30f3b7238c6c0f5cea869e76e5924de4.svg',
      image: 'logo-primary.webp',
      sameAs: [
        'https://www.instagram.com/sevabyastra/',
        'https://twitter.com/sevaid_official',
        'https://www.facebook.com/sevabyastra/',
      ],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jakarta',
        addressRegion: 'Jakarta',
        postalCode: '10220',
        streetAddress:
          'Jl. Jenderal Sudirman No.Kav.5-6, RT.10/RW.6, Karet Tengsin, Kecamatan Tanah Abang',
        telephone: '(021) 50821999',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate:
            'https://www.seva.id/search/result?q={search_term_string}',
          'query-input': {
            '@type': 'PropertyValueSpecification',
            valueRequired: 'https://schema.org/True',
            valueName: 'search_term_string',
          },
        },
      },
    },
    ImageObject: dataBanners.map((banner) => ({
      '@type': 'ImageObject',
      contentUrl:
        banner.attribute.web_mobile.split('/')?.[
          banner.attribute.web_mobile.split('/')?.length - 1
        ],
      mainEntityOfPage: banner.attribute.web_mobile,
      representativeOfPage: 'https://schema.org/True',
      isFamilyFriendly: 'https://schema.org/True',
      isAccesibleForFree: 'https://schema.org/False',
    })),
    Review: dataReviews.map((review) => ({
      '@type': 'Review',
      name: 'Cerita Pengguna SEVA',
      itemReviewed: {
        '@type': 'Car',
        image: review.pictureUrl,
        name: review.name,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          publisher: {
            '@type': 'Organization',
            name: 'SEVA by Astra',
          },
        },
      },
    })),
    SiteNavigationElement: {
      '@type': 'SiteNavigationElement',
      name: 'SEVA',
      potentialAction: [
        {
          '@type': 'Action',
          name: 'Mobil',
          url: 'https://www.seva.id/mobil-baru',
        },
        {
          '@type': 'Action',
          name: 'Fasilitas Dana',
          url: 'https://www.seva.id/fasilitas-dana',
        },
        {
          '@type': 'Action',
          name: 'Layanan Surat Kendaraan',
          url: 'https://www.seva.id/layanan-surat-kendaraan',
        },
        {
          '@type': 'Action',
          name: 'Tentang SEVA',
          url: 'https://www.seva.id/info/tentang-kami/',
        },
        {
          '@type': 'Action',
          name: 'Promo',
          url: 'https://www.seva.id/info/promo/',
        },
        {
          '@type': 'Action',
          name: 'Teman SEVA',
          url: 'https://www.seva.id/teman-seva/onboarding',
        },
        {
          '@type': 'Action',
          name: 'Berita Utama Otomotif',
          url: 'https://www.seva.id/blog/category/otomotif/',
        },
        {
          '@type': 'Action',
          name: 'Review Otomotif',
          url: 'https://www.seva.id/blog/category/otomotif/review-otomotif/',
        },
        {
          '@type': 'Action',
          name: 'Tips & Rekomendasi',
          url: 'https://www.seva.id/blog/category/otomotif/tips-rekomendasi-otomotif/',
        },
        {
          '@type': 'Action',
          name: 'Keuangan',
          url: 'https://www.seva.id/blog/category/keuangan/',
        },
        {
          '@type': 'Action',
          name: 'Semua Artikel',
          url: 'https://www.seva.id/blog/',
        },
        {
          '@type': 'Action',
          name: 'Akun Saya',
          url: 'https://www.seva.id/akun/profil',
        },
      ],
    },
    NewsArticle: dataMainArticles.map((article) => ({
      '@type': 'NewsArticle',
      mainEntityOfPage: 'https://www.seva.id/',
      headline: article.title,
      abstract: article.excerpt,
      image: article.featured_image,
      datePublished: new Date(article.publish_date).toLocaleDateString(
        'id-ID',
        { dateStyle: 'long' },
      ),
      dateModified: new Date(article.publish_date).toLocaleDateString('id-ID', {
        dateStyle: 'long',
      }),
      author: {
        '@type': 'Person',
        name: article.writer_name,
      },
      publisher: {
        '@type': 'Organization',
        name: 'SEVA by Astra',
        logo: {
          '@type': 'ImageObject',
          url: 'https://cdn.seva.id/blog/media/2022/07/Seva-LogoxAF_Seva-PrimarybyAstraFinancial3.png',
        },
      },
    })),
    Website: {
      '@type': 'Website',
      name: 'SEVA by Astra',
      url: 'https://www.seva.id/',
    },
  }
}
