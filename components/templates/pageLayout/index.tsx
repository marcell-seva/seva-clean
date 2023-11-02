import { AxiosResponse } from 'axios'
import { CitySelectorModal } from 'components/molecules'
import { FooterMobile, HeaderMobile } from 'components/organisms'
import React, { useState, useEffect } from 'react'
import { api } from 'services/api'

import { SessionStorageKey } from 'utils/enum'
import { getToken } from 'utils/handler/auth'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { CityOtrOption } from 'utils/types'
import { AnnouncementBoxDataType } from 'utils/types/utils'
import styles from 'styles/components/templates/pageLayout.module.scss'
import dynamic from 'next/dynamic'
import { RouteName } from 'utils/navigate'
import { client } from 'const/const'
import { useUtils } from 'services/context/utilsContext'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'

type PageLayoutProps = {
  children: React.ReactNode
  footer?: boolean
}

const PageLayout = ({ children, footer = true }: PageLayoutProps) => {
  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const { cities, dataAnnouncementBox } = useUtils()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()

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
          emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
          style={{ withBoxShadow: true, position: 'sticky' }}
          isShowAnnouncementBox={showAnnouncementBox}
          setShowAnnouncementBox={saveShowAnnouncementBox}
          pageOrigination={
            client && window.location.href.includes('akun/profil')
              ? RouteName.ProfilePage
              : ''
          }
        />
        {children}
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
            : ''
        }
      />
    </>
  )
}

export default PageLayout
