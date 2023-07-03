import React, { useEffect, useState } from 'react'
import styles from '../../../styles/saas/components/organism/headerMobile.module.scss'
import {
  IconHamburger,
  IconSearch,
  IconLocationLine,
  Overlay,
} from 'components/atoms'
import { SidebarMobile } from 'components/organism'
// import { useSearchModal } from 'components/molecules/searchModal'
import { rootUrl } from 'routes/routes'
import clsx from 'clsx'
// import { WebAnnouncementBox } from 'pages/component/PageHeaderSeva/WebAnnouncementBox'
import {
  // trackCitySelectorOpen,
  // trackOpenBurgerMenu,
  // trackSearchbarOpen,
  trackSevaLogoClick,
} from 'helpers/amplitude/seva20Tracking'
import getCurrentEnvironment from 'helpers/environments'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AnnouncementBox } from 'components/molecules'
import { AnnouncementBoxDataType } from 'utils/types/utils'
import { API, getToken } from 'utils/api'
import { AxiosResponse } from 'axios'
import endpoints from 'helpers/endpoints'

const LogoPrimary = '/v3/assets/icon/logo-primary.webp'

type HeaderMobileProps = {
  startScroll?: boolean
  isActive: boolean
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>
  emitClickCityIcon: () => void
  setShowAnnouncementBox?: (value: boolean) => void
  isShowAnnouncementBox?: boolean | null
  style?: {
    withBoxShadow?: boolean
    position?: 'fixed' | 'sticky'
  }
}

export const HeaderMobile = ({
  startScroll,
  isActive = false,
  setIsActive,
  emitClickCityIcon,
  setShowAnnouncementBox,
  isShowAnnouncementBox = false,
  style,
}: HeaderMobileProps): JSX.Element => {
  // const { showModal: showSearchModal, SearchModal } = useSearchModal()
  const enableAnnouncementBoxAleph =
    getCurrentEnvironment.featureToggles.enableAnnouncementBoxAleph

  const [announcement, setAnnouncement] = useState<AnnouncementBoxDataType>()

  const router = useRouter()

  const handleClickCityIcon = () => {
    if (!isActive) {
      // trackCitySelectorOpen({
      //   Page_Origination_URL: window.location.href,
      // })
      emitClickCityIcon()
    }
  }

  const handleSearch = () => {
    if (!isActive) {
      // showSearchModal()
      // trackSearchbarOpen({
      //   Page_Origination_URL: window.location.href,
      // })
    }
  }

  const handleToggleBurgerMenu = () => {
    if (!isActive) {
      // trackOpenBurgerMenu({
      //   Page_Origination_URL: window.location.href,
      // })
    }
    setIsActive(() => !isActive)
  }

  const handleLogoClick = () => {
    trackSevaLogoClick({
      Page_Origination_URL: window.location.href,
    })
  }

  useEffect(() => {
    API.get(endpoints.announcementBox, {
      headers: {
        'is-login': getToken() ? 'true' : 'false',
      },
    }).then((res: AxiosResponse<{ data: AnnouncementBoxDataType }>) => {
      setAnnouncement(res.data.data)
    })
  }, [])

  return (
    <>
      <header
        style={style?.position ? { position: style.position } : {}}
        className={clsx({
          [styles.wrapper]: true,
          [styles.stickyWrapper]: style?.position ? true : false,
          [styles.hideHeader]: startScroll && !isActive,
          [styles.showHeader]: !startScroll,
          [styles.isActive]: isActive,
          [styles.showAAnnouncementBox]: isShowAnnouncementBox,
          [styles.shadow]: style?.withBoxShadow,
          [styles.homepage]: router.pathname === '/' && !isActive,
        })}
      >
        <div className={styles.wrapperAnnouncementBox}>
          {isShowAnnouncementBox &&
            announcement &&
            router.pathname !== '/' &&
            enableAnnouncementBoxAleph && (
              <AnnouncementBox
                data={announcement}
                onCloseButton={() =>
                  setShowAnnouncementBox && setShowAnnouncementBox(false)
                }
              />
            )}
          <div className={styles.container}>
            <div data-testid={elementId.Homepage.GlobalHeader.HamburgerMenu}>
              <IconHamburger
                width={24}
                height={24}
                onClick={handleToggleBurgerMenu}
              />
            </div>
            <Link href={rootUrl} onClick={handleLogoClick}>
              <img
                src={LogoPrimary}
                height={30}
                alt="seva"
                data-testid={elementId.Homepage.GlobalHeader.IconLogoSeva}
              />
            </Link>
            <SidebarMobile
              showSidebar={isActive}
              isShowAnnouncementBox={isShowAnnouncementBox}
            />
            <div
              className={styles.right}
              data-testid={elementId.Homepage.GlobalHeader.IconSearch}
            >
              <IconSearch width={24} height={24} onClick={handleSearch} />
              <div
                onClick={handleClickCityIcon}
                data-testid={elementId.Homepage.GlobalHeader.IconCitySelector}
              >
                <IconLocationLine width={24} height={24} />
              </div>
            </div>
          </div>
        </div>
        {/* <SearchModal /> */}
      </header>
      <Overlay isShow={isActive} onClick={() => setIsActive(false)} />
    </>
  )
}
