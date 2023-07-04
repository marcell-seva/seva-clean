/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import DOMPurify from 'dompurify'
import CustomRight from 'assets/images/announcementBox/custom-desktop-right.webp'
import CustomLeft from 'assets/images/announcementBox/custom-desktop-left.webp'
import CustomMobile from 'assets/images/announcementBox/custom-mobile-right.webp'
import ChristmasLeft from 'assets/images/announcementBox/christmas-desktop-left.webp'
import ChristmasRight from 'assets/images/announcementBox/christmas-desktop-right.webp'
import ChristmasMobileRight from 'assets/images/announcementBox/christmas-mobile-right.webp'
import ChristmasMobileLeft from 'assets/images/announcementBox/christmas-mobile-left.webp'
import NewYearLeft from 'assets/images/announcementBox/newyear-desktop-left.webp'
import NewYearRight from 'assets/images/announcementBox/newyear-desktop-right.webp'
import NewYearMobileRight from 'assets/images/announcementBox/newyear-mobile-right.webp'
import NewYearMobileLeft from 'assets/images/announcementBox/newyear-mobile-left.webp'
import CNYDesktopLeft from 'assets/images/announcementBox/cny-desktop-left.svg'
import CNYDesktopRight from 'assets/images/announcementBox/cny-desktop-right.svg'
import CNYMobileRight from 'assets/images/announcementBox/cny-mobile-right.svg'
import CNYMobileLeft from 'assets/images/announcementBox/cny-mobile-left.svg'
import RamadhanDesktopLeft from 'assets/images/announcementBox/ramadhan-desktop-left.svg'
import RamadhanDesktopRight from 'assets/images/announcementBox/ramadhan-desktop-right.svg'
import RamadhanMobileRight from 'assets/images/announcementBox/ramadhan-mobile-right.svg'
import RamadhanMobileLeft from 'assets/images/announcementBox/ramadhan-mobile-left.svg'
import IdulFitriDesktopLeft from 'assets/images/announcementBox/idulfitri2023-desktop-left.svg'
import IdulFitriDesktopRight from 'assets/images/announcementBox/idulfitri2023-desktop-right.svg'
import IdulFitriMobileRight from 'assets/images/announcementBox/idulfitri2023-mobile-right.svg'
import IdulFitriMobileLeft from 'assets/images/announcementBox/idulfitri2023-mobile-left.svg'
import { Shimmer } from './Shimmer'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { SessionStorageKey, ZIndex } from 'utils/types/models'
import { AnnouncementBoxDataType } from 'utils/types/props'
import Image from 'next/image'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { colors } from 'utils/helpers/style/colors'
import { Close } from './Close'
import { getToken } from 'utils/handler/auth'
import endpoints from 'utils/helpers/endpoints'
import { api } from 'services/api'

declare global {
  interface Window {
    dataLayer: any
  }
}

