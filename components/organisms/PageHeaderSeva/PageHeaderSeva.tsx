import React, { useEffect, useState, memo } from 'react'
import { LoginSevaUrl, rootUrl } from 'utils/helpers/routes'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import getCurrentEnvironment from 'helpers/environments'
import { ZIndex } from 'styles/zIndex'
import { getMenus } from 'services/menu'
import { savePageBeforeLogin } from 'utils/loginUtils'
import { getToken } from 'utils/api'
import { fetchCustomerDetails } from 'utils/httpUtils/customerUtils'
import { getLocalStorage, saveLocalStorage } from 'utils/localstorageUtils'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import { removeInformationWhenLogout } from 'utils/logoutUtils'
import { useMediaQuery } from 'react-responsive'
import {
  trackHeaderLogoClick,
  trackLoginOrRegisterClick,
  trackLogoutClick,
  trackProfileAccountClick,
} from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import { useSideMenuContext } from 'context/sideMenuContext/sideMenuContext'
import { useSearchModal } from 'components/molecules/searchModal/searchModal'
import { NavbarItemResponse } from 'utils/types/utils'
import { useEnableNewLogin } from 'utils/hooks/useEnableNewLogin'
import { LocalStorageKey } from 'utils/models/models'
import { SidebarBurger } from 'components/molecules/sidebarBurger/sidebarBurger'
import { TextLegalSemiBold } from 'utils/typography/TextLegalSemiBold'
import { CitySelector } from 'components/molecules/citySelector/citySelector'
import { Search } from 'components/atoms/icon/OldSearch'
import { LocaleDropDown } from 'components/molecules/localeDropdown'
import { User } from 'components/atoms/icon/User'
import { Logout } from 'components/atoms/icon/Logout'
import { Line } from 'components/atoms/Line'
import { CitySelectorSectionV2 } from 'components/molecules/citySelectorV2'
import { Navbar } from 'components/molecules/navbar/navbar'
import { WebAnnouncementBox } from 'components/molecules/webAnnouncementBox'
import { LinkLabelSmallMedium } from 'components/atoms/typography/LinkLabelSmallMedium'
import { Hamburger } from 'components/atoms/icon/OldHamburger'
import { TextLegalMedium } from 'utils/typography/TextLegalMedium'
import { client } from 'utils/helpers/const'

const LogoSeva = '/revamp/illustration/seva-header.svg'
const RegisterImg = '/revamp/illustration/Register.png'

interface PageHeaderSevaProps {
  children?: JSX.Element
}

