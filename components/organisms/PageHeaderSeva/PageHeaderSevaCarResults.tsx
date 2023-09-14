import React, { useEffect, useState } from 'react'
import { LoginSevaUrl, rootUrl } from 'utils/helpers/routes'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import getCurrentEnvironment from 'helpers/environments'
import { ZIndex } from 'styles/zIndex'
import { useSideMenuContext } from 'services/context/sideMenuContext'
import { getMenus } from 'services/menu'
import { savePageBeforeLogin } from 'utils/loginUtils'
import { getToken } from 'utils/handler/auth'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { encryptValue } from 'utils/encryptionUtils'
import { removeInformationWhenLogout } from 'utils/logoutUtils'
import { useMediaQuery } from 'react-responsive'
// import { SearchInput } from 'components/SearchInput/SearchInput'

import { useRouter } from 'next/router'
import { NavbarItemResponse } from 'utils/types/utils'
import { useEnableNewLogin } from 'utils/hooks/useEnableNewLogin'
import { fetchCustomerName } from 'utils/httpUtils/customerUtils'
import { LocalStorageKey } from 'utils/enum'
import { SidebarBurger } from 'components/molecules/sidebarBurger/sidebarBurger'
import { Hamburger } from 'components/atoms/icon/OldHamburger'
import { CitySelector } from 'components/molecules/citySelector/citySelector'
import { Search } from 'components/atoms/icon/OldSearch'
import { LocaleDropDown } from 'components/molecules/localeDropdown'
import { User } from 'components/atoms/icon/User'
import { Logout } from 'components/atoms/icon/Logout'
import { Forward } from 'components/atoms/icon/Forward'
import { Line } from 'components/atoms/Line'
import { CitySelectorSectionV2 } from 'components/molecules/citySelectorV2'
import { Navbar } from 'components/molecules/navbar/navbar'
import { WebAnnouncementBox } from 'components/molecules/webAnnouncementBox'
import { TextLegalMedium } from 'utils/typography/TextLegalMedium'
import { TextLegalSemiBold } from 'utils/typography/TextLegalSemiBold'
import { LinkLabelSmallMedium } from 'components/atoms/typography/LinkLabelSmallMedium'
import HeaderCarResult from 'components/molecules/header/headerCarResult'
import { client } from 'utils/helpers/const'

const LogoSeva = '/revamp/illustration/seva-header.svg'
const RegisterImg = '/revamp/illustration/Register.png'

interface PageHeaderSevaProps {
  children?: JSX.Element
}

export const PageHeaderSevaHeight = '80px'
export const PageHeaderSevaCarResults = (props: PageHeaderSevaProps) => {
  const router = useRouter()
  const enableLanguageDropdown =
    getCurrentEnvironment.featureToggles.enableLanguageDropdown
  const enableAccountDashboard =
    getCurrentEnvironment.featureToggles.enableAccountDashboard
  const { sideMenu, patchSideMenu } = useSideMenuContext()
  const [data, setData] = useState<Array<NavbarItemResponse>>()
  const [nameIcon, setNameIcon] = useState('')
  const [iconIsClicked, setIconIsClicked] = useState(false)
  const [fullName, setFullName] = useState('')
  const enableNewLogin = useEnableNewLogin()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [showSearch, setShoSearch] = useState(false)

  useEffect(() => {
    const fetchDataName = async () => {
      const customerName = await fetchCustomerName()
      if (customerName) {
        if (customerName.indexOf(' ') > 0) {
          const nameTmp = customerName.split(' ')
          const firstInitial = nameTmp.slice(0, 1).join('')
          const secondInitial = nameTmp.slice(1).join('')
          const initialName = firstInitial[0] + secondInitial[0]
          setNameIcon(initialName.toUpperCase())
        } else {
          setNameIcon(customerName?.slice(0, 2).toUpperCase())
        }
        setFullName(customerName)
        saveLocalStorage(
          LocalStorageKey.CustomerName,
          encryptValue(customerName),
        )
      }
    }
    if (getToken()) {
      fetchDataName()
    }
    getMenus().then((res) => {
      setData(res.data)
    })
  }, [])

  const onClickLogoHeader = () => {
    // make sure side menu bar to close
    // before go to homepage
    patchSideMenu({ isOpenLevel1: false })
    router.push(rootUrl)
  }

  const burgerClickHandler = () => {
    patchSideMenu({ isOpenLevel1: !sideMenu.isOpenLevel1 })
  }
  const onClickRegisterHeader = () => {
    savePageBeforeLogin(window.location.pathname)
    router.push(LoginSevaUrl)
  }
  const onClickIconProfile = () => {
    setIconIsClicked(!iconIsClicked)
  }
  const LogOut = () => {
    removeInformationWhenLogout()
    window.location.reload()
  }
  const ShowSearchComponent = () => {
    setShoSearch(!showSearch)
  }

  const goPrevousPage = () => {
    setShoSearch(!showSearch)
  }
  return (
    <>
      <Wrapper>
        {data && <SidebarBurger data={data} />}
        {!showSearch ? (
          <StyledLogoSection>
            <StyledLogoContainer>
              <BurgerAndLogoWrapper>
                {client && window.innerWidth < 1280 ? (
                  <>
                    <div onClick={() => burgerClickHandler()}>
                      <Hamburger />
                    </div>
                    <Spacing2 />
                  </>
                ) : (
                  <></>
                )}
                <LogoWrapper onClick={onClickLogoHeader}>
                  <StyledImage src={LogoSeva} alt="Logo SEVA" />
                </LogoWrapper>
              </BurgerAndLogoWrapper>
              <Spacing />
              <SearchAndRegisterWrapper>
                <>{props.children}</>
                {enableNewLogin && getToken() && (
                  <StyledProfileIcon>
                    <StyledGreeting>
                      <StyledGreetingHai>Selamat datang,</StyledGreetingHai>
                      <StyledGreetingFullName>
                        {fullName}
                      </StyledGreetingFullName>
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
                  <SearchIconWrapper onClick={ShowSearchComponent}>
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
                      <LogoutButton onClick={() => router.push('/akun/profil')}>
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
        ) : (
          <StyledContent>
            <SearchWrapper>
              <ForwardWrapper onClick={goPrevousPage}>
                <Forward />
              </ForwardWrapper>
              <HeaderCarResult
                overrideDisplay={'static'}
                suggestionListMobileWidth={'100%'}
              />
            </SearchWrapper>
          </StyledContent>
        )}

        <Line width={'100%'} height={'1px'} background={colors.line} />
        {isMobile && <CitySelectorSectionV2 />}
        <BottomSection>
          <Navbar />
          <CitySelector />
        </BottomSection>
        <WebAnnouncementBox />
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  width: 100%;
  height: auto;
  background: ${colors.white};

  z-index: ${ZIndex.PageHeader};

  @media (min-width: 1280px) {
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
  font-family: var(--open-sans);
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
  font-family: var(--kanyon);
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

const ForwardWrapper = styled.div`
  transform: rotate(180deg);
  top: 12px;
  left: 10px;
  margin-right: 17px;

  @media (max-width: 1024px) {
    top: 12px;
  }
`

const StyledContent = styled.div`
  display: none;
  @media (max-width: 1024px) {
    diplay: block;
    border-radius: 0;
    text-align: center;
    flex: 1;
    padding: 9px 19px;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background: ${colors.white};
  }
`

const SearchWrapper = styled.div`
  @media (max-width: 1024px) {
    margin: 0 auto;
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
  }
`