type WebAnnouncementBoxProps = {
  onCloseAnnouncementBox?: (value: boolean) => void
}
export const WebAnnouncementBox = ({
  onCloseAnnouncementBox,
}: WebAnnouncementBoxProps) => {
  const [isOpen, setIsOpen] = useState<boolean | null>(
    getSessionStorage(
      getToken() === null
        ? SessionStorageKey.ShowWebAnnouncementLogin
        : SessionStorageKey.ShowWebAnnouncementNonLogin,
    ) ?? true,
  )

  const [announcement, setAnnouncement] = useState<AnnouncementBoxDataType>()
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    api
      .getAnnouncementBox()
      .then((res: any) => {
        setAnnouncement(res.data.data)
        setIsLoading(false)
      })
      .catch(() => {
        setIsError(true)
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    if (getToken() !== null) {
      if (
        getSessionStorage(SessionStorageKey.ShowWebAnnouncementLogin) === null
      ) {
        saveSessionStorage(SessionStorageKey.ShowWebAnnouncementLogin, 'true')
        setIsOpen(true)
      }
      setIsOpen(getSessionStorage(SessionStorageKey.ShowWebAnnouncementLogin))
    } else {
      if (
        getSessionStorage(SessionStorageKey.ShowWebAnnouncementNonLogin) ===
        null
      ) {
        saveSessionStorage(
          SessionStorageKey.ShowWebAnnouncementNonLogin,
          'true',
        )
        setIsOpen(true)
      }
      setIsOpen(
        getSessionStorage(SessionStorageKey.ShowWebAnnouncementNonLogin),
      )
    }
  }, [
    getSessionStorage(SessionStorageKey.ShowWebAnnouncementNonLogin),
    getSessionStorage(SessionStorageKey.ShowWebAnnouncementLogin),
    getToken(),
  ])

  useEffect(() => {
    if (isOpen && announcement) {
      window.dataLayer.push({
        event: 'view_promotion',
        creative_name: announcement.title,
        creative_slot: null,
        promotion_id: null,
        promotion_name: 'announcement_box',
        eventCategory: 'Announcement Box',
        eventAction: 'Promotion View',
        eventLabel: announcement.title,
      })
    }
  }, [isOpen, announcement])

  const handleClose = () => {
    window.dataLayer.push({
      event: 'close_promotion',
      creative_name: announcement ? announcement.title : '',
      creative_slot: null,
      promotion_id: null,
      promotion_name: 'announcement_box',
      eventCategory: 'Announcement Box',
      eventAction: 'Promotion Close',
      eventLabel: announcement ? announcement.title : '',
    })

    if (getToken() !== null) {
      saveSessionStorage(SessionStorageKey.ShowWebAnnouncementLogin, 'false')
    } else {
      saveSessionStorage(SessionStorageKey.ShowWebAnnouncementNonLogin, 'false')
    }
    sendAmplitudeData(AmplitudeEventName.WEB_ANNOUNCEMENT_BOX_CLICK_CLOSE, {
      title: announcement ? announcement.title : '',
      Page_Origination_URL: window.location.href.replace('https://www.', ''),
    })
    setIsOpen(false)
    onCloseAnnouncementBox && onCloseAnnouncementBox(false)
  }

  if (isError) return <></>
  if (isLoading) return <SkeletonLoading />

  return (
    <>
      {isOpen && announcement ? (
        <Wrapper
          bgColor={announcement.backgroundColor}
          bannerDesign={announcement.bannerDesign}
        >
          <Content>
            {announcement.bannerDesign === 'Customize Design without Preset' &&
            announcement.data.icon ? (
              <ImageWrapper>
                <Image
                  src={announcement.data.icon}
                  width={19}
                  height={19}
                  alt="seva-announcement-icon"
                />
              </ImageWrapper>
            ) : (
              <></>
            )}
            <TextWrapper
              isUrl={announcement.url ? announcement.url.length > 0 : false}
              onClick={(e: any) => {
                e.preventDefault()
                window.dataLayer.push({
                  event: 'select_promotion',
                  creative_name: announcement.title,
                  creative_slot: null,
                  promotion_id: null,
                  promotion_name: 'announcement_box',
                  eventCategory: 'Announcement Box',
                  eventAction: 'Promotion Click',
                  eventLabel: announcement.title,
                })
                sendAmplitudeData(
                  AmplitudeEventName.WEB_ANNOUNCEMENT_BOX_CLICK_CTA,
                  {
                    title: announcement.title,
                    Page_Origination_URL: window.location.href.replace(
                      'https://www.',
                      '',
                    ),
                    Page_Direction_URL: announcement.url
                      ? announcement.url.replace('https://www.', '')
                      : '',
                  },
                )
                announcement.url &&
                  window.open(
                    !/^(http:|https:)/i.test(announcement.url)
                      ? 'http://' + announcement.url
                      : announcement.url,
                    '_blank',
                  )
              }}
            >
              <StyledText
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(announcement.description),
                }}
              />
              {announcement.textDisplay ? (
                <StyledCTA
                  isUrl={announcement.url ? announcement.url.length > 0 : false}
                >
                  {announcement.textDisplay}
                </StyledCTA>
              ) : (
                <></>
              )}
            </TextWrapper>
          </Content>
          <WrapperClose title="Close" onClick={() => handleClose()}>
            <Close color={colors.white} width={17} height={17} />
          </WrapperClose>
        </Wrapper>
      ) : (
        <></>
      )}
    </>
  )
}

const bgChristmas = css`
    linear-gradient(74.94deg, #c82120 0.54%, #f23a5c 83.1%);
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: 8.3% 50%, 92.63% 0%, center;
  @media (max-width: 1024px) {
      linear-gradient(74.94deg, #c82120 0.54%, #f23a5c 83.1%);
    background-repeat: no-repeat, no-repeat, no-repeat;
    background-position: 0% 100%, 95% 8px, center;
    padding-left: 78px;
    padding-right: 58px;
  }
  padding-left: 268px;
  padding-right: 268px;
`

const bgCustom = (bgColor: string) => css`
  background-color: ${bgColor};
  background-repeat: no-repeat, no-repeat;
  background-position: right, left;
  @media (max-width: 1024px) {
    background-repeat: no-repeat;
    background-position: right;
    justify-content: start;
    padding-left: 15px;
    padding-right: 58px;
  }
  padding-left: 135px;
  padding-right: 165px;
`

