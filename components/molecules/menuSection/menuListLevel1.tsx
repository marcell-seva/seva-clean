import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  StyledWrapper,
  ItemWrapper,
  StyledText,
  ProfileInfoFullName,
  IconName,
  IconWrapperName,
  ProfileWrapper,
  WrapperProfile,
  ProfileWrapperDetail,
  ProfileGreetingHai,
} from './sidebarItemStyle'
import { useSideMenuListContext } from 'context/sideMenuListContext/sideMenuListContext'
import {
  LoginSevaUrl,
  refinancingUrl,
  TemanSevaDashboardUrl,
  TemanSevaOnboardingUrl,
} from 'routes/routes'
import { savePageBeforeLogin } from 'utils/loginUtils'
import { removeWhitespacesAndToLowerCase } from 'utils/stringUtils'
import { fetchCustomerDetails } from 'utils/httpUtils/customerUtils'
import { getToken } from 'utils/api'
import { useSideMenuContext } from 'context/sideMenuContext/sideMenuContext'
import { getLocalStorage, saveLocalStorage } from 'utils/localstorageUtils'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import urls from 'helpers/urls'
import { colors } from 'styles/colors'
import axios from 'axios'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import elementId from 'helpers/elementIds'
import { NavbarItemResponse } from 'utils/types/utils'
import { useRouter } from 'next/router'
import { useEnableNewLogin } from 'utils/hooks/useEnableNewLogin'
import {
  trackBurgerMenuClick,
  trackHeaderNavigationMenuClick,
  trackLoginOrRegisterClick,
  trackProfileAccountClick,
} from 'helpers/amplitude/seva20Tracking'
import { trackBurgerMenuClickTemanSeva } from 'helpers/amplitude/temanSevaEventTracking'
import { LocalStorageKey } from 'utils/models/models'
import { temanSevaUrlPath } from 'services/temanseva'
import { ThreeDots } from 'components/atoms/icon/ThreeDots'
import { Forward } from 'components/atoms/icon/Forward'
import { Button, ButtonType } from 'components/atoms/ButtonOld/Button'

const ProfileIcon = '/v3/assets/illustration/Profile.svg'

interface Props {
  isShow: boolean
  data: NavbarItemResponse[]
}

