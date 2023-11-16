import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/delete-account.module.scss'

import clsx from 'clsx'
import {
  trackDeleteAccountPageView,
  trackProfileDeleteAccountConsentPageCTAClick,
} from 'helpers/amplitude/seva20Tracking'
import { useRouter } from 'next/router'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { getToken } from 'utils/handler/auth'
import { SessionStorageKey } from 'utils/enum'
import { CityOtrOption } from 'utils/types'

import { MobileWebTopMenuType } from 'utils/types/utils'
import { deleteAccountReasonUrl } from 'utils/helpers/routes'
import { HeaderMobile } from 'components/organisms'
import { IconCheckedBox } from 'components/atoms/icon'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { MobileWebFooterMenuType } from 'utils/types/props'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useUtils } from 'services/context/utilsContext'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import dynamic from 'next/dynamic'
import {
  getMobileHeaderMenu,
  getMobileFooterMenu,
  getCities,
  getAnnouncementBox as gab,
} from 'services/api'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'

const CitySelectorModal = dynamic(
  () => import('components/molecules').then((mod) => mod.CitySelectorModal),
  { ssr: false },
)

export default function HapusAkun({
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
  const [isBoxChecked, setIsBoxChecked] = useState(false)

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

  const onClickCheckBox = () => {
    setIsBoxChecked((prev) => !prev)
  }

  const onClickNext = () => {
    trackProfileDeleteAccountConsentPageCTAClick()
    router.push(deleteAccountReasonUrl)
  }

  useEffect(() => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
    saveCities(dataCities)
    getAnnouncementBox()
  }, [])

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

  useAfterInteractive(() => {
    const timeoutAfterInteractive = setTimeout(() => {
      trackDeleteAccountPageView()
    }, 500)

    return () => clearTimeout(timeoutAfterInteractive)
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
        style={{ withBoxShadow: true, position: 'fixed' }}
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
        <h2 className={styles.title}>Hapus Akun</h2>
        <span className={styles.subtitle}>
          Penghapusan akun bersifat permanen. Demi keamanan kamu, kami akan
          memverifikasi permintaan penghapusan akun kamu berdasarkan hal
          berikut:
        </span>

        <h2 className={styles.title}>Kebijakan Penghapusan Akun</h2>
        <ol className={`${styles.subtitle} ${styles.orderedListStyle}`}>
          <li className={styles.listItemStyle}>
            Pemesanan dan transaksi yang sedang berlangsung harus diselesaikan
            terlebih dahulu sebelum penghapusan akun dilakukan.
          </li>
          <br />
          <li className={styles.listItemStyle}>
            Semua voucher akan menjadi tidak valid setelah akun kamu dihapus
          </li>
          <br />
          <li className={styles.listItemStyle}>
            Setelah berhasil menghapus akun kamu, kamu tidak dapat mengakses
            layanan SEVA melalui akun yang lama
          </li>
          <br />
          <li className={styles.listItemStyle}>
            Data kamu terkait dengan layanan SEVA akan dihapus.
          </li>
        </ol>
      </div>

      <div className={styles.floatingWrapper}>
        <div className={styles.checkboxSection}>
          <div
            role="button"
            className={styles.iconWrapper}
            onClick={onClickCheckBox}
          >
            <IconCheckedBox isActive={isBoxChecked} width={16} height={16} />
          </div>
          <span className={styles.checkboxText}>
            Saya menyetujui Syarat & Ketentuan penghapusan akun.
          </span>
        </div>

        <Button
          size={ButtonSize.Big}
          version={ButtonVersion.PrimaryDarkBlue}
          disabled={!isBoxChecked}
          onClick={onClickNext}
        >
          Lanjutkan
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