const bgNewYear = css`
    linear-gradient(74.94deg, #002d95 0.54%, #2797ff 83.1%);
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: 0% 100%, 96.25% 100%, center;
  @media (max-width: 1024px) {
      linear-gradient(74.94deg, #002d95 0.54%, #2797ff 83.1%);
    background-repeat: no-repeat, no-repeat, no-repeat;
    background-position: 0% 50%, 100% 100%, center;
    padding-left: 66px;
    padding-right: 43px;
  }
  padding-left: 260px;
  padding-right: 240px;
`
const bgCNY2023 = css`
  background-image: url(${CNYDesktopLeft}), url(${CNYDesktopRight}),
    radial-gradient(113.82% 1061.3% at 69.2% -139.84%, #fd3230 0%, #c82120 100%);
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: 0% 100%, 97.57% 100%, center;
  @media (max-width: 1024px) {
    background-image: url(${CNYMobileLeft}), url(${CNYMobileRight}),
      radial-gradient(
        177.93% 1046.33% at 82.92% -169.53%,
        #fd3230 0%,
        #c82120 100%
      );
    background-repeat: no-repeat, no-repeat, no-repeat;
    background-position: 0% 0%, 100% 100%, center;
    padding-left: 64px;
    padding-right: 52px;
  }
  padding-left: 325px;
  padding-right: 347px;
`

const bgRamadhan2023 = css`
  background-image: url(${RamadhanDesktopLeft}), url(${RamadhanDesktopRight}),
    radial-gradient(113.82% 1061.3% at 69.2% -139.84%, #17a17d 0%, #0b7663 100%);
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: 43px 100%, 97% 100%, center;
  @media (max-width: 1024px) {
    background-image: url(${RamadhanMobileLeft}), url(${RamadhanMobileRight}),
      radial-gradient(
        177.93% 1046.33% at 82.92% -169.53%,
        #17a27d 0%,
        #0b7663 100%
      );
    background-repeat: no-repeat, no-repeat, no-repeat;
    background-position: 7px 0%, 92.5% 100%, center;
    padding-left: 69px;
    padding-right: calc(7.5% + 47px);
  }
  padding-left: 316px;
  padding-right: 316px;
`

const bgIdulFitri2023 = css`
  --desktop-width-img: 306.5px;
  --mobile-width-img-left: 63px;
  --mobile-width-img-right: 69px;

  background-image: url(${IdulFitriDesktopLeft}), url(${IdulFitriDesktopRight}),
    radial-gradient(113.82% 1061.3% at 69.2% -139.84%, #17a15f 0%, #0b7643 100%);
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: 0px 100%, 100% 100%, center;
  @media (max-width: 1024px) {
    background-image: url(${IdulFitriMobileLeft}), url(${IdulFitriMobileRight}),
      radial-gradient(
        177.93% 1046.33% at 82.92% -169.53%,
        #17a15f 0%,
        #0b7643 100%
      );
    background-repeat: no-repeat, no-repeat, no-repeat;
    background-position: 0px 0%, 100% 100%, center;
    padding-left: var(--mobile-width-img-left);
    padding-right: var(--mobile-width-img-right);
  }
  padding-left: calc(8px + var(--desktop-width-img));
  padding-right: calc(8px + var(--desktop-width-img));
`

const Wrapper = styled.div<{
  bgColor: string
  bannerDesign: string
}>`
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${ZIndex.PageHeader};
  ${({ bannerDesign, bgColor }) => {
    switch (bannerDesign) {
      case 'Preset Christmas':
        return bgChristmas
      case 'Preset New Year':
        return bgNewYear
      case 'Preset Chinese New Year':
        return bgCNY2023
      case 'Preset Ramadhan 2023':
        return bgRamadhan2023
      case 'Preset Idul Fitri 2023':
        return bgIdulFitri2023
      default:
        return bgCustom(bgColor)
    }
  }}
`

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  @media (max-width: 1024px) {
    justify-content: start;
    gap: 16px;
  }
`

const StyledText = styled.div`
  p {
    margin: 0;
    color: white;
    font-family: 'OpenSansSemiBold';
    font-weight: 600;
    font-size: 13px;
    line-height: 17.7px;
    @media (max-width: 1024px) {
      display: inline;
      font-size: 10px;
      line-height: 13.6px;
    }
    em {
      font-style: italic;
    }
    strong {
      font-weight: 800;
      font-family: 'OpenSansExtraBold';
    }
  }
  @media (max-width: 1024px) {
    display: inline;
  }
`

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 35px;
  height: 35px;
  padding: 8px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.1);
`

const WrapperClose = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 24px;
  @media (max-width: 1024px) {
    right: 0;
    position: absolute;
    margin-right: 8px;
  }
`
const StyledCTA = styled.div<{ isUrl?: boolean }>`
  color: white;
  font-family: 'OpenSansBold';
  font-weight: 700;
  font-size: 14px;
  line-height: 20px;
  text-decoration-line: ${({ isUrl }) => (isUrl ? 'underline' : 'none')};
  @media (max-width: 1024px) {
    font-size: 10px;
  }
`

const TextWrapper = styled.div<{ isUrl?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  cursor: ${({ isUrl }) => (isUrl ? 'pointer' : 'default')};
  @media (max-width: 1024px) {
    display: inline;
  }
`

const SkeletonLoading = styled(Shimmer)`
  width: 100%;
  height: 64px;
  border-radius: 0;
`