export const MenuListLevel1 = ({ isShow, data }: Props) => {
  const { patchSideMenuList } = useSideMenuListContext()
  const router = useRouter()
  const [nameIcon, setNameIcon] = useState('')
  const [fullName, setFullName] = useState('')
  const [isTemanSeva, setIsTemanSeva] = useState(false)
  const { patchSideMenu } = useSideMenuContext()
  const enableNewLogin = useEnableNewLogin()

  const beliMobilData = data.filter(
    (item) =>
      removeWhitespacesAndToLowerCase(item.menuName) ===
      removeWhitespacesAndToLowerCase('Beli Mobil'),
  )[0]
  const artikelData = data.filter(
    (item) =>
      removeWhitespacesAndToLowerCase(item.menuName) ===
      removeWhitespacesAndToLowerCase('Artikel'),
  )[0]
  const fasilitasDanaData = data.filter(
    (item) =>
      removeWhitespacesAndToLowerCase(item.menuName) ===
      removeWhitespacesAndToLowerCase('Fasilitas Dana'),
  )[0]
  const layananSuratData = data.filter(
    (item) =>
      removeWhitespacesAndToLowerCase(item.menuName) ===
      removeWhitespacesAndToLowerCase('Layanan Surat Kendaraan'),
  )[0]
  const tentangSevaData = data.filter(
    (item) =>
      removeWhitespacesAndToLowerCase(item.menuName) ===
      removeWhitespacesAndToLowerCase('Tentang Seva'),
  )[0]
  const temanSevaData = data.filter(
    (item) =>
      removeWhitespacesAndToLowerCase(item.menuName) ===
      removeWhitespacesAndToLowerCase('Teman Seva'),
  )[0]
  const lainnyaData = data.filter(
    (item) =>
      removeWhitespacesAndToLowerCase(item.menuName) ===
      removeWhitespacesAndToLowerCase('Lainnya'),
  )[0]
  const onClickRegisterHeader = () => {
    savePageBeforeLogin(window.location.pathname)
    trackLoginOrRegisterClick({
      Page_Origination_URL: window.location.href.replace('https://www.', ''),
    })
    router.push(LoginSevaUrl)
  }
  const onClickTemanSeva = () => {
    trackBurgerMenuClickTemanSeva()
    patchSideMenu({ isOpenLevel1: false })
    if (isTemanSeva) {
      router.push(TemanSevaDashboardUrl)
    } else {
      router.push(TemanSevaOnboardingUrl)
    }
  }

  const onClickFasilitasDana = () => {
    trackHeaderNavigationMenuClick(
      TrackingEventName.WEB_NAVIGATION_REFINANCING_CLICK,
    )
    patchSideMenu({ isOpenLevel1: false })
    router.push(refinancingUrl)
  }

  const onClickLayananSuratKendaraan = () => {
    trackBurgerMenuClick({
      Page_Origination_URL: window.location.href,
      Menu: 'Layanan Surat Kendaraan',
    })
    patchSideMenu({ isOpenLevel1: false })
    router.push(layananSuratData.menuUrl)
  }

  useEffect(() => {
    const checkDataCustomer = async () => {
      const data: string | null = getLocalStorage(LocalStorageKey.sevaCust)
      if (data === null) {
        const result = await fetchCustomerDetails()
        const customerData = result[0]
        setIconNameCustomer(customerData.fullName)
        setFullName(customerData.fullName)
        checkTemanSevaUser(customerData.phoneNumber)
        saveLocalStorage(
          LocalStorageKey.CustomerName,
          encryptValue(customerData.fullName),
        )
      } else {
        const decryptedData = JSON.parse(decryptValue(data))
        setIconNameCustomer(decryptedData.fullName)
        setFullName(decryptedData.fullName)
        checkTemanSevaUser(decryptedData.phoneNumber)
        saveLocalStorage(
          LocalStorageKey.CustomerName,
          encryptValue(decryptedData.fullName),
        )
      }
    }

    if (getToken()) {
      checkDataCustomer()
    }
  }, [])

  const checkTemanSevaUser = async (customerPhone: string) => {
    const [temanSeva, referralCode] = await Promise.all([
      axios.post(temanSevaUrlPath.isTemanSeva, {
        phoneNumber: customerPhone,
      }),
      axios.get(temanSevaUrlPath.profile, {
        headers: { phoneNumber: customerPhone },
      }),
    ])
    setIsTemanSeva(temanSeva.data.isTemanSeva)
    saveLocalStorage(
      LocalStorageKey.referralCode,
      referralCode.data.temanSevaRefCode,
    )
  }
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

  // const LogOut = () => {
  //   removeInformationWhenLogout()
  //   window.location.reload()
  // }

  const dataPromo: NavbarItemResponse = {
    id: 99,
    menuName: 'Promo',
    menuDesc: 'Promo',
    menuCode: 'promo',
    menuParent: 'null',
    menuUrl: urls.promoCumaDiSeva,
    menuLevel: 1,
    status: true,
    toggleNew: false,
    subMenu: [],
  }

  return (
    <>
      {isShow && (
        <>
          {enableNewLogin && getToken() && (
            <WrapperProfile
              onClick={() => {
                patchSideMenu({ isOpenLevel1: false })
                trackProfileAccountClick({
                  Page_Origination_URL: window.location.href.replace(
                    'https://www.',
                    '',
                  ),
                })
                router.push('/akun/profil')
              }}
            >
              <ProfileWrapper>
                <IconWrapperName>
                  <IconName>{nameIcon}</IconName>
                </IconWrapperName>
                <ProfileWrapperDetail>
                  <ProfileGreetingHai>{'Selamat datang,'}</ProfileGreetingHai>
                  <ProfileInfoFullName>{fullName}</ProfileInfoFullName>
                </ProfileWrapperDetail>
              </ProfileWrapper>
              <ThreeDots />
            </WrapperProfile>
          )}
          {enableNewLogin && !getToken() && (
            <WrapperProfile>
              <LoginButton onClick={onClickRegisterHeader} />
            </WrapperProfile>
          )}
          {beliMobilData.status && (
            <StyledWrapper
              data-testid={elementId.HamburgerMenu.SidebarMobileWeb.BuyCar}
              onClick={() => {
                trackHeaderNavigationMenuClick(
                  TrackingEventName.WEB_NAVIGATION_BELIMOBIL_CLICK,
                )
                patchSideMenuList({
                  isMenuLevel1: false,
                  isMenuBeliMobil: true,
                })
              }}
            >
              <ItemWrapper>
                <StyledText>{beliMobilData.menuName}</StyledText>
                <Forward />
              </ItemWrapper>
            </StyledWrapper>
          )}

          {fasilitasDanaData && fasilitasDanaData.status && (
            <StyledWrapper
              data-testid={elementId.HamburgerMenu.SidebarMobileWeb.Refinancing}
              onClick={onClickFasilitasDana}
            >
              <ItemWrapper>
                <TextWrapper newMenu={fasilitasDanaData.toggleNew}>
                  Fasilitas Dana
                </TextWrapper>
                <Forward />
              </ItemWrapper>
            </StyledWrapper>
          )}

          {layananSuratData && layananSuratData.status && (
            <StyledWrapper
              data-testid={elementId.HamburgerMenu.SidebarMobileWeb.EDoc}
              onClick={onClickLayananSuratKendaraan}
            >
              <ItemWrapper>
                <TextWrapper newMenu={fasilitasDanaData.toggleNew}>
                  Layanan
                  <br />
                  Surat Kendaraan
                </TextWrapper>
                <Forward />
              </ItemWrapper>
            </StyledWrapper>
          )}

          {temanSevaData.status && (
            <StyledWrapper
              data-testid={elementId.HamburgerMenu.SidebarMobileWeb.TemanSeva}
              onClick={onClickTemanSeva}
            >
              <ItemWrapper>
                <TextWrapper newMenu={temanSevaData.toggleNew}>
                  Teman SEVA
                </TextWrapper>
                <Forward />
              </ItemWrapper>
            </StyledWrapper>
          )}

          {dataPromo.status && (
            <StyledWrapper
              data-testid={elementId.HamburgerMenu.SidebarMobileWeb.Promo}
              onClick={() => {
                trackHeaderNavigationMenuClick(
                  TrackingEventName.WEB_NAVIGATION_PROMO_CLICK,
                )
                window.location.href = dataPromo.menuUrl
              }}
            >
              <ItemWrapper>
                <TextWrapper newMenu={dataPromo.toggleNew}>
                  {dataPromo.menuName}
                </TextWrapper>
                <Forward />
              </ItemWrapper>
            </StyledWrapper>
          )}

          {artikelData.status && (
            <StyledWrapper
              data-testid={elementId.HamburgerMenu.SidebarMobileWeb.Article}
              onClick={() => {
                trackHeaderNavigationMenuClick(
                  TrackingEventName.WEB_NAVIGATION_ARTICLE_CLICK,
                )
                patchSideMenuList({
                  isMenuLevel1: false,
                  isMenuArtikel: true,
                })
              }}
            >
              <ItemWrapper>
                <TextWrapper newMenu={artikelData.toggleNew}>
                  {artikelData.menuName}
                </TextWrapper>
                <Forward />
              </ItemWrapper>
            </StyledWrapper>
          )}

          {tentangSevaData.status && (
            <StyledWrapper
              data-testid={elementId.HamburgerMenu.SidebarMobileWeb.AboutSeva}
              onClick={() => {
                trackHeaderNavigationMenuClick(
                  TrackingEventName.WEB_NAVIGATION_TENTANG_SEVA_CLICK,
                )
                window.open('https://' + tentangSevaData.menuUrl)
              }}
            >
              <ItemWrapper>
                <TextWrapper newMenu={tentangSevaData.toggleNew}>
                  {tentangSevaData.menuName}
                </TextWrapper>
                <Forward />
              </ItemWrapper>
            </StyledWrapper>
          )}

          {lainnyaData.status && (
            <StyledWrapper
              data-testid={elementId.HamburgerMenu.SidebarMobileWeb.Other}
              onClick={() => {
                trackHeaderNavigationMenuClick(
                  TrackingEventName.WEB_NAVIGATION_LAINNYA_CLICK,
                )
                patchSideMenuList({
                  isMenuLevel1: false,
                  isMenuLainnya: true,
                })
              }}
            >
              <ItemWrapper>
                <TextWrapper newMenu={lainnyaData.toggleNew}>
                  {lainnyaData.menuName}
                </TextWrapper>
                <Forward />
              </ItemWrapper>
            </StyledWrapper>
          )}
        </>
      )}
    </>
  )
}