export const PageHeaderSevaHeight = '80px'
export const PageHeaderSeva = memo((props: PageHeaderSevaProps) => {
  const router = useRouter()
  const enableLanguageDropdown =
    getCurrentEnvironment.featureToggles.enableLanguageDropdown
  const enableAccountDashboard =
    getCurrentEnvironment.featureToggles.enableAccountDashboard
  const { sideMenu, patchSideMenu } = useSideMenuContext()
  const { showModal: showSearchModal, SearchModal } = useSearchModal()
  const [data, setData] = useState<Array<NavbarItemResponse>>()
  const [nameIcon, setNameIcon] = useState('')
  const [iconIsClicked, setIconIsClicked] = useState(false)
  const [fullName, setFullName] = useState('')
  const enableNewLogin = useEnableNewLogin()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  interface Customer {
    id: number
    phoneNumber: string
    fullName: string
    gender: string
    dob: string
    email: string
    createdAt: string
    updatedAt: string
    registType: any
    alreadyLogin: boolean
    marital: string
    promoSubscription: boolean
    temanSevaTrxCode: any
    customerUuid: any
    isSales: boolean
    salesBu: any
    isCrmCustomer: boolean
  }
  useEffect(() => {
    const fetchDataCustomer = async () => {
      let customerDetails: any
      const customerDataLocal: string | null = getLocalStorage(
        LocalStorageKey.sevaCust,
      )
      if (customerDataLocal === null) {
        const response = await fetchCustomerDetails()
        customerDetails = response[0]
      } else {
        customerDetails = JSON.parse(decryptValue(customerDataLocal))
      }
      assignCustomerInfo(customerDetails)
    }
    if (getToken()) {
      fetchDataCustomer()
    }
    getMenus().then((res) => {
      setData(res.data.data)
      setMenusData(res.data.data)
    })
  }, [])

  const setMoengageUser = async (payload: string) => {
    const moengage = client && window.Moengage
    if (moengage && !!moengage?.addMobile && !!moengage?.addUniqueUserId) {
      moengage?.addMobile(payload)
      moengage?.addUniqueUserId(payload)
    }
  }

  const assignCustomerInfo = (payload: Customer) => {
    setFullName(payload.fullName)
    setIconNameCustomer(payload.fullName)
    setMoengageUser(payload.phoneNumber)
    setCustomerDetail(payload)
    saveLocalStorage(
      LocalStorageKey.CustomerName,
      encryptValue(payload.fullName),
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

  const setCustomerDetail = (payload: any) => {
    const encryptedData = encryptValue(JSON.stringify(payload))
    saveLocalStorage(LocalStorageKey.sevaCust, encryptedData)
  }

  const setMenusData = (payload: any) => {
    const encryptedData = encryptValue(JSON.stringify(payload))
    saveLocalStorage(LocalStorageKey.menu, encryptedData)
  }

  const onClickLogoHeader = () => {
    // make sure side menu bar to close
    // before go to homepage
    patchSideMenu({ isOpenLevel1: false })
    trackHeaderLogoClick({
      Page_Origination_URL: window.location.href.replace('https://www.', ''),
    })
    router.push(rootUrl)
  }

  const burgerClickHandler = () => {
    patchSideMenu({ isOpenLevel1: !sideMenu.isOpenLevel1 })
  }
  const onClickRegisterHeader = () => {
    savePageBeforeLogin(window.location.pathname)
    trackLoginOrRegisterClick({
      Page_Origination_URL: window.location.href.replace('https://www.', ''),
    })
    router.push(LoginSevaUrl)
  }
  const onClickIconProfile = () => {
    setIconIsClicked(!iconIsClicked)
  }
  const LogOut = () => {
    trackLogoutClick({
      Page_Origination_URL: window.location.href.replace('https://www.', ''),
    })
    removeInformationWhenLogout()
    window.location.reload()
  }
  return (
    <>
      <Wrapper>
        {data && <SidebarBurger data={data} />}
        <StyledLogoSection>
          <StyledLogoContainer>
            <BurgerAndLogoWrapper>
              {client && window.innerWidth < 1280 ? (
                <>
                  <div onClick={burgerClickHandler}>
                    <Hamburger />
                  </div>
                  <Spacing2 />
                </>
              ) : (
                <></>
              )}
              <LogoWrapper onClick={onClickLogoHeader}>
                <StyledImage
                  data-testid={elementId.Homepage.GlobalHeader.IconLogoSeva}
                  src={LogoSeva}
                  alt="seva-header-icon"
                  width="120"
                  height="74"
                />
              </LogoWrapper>
            </BurgerAndLogoWrapper>
            <Spacing />
            <SearchAndRegisterWrapper>
              <>{props.children}</>
              {enableNewLogin && getToken() && (
                <StyledProfileIcon>
                  <StyledGreeting>
                    <StyledGreetingHai>Selamat datang,</StyledGreetingHai>
                    <StyledGreetingFullName>{fullName}</StyledGreetingFullName>
                  </StyledGreeting>
                  <IconWrapperName
                    onClick={onClickIconProfile}
                    className={'page-header-profile-button-element'}
                  >
                    <IconName>{nameIcon}</IconName>
                  </IconWrapperName>
                </StyledProfileIcon>
              )}
              {enableNewLogin && getToken() == null && (
                <Register
                  data-testid={elementId.HamburgerMenu.Login.RegisterInput}
                  onClick={onClickRegisterHeader}
                  className={'page-header-login-button-element'}
                />
              )}
            </SearchAndRegisterWrapper>
          </StyledLogoContainer>
          <DropdownSection>
            {client && window.innerWidth < 1280 && (
              <>
                {!isMobile && <CitySelector />}
                <SearchIconWrapper onClick={() => showSearchModal()}>
                  <Search color={colors.primary1} width={20} height={20} />
                </SearchIconWrapper>
              </>
            )}
            {enableLanguageDropdown && (
              <>
                <Separator />
                <LocaleDropDown />
              </>
            )}
            {iconIsClicked && (
              <WrapperInfoProfile>
                {enableAccountDashboard && (
                  <WrapperRowLogout>
                    <LogoutButton
                      onClick={() => {
                        trackProfileAccountClick({
                          Page_Origination_URL: window.location.href.replace(
                            'https://www.',
                            '',
                          ),
                        })
                        router.push('/akun/profil')
                      }}
                    >
                      <StyledLogo>
                        <User />
                      </StyledLogo>
                      <LogoutText>Akun Saya</LogoutText>
                    </LogoutButton>
                  </WrapperRowLogout>
                )}
                <WrapperRowLogout>
                  <LogoutButton onClick={LogOut}>
                    <StyledLogo>
                      <Logout />
                    </StyledLogo>
                    <LogoutText>Keluar</LogoutText>
                  </LogoutButton>
                </WrapperRowLogout>
              </WrapperInfoProfile>
            )}
          </DropdownSection>
        </StyledLogoSection>
        <Line width={'100%'} height={'1px'} background={colors.line} />
        {isMobile && <CitySelectorSectionV2 />}
        <BottomSection>
          <Navbar />
          <CitySelector />
        </BottomSection>
        {!isMobile ? <WebAnnouncementBox /> : <></>}
      </Wrapper>
      {isMobile ? <WebAnnouncementBox /> : <></>}
      <SearchModal />
    </>
  )
})

const Wrapper = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  width: 100%;
  height: auto;
  background: ${colors.white};

  z-index: ${ZIndex.PageHeader};

  @media (min-width: 1025px) {
    box-shadow: 1px 1px 10px #88888857;
  }
  @media (max-width: 1024px) {
    position: static;
    height: auto;
  }
`

const StyledProfileIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const StyledGreeting = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  margin-right: 14px;
  @media (max-width: 1024px) {
    display: none;
  }
`

const StyledGreetingHai = styled(TextLegalSemiBold)`
  line-height: 20px;
  color: #9ea3ac;
`

const StyledGreetingFullName = styled(LinkLabelSmallMedium)`
  color: #52627a;
`

const StyledLogoSection = styled.div`
  height: ${PageHeaderSevaHeight};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 70px;
  background-color: white;
  position: relative;
  max-width: 1440px;
  margin: auto;

  @media (max-width: 1024px) {
    padding: 0 16px;
    height: 64px;
  }
`

const StyledLogo = styled.div`
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledLogoContainer = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
`

const BurgerAndLogoWrapper = styled.div`
  display: flex;
  justify-content: row;
  align-items: center;
`

const Spacing2 = styled.div`
  width: 20px;
`

const LogoWrapper = styled.div`
  cursor: pointer;
`

const StyledImage = styled.img`
  width: 120px;
  height: auto;
  @media (max-width: 1024px) {
    width: 79px;
  }
`

const Spacing = styled.div`
  width: 214px;
  background-color: red;
  @media (max-width: 1280px) {
    width: 116px;
  }
  @media (max-width: 1024px) {
    display: none;
  }
`

const DropdownSection = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const SearchIconWrapper = styled.div`
  margin-left: 40px;
`

const Separator = styled.div`
  width: 1px;
  height: 23px;
  background-color: ${colors.placeholder};
`

const BottomSection = styled.div`
  max-width: 1440px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1024px) {
    display: none;
    padding: 0;
  }
`
const SearchAndRegisterWrapper = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`
const Register = styled.div`
  cursor: pointer;
  background: url(${RegisterImg}) no-repeat center;
  background-size: contain;
  width: 200px;
  max-width: 200px;
  height: 40px;
  margin-left: 128px;
  @media (max-width: 1366px) {
    margin-left: 54px;
  }
  @media (max-width: 1280px) {
    margin-left: 68px;
  }
  @media (max-width: 1024px) {
    display: none;
  }
`
const IconWrapperName = styled.div`
  background: ${colors.primary1};
  width: 40px;
  height: 40px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  @media (max-width: 1024px) {
    display: none;
  }
`

const IconName = styled(TextLegalMedium)`
  font-weight: 600;
  font-size: 14px;
  font-family: 'OpenSans';
  color: white;
`
const WrapperInfoProfile = styled.div`
  position: fixed;
  top: 82px;
  right: 80px;
  width: 261px;
  /* height: 114px; */
  background: #ffffff;
  box-shadow: 0px 1px 16px rgba(3, 24, 56, 0.2);
  border-radius: 16px;
  z-index: 999;
  padding: 11px 8px;
  @media (min-width: 1441px) {
    position: absolute;
    right: 70px;
  }
  @media (max-width: 1280px) {
    right: 70px;
  }
  @media (max-width: 1024px) {
    display: none;
  }
`

const LogoutText = styled(TextLegalMedium)`
  margin-left: 20px;
  font-family: 'Kanyon';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #52627a;
`

const WrapperRowLogout = styled.div`
  width: auto;
  height: 47px;
  /* margin-top: 8px; */
  padding: 11px 14px;
  :hover {
    background: #def1fa;
    border-radius: 8px;
  }
`
const LogoutButton = styled.div`
  width: auto;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
`
