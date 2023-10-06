import React, { useEffect } from 'react'
import { Avatar, Button } from 'components/atoms'
import { MenuList } from 'components/molecules'
import styles from '../../../styles/components/organisms/sidebarMobile.module.scss'
import { LoginSevaUrl } from 'utils/helpers/routes'
import { getToken } from 'utils/handler/auth'
import {
  trackLoginButtonClick,
  trackProfileAkunSayaClick,
} from 'helpers/amplitude/seva20Tracking'
import { savePageBeforeLogin } from 'utils/loginUtils'
import clsx from 'clsx'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { useRouter } from 'next/router'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { separatePhoneNumber } from 'utils/handler/separatePhoneNumber'
import { fetchCustomerDetails } from 'utils/httpUtils/customerUtils'
import { CustomerInfoSeva } from 'utils/types/utils'
import { useUtils } from 'services/context/utilsContext'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getPageName } from 'utils/pageName'
import { saveSessionStorage } from 'utils/handler/sessionStorage'

type sidebarMobileProps = {
  showSidebar?: boolean
  isShowAnnouncementBox?: boolean | null
  pageOrigination?: string
  isOTO?: boolean
}

const sidebarMobile = ({
  showSidebar,
  isShowAnnouncementBox,
  pageOrigination,
  isOTO = false,
}: sidebarMobileProps): JSX.Element => {
  const [isLogin] = React.useState(!!getToken())
  const [nameIcon, setNameIcon] = React.useState('')
  const [customerDetail, setCustomerDetail] = React.useState<CustomerInfoSeva>()
  const router = useRouter()

  const { mobileWebTopMenus } = useUtils()

  const setIconNameCustomer = (payload: string) => {
    if (payload.indexOf(' ') > 0) {
      const nameTmp = payload.split(' ')
      const firstInitial = nameTmp.slice(0, 1).join('')
      const secondInitial = nameTmp.slice(1).join('')
      const initialName = firstInitial[0] + secondInitial[0]
      setNameIcon(initialName.toUpperCase())
    } else {
      setNameIcon(payload?.slice(0, 2).toUpperCase())
    }
  }

  const getCustomerInfoData = async () => {
    try {
      const response = await fetchCustomerDetails()
      const customerDetails = response[0]
      setCustomerDetail(customerDetails)
      setIconNameCustomer(customerDetails.fullName)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    if (isLogin) {
      getCustomerInfoData()
    }
  }, [isLogin])

  const phoneNumber = React.useMemo(() => {
    if (customerDetail) {
      return separatePhoneNumber(customerDetail.phoneNumber)
    }
  }, [customerDetail])

  const handleLogin = () => {
    trackLoginButtonClick({
      Page_Origination_URL: window.location.href,
    })
    if (pageOrigination && pageOrigination.length !== 0) {
      trackEventCountly(CountlyEventNames.WEB_HAMBURGER_LOGIN_REGISTER_CLICK, {
        PAGE_ORIGINATION: pageOrigination,
      })
      saveSessionStorage(
        SessionStorageKey.PageReferrerLoginPage,
        pageOrigination,
      )
      saveSessionStorage(
        SessionStorageKey.PreviousSourceSectionLogin,
        'Hamburger Menu',
      )
    }
    savePageBeforeLogin(window.location.pathname)
    router.push(LoginSevaUrl)
  }

  const handleClickMyAccount = (url: string) => {
    trackProfileAkunSayaClick({
      Page_Origination_URL: window.location.href,
    })
    if (pageOrigination) {
      saveSessionStorage(
        SessionStorageKey.PageReferrerProfilePage,
        pageOrigination,
      )
    }
    window.location.href = url
  }

  return (
    <div
      className={clsx({
        [styles.wrapper]: true,
        [styles.wrapperWithSpace]: isShowAnnouncementBox,
        [styles.hideSidebar]: !showSidebar,
        [styles.showSidebar]: showSidebar,
      })}
    >
      {isLogin ? (
        <>
          <div
            role="navigation"
            onClick={() => {
              saveLocalStorage(
                LocalStorageKey.PageBeforeProfile,
                window.location.pathname,
              )
              trackEventCountly(CountlyEventNames.WEB_HAMBURGER_ACCOUNT_CLICK, {
                PAGE_ORIGINATION: getPageName(),
                SOURCE_SECTION: 'Top',
              })
              handleClickMyAccount('/akun/profil')
            }}
            className={styles.profileWrapper}
          >
            <Avatar title={nameIcon} />

            <div className={styles.profileContent}>
              <h2 className={styles.profileName}>{customerDetail?.fullName}</h2>
              <h2 className={styles.profileNumber}>
                {phoneNumber?.code} | {phoneNumber?.number}
              </h2>
            </div>
          </div>

          {/* TODO component for credit, maybe used later */}
          {/* <div className={styles.creditInfoWrapper}>
            <div className={styles.creditCircle} />
            <div className={styles.creditInfoHeader}>
              <h2 className={styles.creditInfoHeading}>
                Lanjutkan Kualifikasi Kreditmu
              </h2>
              <IconChevronRight width={20} height={20} color="white" />
            </div>

            <div className={styles.creditInfoDetailWrapper}>
              <img
                className={styles.creditInfoPicture}
                src="https://imageio.forbes.com/specials-images/imageserve/5d35eacaf1176b0008974b54/0x0.jpg?format=jpg&crop=4560,2565,x790,y784,safe&width=1200"
                alt="car"
              />

              <div>
                <h2 className={styles.creditInfoTitle}>Toyota Raize</h2>
                <h2 className={styles.creditInfoPrice}>Rp247.300.000</h2>
              </div>
            </div>
          </div> */}
        </>
      ) : (
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Big}
          onClick={handleLogin}
        >
          Masuk / Register
        </Button>
      )}

      <MenuList
        menuList={mobileWebTopMenus}
        customerDetail={customerDetail}
        isOTO={isOTO}
        pageOrigination={pageOrigination}
      />
    </div>
  )
}

export default sidebarMobile
