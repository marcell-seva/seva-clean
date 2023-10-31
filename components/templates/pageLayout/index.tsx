import { FooterMobile, HeaderMobile } from 'components/organisms'
import React, { useState } from 'react'

import { SessionStorageKey } from 'utils/enum'
import { getToken } from 'utils/handler/auth'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import styles from 'styles/components/templates/pageLayout.module.scss'
import dynamic from 'next/dynamic'
import { RouteName } from 'utils/navigate'
import { client } from 'const/const'
import { useUtils } from 'services/context/utilsContext'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'

type PageLayoutProps = {
  children: any
  footer?: boolean
  shadowBox?: boolean
  pageOrigination?: string
  sourceButton?: string
  onShowCity?: (show: boolean) => void
}

const CitySelectorModal = dynamic(
  () => import('components/molecules').then((mod) => mod.CitySelectorModal),
  { ssr: false },
)

const PageLayout = ({
  children,
  footer = true,
  shadowBox = true,
  pageOrigination = '',
  sourceButton = '',
  onShowCity: handleCity,
}: PageLayoutProps) => {
  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const { cities, dataAnnouncementBox } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()

  const onShowCity = (show: boolean) => {
    setIsOpenCitySelectorModal(show)
  }

  const getAnnouncementBox = () => {
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
  }

  useAfterInteractive(() => {
    getAnnouncementBox()
  }, [dataAnnouncementBox])

  return (
    <>
      <div className={styles.container}>
        <HeaderMobile
          isActive={isActive}
          setIsActive={setIsActive}
          emitClickCityIcon={() => {
            setIsOpenCitySelectorModal(true)
            handleCity && handleCity(false)
          }}
          style={shadowBox ? { withBoxShadow: true, position: 'sticky' } : {}}
          isShowAnnouncementBox={showAnnouncementBox}
          setShowAnnouncementBox={saveShowAnnouncementBox}
          pageOrigination={
            client && window.location.href.includes('akun/profil')
              ? RouteName.ProfilePage
              : pageOrigination
          }
        />
        {children({ onShowCity })}
        {footer && (
          <FooterMobile
            pageOrigination={
              client && window.location.href.includes('akun/profil')
                ? RouteName.ProfilePage
                : ''
            }
          />
        )}
      </div>
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cities}
        pageOrigination={
          client && window.location.href.includes('akun/profil')
            ? RouteName.ProfilePage
            : pageOrigination
        }
        sourceButton={sourceButton}
      />
    </>
  )
}

export default PageLayout
