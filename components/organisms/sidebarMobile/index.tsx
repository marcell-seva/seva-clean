import React, { useContext, useEffect } from 'react'
import styles from 'styles/components/organisms/sidebarMobile.module.scss'
import clsx from 'clsx'
import { Avatar, Button } from 'components/atoms'
import { ButtonSize, ButtonVersion, LocalStorageKey } from 'utils/types/models'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { CustomerInfoSeva } from 'utils/types/props'
import { MenuList } from 'components/molecules/menuList'
import { separatePhoneNumber } from 'utils/handler/separatePhoneNumber'
import { useRouter } from 'next/router'
import { api } from 'services/api'
import { getToken, savePageBeforeLogin } from 'utils/handler/auth'
import { UtilsContext, UtilsContextType } from 'services/context'

type sidebarMobileProps = {
  showSidebar?: boolean
  isShowAnnouncementBox?: boolean | null
}

const SidebarMobile = ({
  showSidebar,
  isShowAnnouncementBox,
}: sidebarMobileProps): JSX.Element => {
  const [isLogin] = React.useState(!!getToken())
  const [nameIcon, setNameIcon] = React.useState('')
  const [customerDetail, setCustomerDetail] = React.useState<CustomerInfoSeva>()
  const router = useRouter()

  const { mobileWebTopMenus, saveMobileWebTopMenus } = useContext(
    UtilsContext,
  ) as UtilsContextType

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

  const fetchMobileWebTopMenu = async () => {
    const response: any = await api.getMobileHeaderMenu()
    if (response.data) {
      saveMobileWebTopMenus(response.data)
    }
  }

  const getCustomerInfoData = async () => {
    try {
      const response: any = await api.getUserInfo()
      const customerDetails = response[0]
      setCustomerDetail(customerDetails)
      setIconNameCustomer(customerDetails.fullName)
    } catch (error) {
      throw error
    }
  }

  useEffect(() => {
    fetchMobileWebTopMenu()
  }, [])

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
    sendAmplitudeData(AmplitudeEventName.WEB_LOGIN_BUTTON_CLICK, {
      Page_Origination_URL: window.location.href,
    })
    savePageBeforeLogin(window.location.pathname)
    if (typeof window !== 'undefined') {
      window.location.href = 'seva.id/masuk-akun'
    }
  }

  const handleClickMyAccount = (url: string) => {
    sendAmplitudeData(AmplitudeEventName.WEB_PROFILE_AKUN_SAYA_CLICK, {
      Page_Origination_URL: window.location.href,
    })
    router.push(url)
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
        <div
          onClick={() => {
            saveLocalStorage(
              LocalStorageKey.PageBeforeProfile,
              window.location.pathname,
            )
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
      ) : (
        <Button
          version={ButtonVersion.Secondary}
          size={ButtonSize.Big}
          onClick={handleLogin}
        >
          Masuk / Register
        </Button>
      )}

      <MenuList menuList={mobileWebTopMenus} customerDetail={customerDetail} />
    </div>
  )
}

export default SidebarMobile