// const WrapperRowLogout = styled.div`
//   width: auto;
//   padding: 0 5px;
//   height: 47px;
//   margin-bottom: 5px;
//   :hover {
//     background: #def1fa;
//     border-radius: 8px;
//   }
// `

// const StyledLogo = styled.div`
//   width: 28px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

// const LogoutText = styled(TextLegalMedium)`
//   margin-left: 18px;
//   font-family: 'Kanyon';
//   font-style: normal;
//   font-weight: 400;
//   font-size: 16px;
//   line-height: 16px;
//   color: #52627a;
// `

// const LogoutButton = styled.div`
//   width: auto;
//   height: 100%;
//   border: none;
//   display: flex;
//   align-items: center;
//   cursor: pointer;
// `

type LoginButtonProps = {
  onClick: () => void
}

const LoginButton = ({ onClick }: LoginButtonProps) => (
  <StyledLoginButton
    data-testid={elementId.HamburgerMenu.SidebarMobileWeb.ButtonLoginRegister}
    buttonType={ButtonType.primary1}
    onClick={onClick}
  >
    <img src={ProfileIcon} alt="profile-icon" />
    Masuk / Daftar
  </StyledLoginButton>
)

const StyledLoginButton = styled(Button)`
  border-radius: 8px;
  height: 41px;
  width: 100%;
  justify-content: center;
  gap: 12px;

  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0px;
`

type TextWrapperProps = {
  newMenu?: boolean
  children: any
}

export const TextWrapper = ({ newMenu, children }: TextWrapperProps) => (
  <StyledTextWrapper>
    <StyledText newMenu={newMenu}>{children}</StyledText>
    {newMenu && <IconBaru />}
  </StyledTextWrapper>
)

const IconBaru = () => <IconBaruWrapper>BARU!</IconBaruWrapper>

const StyledTextWrapper = styled.div`
  display: flex;
  gap: 13px;
  align-items: center;
  flex: 1;
  justify-content: space-between;
`

const IconBaruWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #246ed4;
  border-radius: 8px;
  height: 18px;
  width: 45px;

  font-family: 'KanyonBold';
  font-size: 10px;
  line-height: 14px;
  color: ${colors.white};
`
