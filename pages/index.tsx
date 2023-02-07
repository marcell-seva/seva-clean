import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { InferGetServerSidePropsType } from 'next'
import {
  Footer,
  Header,
  HowToUse,
  LoanSection,
  Banner,
  ContactUs,
  CarList,
  Testimony,
  Recommendation,
  Article,
  OTRSecondary,
  Floating,
  OTRPrimary,
  Search,
  LocationList,
  LocationSelector,
  Refinancing,
  CarofTheMonth,
  Offering,
  Video,
  Simple,
  AnnouncementBox,
} from '../components/molecules'
import { api } from '../services/api'
import { useEffect, useState } from 'react'
import amplitude from 'amplitude-js'

export default function Home({
  // dataBanner,
  dataMenu,
  dataCities,
}: // dataTestimony,
// dataRecToyota,
// dataRecMVP,
// dataUsage,
// dataMainArticle,
// dataTypeCar,
// dataCarofTheMonth,
// dataAnnouncementBox,
InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [modalType, setModalType] = useState<string>('')
  const [isAnnouncementBoxShow, setIsAnnouncementBoxShow] =
    useState<boolean>(true)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const dataLocalUser = window.localStorage.getItem('seva-cust')
    const userData = dataLocalUser !== null ? JSON.parse(dataLocalUser) : null
    const isLoggedIn = userData !== null
    setIsLoggedIn(isLoggedIn)
    amplitude.getInstance().logEvent('WEB_LANDING_PAGE_VIEW')
  }, [])

  const renderModal = (key: string) => {
    switch (key) {
      case 'modalOTRSecondary':
        return (
          <OTRSecondary data={dataCities} onClick={() => setModalType('')} />
        )
      case 'modalOTRPrimary':
        return <OTRPrimary data={dataCities} onClick={() => setModalType('')} />
      case 'modalSearch':
        return <Search onSearchMobileClose={() => setModalType('')} />
      case 'modalLocationList':
        return (
          <LocationSelector
            data={dataCities}
            onCloseSelector={() => setModalType('')}
          />
        )
      case 'modalVideo':
        return <Video onClick={() => setModalType('')} />
      case 'modalThankyou':
        return <Simple onCloseModal={() => setModalType('')} />
      case 'modalOffering':
        return (
          <Offering
            openThankyouModal={() => {
              setModalType('modalThankyou')
            }}
            closeOfferingModal={() => setModalType('')}
          />
        )
      case 'modalSearch':
        return <Search onSearchMobileClose={() => setModalType('')} />
      case 'modalSearch':
        return <Search onSearchMobileClose={() => setModalType('')} />
      default:
        return <></>
    }
  }
  return (
    <>
      <Head>
        <title>SEVA - Beli Mobile Terbaru Dengan Cicilan Kredit Terbaik</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <main className={styles.main}>
        <div className={styles.wrapperHeader}>
          <Header
            data={dataMenu}
            isLoggedIn={isLoggedIn}
            onOpenModalOTR={() => setModalType('modalOTRSecondary')}
            onSearchClick={() => setModalType('modalSearch')}
          />
          {/* {isAnnouncementBoxShow && (
            <AnnouncementBox
              data={dataAnnouncementBox}
              onCloseButton={() => setIsAnnouncementBoxShow(false)}
            />
          )} */}
        </div>

        <Floating onClickImage={() => setModalType('modalVideo')} />
        <LocationList onClick={() => setModalType('modalLocationList')} />
        <div
          className={
            isAnnouncementBoxShow
              ? styles.wrapperPrimary
              : styles.wrapperSecondary
          }
        >
          {/* <Banner data={dataBanner} />
          <CarList data={dataRecToyota} />
          <HowToUse data={dataUsage} /> */}
          <LoanSection />
          {/* <Recommendation data={dataRecMVP} categoryCar={dataTypeCar} /> */}
          <Refinancing />
          {/* <CarofTheMonth
            data={dataCarofTheMonth}
            openModalOffering={() => setModalType('modalOffering')}
          />
          <Testimony data={dataTestimony} />
          <Article data={dataMainArticle} /> */}
          <h1>asd</h1>
        </div>
        {renderModal(modalType)}
        <ContactUs openThankyouModal={() => setModalType('modalThankyou')} />
        <Footer />
      </main>
    </>
  )
}

export async function getServerSideProps({ req, res }: any) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59',
  )

  try {
    const [
      // bannerRes,
      menuRes,
      citiesRes,
    ]: // testimonyRes,
    // recTotoyaRes,
    // MVPRes,
    // usageRes,
    // mainArticleRes,
    // typeCarRes,
    // carofTheMonthRes,
    // annoucementBoxRes,
    any = await Promise.all([
      // api.getBanner(),
      api.getMenu(),
      api.getCities(),
      // api.getTestimony(),
      // api.getRecommendation('?brand=Toyota&city=jakarta&cityId=118'),
      // api.getRecommendation('?bodyType=MPV&city=jakarta&cityId=118'),
      // api.getUsage(),
      // api.getMainArticle('65'),
      // api.getTypeCar('?city=jakarta'),
      // api.getCarofTheMonth(),
      // api.getAnnouncementBox(),
    ])
    const [
      // dataBanner,
      dataMenu,
      dataCities,
      // dataTestimony,
      // dataRecToyota,
      // dataRecMVP,
      // dataUsage,
      // dataMainArticle,
      // dataTypeCar,
      // dataCarofTheMonth,
      // dataAnnouncementBox,
    ] = await Promise.all([
      // bannerRes.data,
      menuRes.data,
      citiesRes,
      // testimonyRes.data,
      // recTotoyaRes.carRecommendations,
      // MVPRes.carRecommendations,
      // usageRes.data.attributes,
      // mainArticleRes,
      // typeCarRes,
      // carofTheMonthRes.data,
      // annoucementBoxRes.data,
    ])
    return {
      props: {
        // dataBanner,
        dataMenu,
        dataCities,
        // dataTestimony,
        // dataRecToyota,
        // dataRecMVP,
        // dataUsage,
        // dataMainArticle,
        // dataTypeCar,
        // dataCarofTheMonth,
        // dataAnnouncementBox,
      },
    }
  } catch (error) {
    throw error
  }
}
