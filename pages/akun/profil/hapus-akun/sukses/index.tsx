import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/delete-account-success.module.scss'
import clsx from 'clsx'
import {
  trackDeleteAccountSuccessPageView,
  trackDeleteAccountSucessCTAClick,
} from 'helpers/amplitude/seva20Tracking'
import { useRouter } from 'next/router'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { getToken } from 'utils/handler/auth'
import { SessionStorageKey } from 'utils/enum'
import { CityOtrOption } from 'utils/types'
import { api } from 'services/api'
import { MobileWebTopMenuType } from 'utils/types/utils'
import { rootUrl } from 'utils/helpers/routes'
import { HeaderMobile } from 'components/organisms'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Image from 'next/image'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useUtils } from 'services/context/utilsContext'
import { MobileWebFooterMenuType } from 'utils/types/props'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import dynamic from 'next/dynamic'

const CitySelectorModal = dynamic(
  () => import('components/molecules').then((mod) => mod.CitySelectorModal),
  { ssr: false },
)

const MainImage = '/revamp/illustration/approved.webp'

export default function SuccessHapusAkun({
  dataMobileMenu,
  dataFooter,
  dataCities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()

  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const {
    cities,
    dataAnnouncementBox,
    saveDataAnnouncementBox,
    saveMobileWebTopMenus,
    saveMobileWebFooterMenus,
    saveCities,
  } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

  const getAnnouncementBox = async () => {
    try {
      const res: any = await api.getAnnouncementBox({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
    } catch (error) {}
  }

  const navigateHandler = () => {
    router.push(rootUrl)
  }

  const onClickCta = () => {
    trackDeleteAccountSucessCTAClick({
      Reason: (router.query.reason as string) || '',
    })
    navigateHandler()
  }

  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    getAnnouncementBox()

    const timer = setTimeout(() => {
      navigateHandler()
    }, 5000)

    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  useAfterInteractive(() => {
    if (dataAnnouncementBox) {
      const isShowAnnouncement = getSessionStorage(
        getToken()
          ? SessionStorageKey.ShowWebAnnouncementLogin
          : SessionStorageKey.ShowWebAnnouncementNonLogin,
      )
      if (typeof isShowAnnouncement !== 'undefined') {
        saveShowAnnouncementBox(isShowAnnouncement as boolean)
      } else {
        saveShowAnnouncementBox(true)
      }
    } else {
      saveShowAnnouncementBox(false)
    }
  }, [dataAnnouncementBox])

  return (
    <div className={styles.container}>
      <HeaderMobile
        isActive={isActive}
        setIsActive={setIsActive}
        style={{
          position: 'fixed',
        }}
        emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
        setShowAnnouncementBox={saveShowAnnouncementBox}
        isShowAnnouncementBox={showAnnouncementBox}
      />
      <div
        className={clsx({
          [styles.content]: !showAnnouncementBox,
          [styles.contentWithSpace]: showAnnouncementBox,
        })}
      >
        <Image
          src={MainImage}
          alt="delete-account-success-main-image"
          width="224"
          height="225"
          className={styles.mainImage}
        />

        <h2 className={styles.title}>
          Permintaan untuk menghapus akun berhasil
        </h2>

        <span className={styles.subtitle}>
          Terima kasih atas dukunganmu.
          <br />
          Kami berharap dapat membantu kamu
          <br />
          kembali pada kesempatan lainnya.
        </span>

        <span className={styles.countdown}>
          Halaman ini akan tertutup
          <br />
          otomatis dalam {countdown} detik
        </span>
      </div>

      <div className={styles.floatingWrapper}>
        <Button
          size={ButtonSize.Big}
          version={ButtonVersion.PrimaryDarkBlue}
          onClick={onClickCta}
        >
          Kembali ke Beranda
        </Button>
      </div>

      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cities}
      />
    </div>
  )
}

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
      api.getMobileHeaderMenu(),
      api.getMobileFooterMenu(),
      api.getCities(),
    ])

    return {
      props: {
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
      },
    }
  } catch (e) {
    return {
      props: {
        dataMobileMenu: [],
        dataFooter: [],
        dataCities: [],
      },
    }
  }
}
