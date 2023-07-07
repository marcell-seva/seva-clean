import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { colors } from 'styles/colors'
import urls from 'helpers/urls'
import { getLocalStorage } from 'utils/localstorageUtils'
import { TrackingEventWebFooterNavigation } from 'helpers/amplitude/eventTypes'
import { trackFooterNavigationMenuClick } from 'helpers/amplitude/seva20Tracking'
// import { EventTrackingFooterName } from 'helpers/amplitude/trackNavigationMenu/trackNavigationMenu'
import elementId from 'helpers/elementIds'
import Link from 'next/link'
import { UTMTagsData } from 'utils/types/utils'
import { LocalStorageKey } from 'utils/enum'
import {
  TextSmallRegular,
  TextSmallRegularStyle,
} from 'utils/typography/TextSmallRegular'
import { client } from 'const/const'
import { t } from 'config/localization/locales/id'

const width = client ? window.innerWidth : 1440

export const FooterSeva = () => {
  const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)

  const getLink = (message: string, url: string) => {
    const onClick = () => {
      //   const eventName = EventTrackingFooterName(
      //     url,
      //   ) as TrackingEventWebFooterNavigation
      //   trackFooterNavigationMenuClick(eventName)
    }
    return (
      <StyledLink>
        <Link href={url} target={'_self'} onClick={onClick}>
          <StyledProgressText>{message}</StyledProgressText>
        </Link>
      </StyledLink>
    )
  }
  return (
    <WrapperFooter>
      <StyledFooter>
        {/* <LogoSeva height={48} width={94.55} /> */}
        <Wrapper>
          {/* <StyledImage src={LogoSeva} alt="seva-footer-icon" /> */}
          <FooterWording data-testId={elementId.Footer.DescriptionLink}>
            SEVA - Platform yang berada di bawah Astra Financial yang
            menyediakan layanan pembiayaan mobil baru dengan didukung oleh
            perusahaan pembiayaan dan dealer resmi dari Astra Group
          </FooterWording>
        </Wrapper>
        <StyleComponentFooter>
          {getLink(t.funnelBackground.link.aboutUs, urls.about)}
          {getLink(
            t.funnelBackground.link.termsAndConditions,
            urls.termsAndConditionsSeva,
          )}
          {getLink(
            t.funnelBackground.link.privacyPolicy,
            urls.privacyPolicySeva,
          )}
          {getLink(t.funnelBackground.link.contactUs, urls.contactUs)}
        </StyleComponentFooter>
      </StyledFooter>
      {UTMTags?.utm_source && <UTMText>Source: {UTMTags?.utm_source}</UTMText>}
    </WrapperFooter>
  )
}

const offset = 25
const WrapperFooter = styled.div`
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  background: ${colors.line};
`

const UTMText = styled.span`
  color: ${colors.label};
  line-height: 1.7;
  font-size: 10px;
  padding-left: 70px;

  @media (max-width: 1920px) {
    padding-left: 70px;
  }
  @media (max-width: 1440px) {
    padding-left: 70px;
  }
  @media (max-width: 1366px) {
    padding-left: 70px;
  }
  @media (max-width: 1280px) {
    padding-left: 70px;
  }
  @media (max-width: 1024px) {
    padding-left: 17px;
    height: 100%;
    flex-direction: column;
  }
`
const StyledFooter = styled.footer`
  display: flex;
  flex-direction: row;
  // width: ${width}px;
  width: 100%;
  background: ${colors.line};
  height: auto;
  text-align: center;
  align-items: center;
  padding: 10px 70px;
  max-width: 1440px;
  margin: auto;
  justify-content: space-between;
  @media (max-width: 1920px) {
    padding: 20px 70px 20px;
  }
  @media (max-width: 1440px) {
    padding: 10px 70px;
  }
  @media (max-width: 1366px) {
    padding: 10px 70px;
  }
  @media (max-width: 1280px) {
    padding: 10px 70px;
  }
  @media (max-width: 1024px) {
    padding: 20px 17px;
    height: 100%;
    flex-direction: column;
  }
  position: relative;
  bottom: 0;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const FooterWording = styled(TextSmallRegular)`
  width: 80%;
  font-size: 12px;
  text-align: left;
  line-height: 1.7;
  padding-top: 10px;
  padding-bottom: 10px;

  @media (max-width: 1024px) {
    width: 100%;
    padding-bottom: 0;
  }
`

const StyleComponentFooter = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${offset}px;
  justify-content: space-between;
  width: 60%;

  @media (max-width: 1024px) {
    width: 100%;
    margin-top: 40px;
    flex-direction: column;
  }
`
const StyledLink = styled.div`
  margin-bottom: 16px;
  text-align: center;
  width: 200px;

  @media (max-width: 1024px) {
    text-align: left;
  }
`

const StyledProgressText = styled.span`
  ${TextSmallRegularStyle};
  margin-left: 16px;
  color: ${colors.label};
  font-weight: 600;

  @media (max-width: 1024px) {
    margin: 0;
  }
`
