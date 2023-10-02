import { AxiosResponse } from 'axios'
import { CitySelectorModal } from 'components/molecules'
import { FooterMobile, HeaderMobile } from 'components/organisms'
import React, { useState, useEffect } from 'react'
import { api } from 'services/api'
import { getCities } from 'services/cities'
import { SessionStorageKey } from 'utils/enum'
import { getToken } from 'utils/handler/auth'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { CityOtrOption } from 'utils/types'
import { AnnouncementBoxDataType } from 'utils/types/utils'
import styles from 'styles/components/templates/pageLayout.module.scss'

type PageLayoutProps = {
  children: React.ReactNode
  footer?: boolean
}

const PageLayout = ({ children, footer = true }: PageLayoutProps) => {
  const [isActive, setIsActive] = useState(false)
  const [isOpenCitySelectorModal, setIsOpenCitySelectorModal] = useState(false)
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])
  const [showAnnouncementBox, setShowAnnouncementBox] = useState<
    boolean | null
  >(
    getSessionStorage(
      getToken()
        ? SessionStorageKey.ShowWebAnnouncementLogin
        : SessionStorageKey.ShowWebAnnouncementNonLogin,
    ),
  )

  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      getCities().then((res) => {
        setCityListApi(res)
      })
    }
  }

  useEffect(() => {
    getAnnouncementBox()
    checkCitiesData()
  }, [])

  const getAnnouncementBox = () => {
    api
      .getAnnouncementBox({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      .then((res: AxiosResponse<{ data: AnnouncementBoxDataType }>) => {
        if (res.data === undefined) {
          setShowAnnouncementBox(false)
        }
      })
  }

  return (
    <>
      <div className={styles.container}>
        <HeaderMobile
          isActive={isActive}
          setIsActive={setIsActive}
          emitClickCityIcon={() => setIsOpenCitySelectorModal(true)}
          style={{ withBoxShadow: true, position: 'sticky' }}
          isShowAnnouncementBox={showAnnouncementBox}
          setShowAnnouncementBox={setShowAnnouncementBox}
        />
        {children}
        {footer && <FooterMobile />}
      </div>
      <CitySelectorModal
        isOpen={isOpenCitySelectorModal}
        onClickCloseButton={() => setIsOpenCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
    </>
  )
}

export default PageLayout
