import React, { useEffect, useState } from 'react'
import styles from 'styles/components/organisms/notFoundErrorPageContent.module.scss'
import { HeaderMobile } from '../headerMobile'
import { FooterMobile } from '../footerMobile'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { useUtils } from 'services/context/utilsContext'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { getToken } from 'utils/handler/auth'
import { SessionStorageKey } from 'utils/enum'
import { CitySelectorModal } from 'components/molecules'
import {
  getCities,
  getMobileFooterMenu,
  getMobileHeaderMenu,
} from 'services/api'
import Image from 'next/image'
import MainImage from 'public/revamp/illustration/not-found-error.svg'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Link from 'next/link'
import { getCustomerAssistantWhatsAppNumber } from 'utils/handler/lead'
import urls from 'helpers/urls'

export const NotFoundErrorPageContent = () => {
  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const {
    cities,
    dataAnnouncementBox,
    saveMobileWebTopMenus,
    saveCities,
    saveMobileWebFooterMenus,
  } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()

  const fetchData = async () => {
    const [menuMobileRes, citiesRes, footerMenuRes]: any = await Promise.all([
      getMobileHeaderMenu(),
      getCities(),
      getMobileFooterMenu(),
    ])

    const [dataMobileMenu, dataCities, dataFooter] = await Promise.all([
      menuMobileRes.data,
      citiesRes,
      footerMenuRes.data,
    ])

    saveMobileWebTopMenus(dataMobileMenu)
    saveCities(dataCities)
    saveMobileWebFooterMenus(dataFooter)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    document.body.style.overflowY = isActive ? 'hidden' : 'auto'
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [isActive])

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
    <>
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
        <div className={styles.content}>
          <Image
            src={MainImage}
            width={247}
            height={226}
            alt="Not Found Page Illustration"
          />
          <h2 className={styles.title}>
            Maaf, Halaman yang Kamu Cari
            <br />
            Tidak Ditemukan
          </h2>
          <div className={styles.buttonGroup}>
            <Link href={'/'} className={styles.styledLink}>
              <Button
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
              >
                Kembali ke Halaman Utama
              </Button>
            </Link>
            <Link
              href={`${urls.whatsappUrlPrefix}6289690008888`}
              className={styles.styledLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button version={ButtonVersion.Secondary} size={ButtonSize.Big}>
                Hubungi Tim SEVA
              </Button>
            </Link>
          </div>
        </div>
        <FooterMobile />
      </div>
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => {
          setIsOpenCitySelectorModal(false)
        }}
        cityListFromApi={cities}
      />
    </>
  )
}
