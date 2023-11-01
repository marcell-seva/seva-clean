/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import DOMPurify from 'dompurify'
import { Shimmer } from './Shimmer'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { ZIndex } from 'utils/types/models'
import Image from 'next/image'
import { sendAmplitudeData } from 'services/amplitude'
import { AmplitudeEventName } from 'services/amplitude/types'
import { colors } from 'utils/helpers/style/colors'
import { Close } from './Close'
import { getToken } from 'utils/handler/auth'
import { AnnouncementBoxDataType } from 'utils/types/utils'
import { SessionStorageKey } from 'utils/enum'
import { useUtils } from 'services/context/utilsContext'
import {
  trackEventCountly,
  valueMenuTabCategory,
} from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { useAfterInteractive } from 'utils/hooks/useAfterInteractive'
import { useAnnouncementBoxContext } from 'services/context/announcementBoxContext'
import { useRouter } from 'next/router'

const CustomMobile = '/revamp/images/announcementBox/custom-mobile-right.webp'
const ChristmasMobileRight =
  '/revamp/images/announcementBox/christmas-mobile-right.webp'
const ChristmasMobileLeft =
  '/revamp/images/announcementBox/christmas-mobile-left.webp'
const NewYearMobileRight =
  '/revamp/images/announcementBox/newyear-mobile-right.webp'
const NewYearMobileLeft =
  '/revamp/images/announcementBox/newyear-mobile-left.webp'
const CNYMobileRight = '/revamp/images/announcementBox/cny-mobile-right.svg'
const CNYMobileLeft = '/revamp/images/announcementBox/cny-mobile-left.svg'
const RamadhanMobileRight =
  '/revamp/images/announcementBox/ramadhan-mobile-right.svg'
const RamadhanMobileLeft =
  '/revamp/images/announcementBox/ramadhan-mobile-left.svg'
const IdulFitriMobileRight =
  '/revamp/images/announcementBox/idulfitri2023-mobile-right.svg'
const IdulFitriMobileLeft =
  '/revamp/images/announcementBox/idulfitri2023-mobile-left.svg'
declare global {
  interface Window {
    dataLayer: any
  }
}

type WebAnnouncementBoxProps = {
  onCloseAnnouncementBox?: (value: boolean) => void
  pageOrigination?: string
}
export const WebAnnouncementBox = ({
  onCloseAnnouncementBox,
  pageOrigination,
}: WebAnnouncementBoxProps) => {
  const router = useRouter()
  const { showAnnouncementBox, saveShowAnnouncementBox } =
    useAnnouncementBoxContext()
  const { dataAnnouncementBox } = useUtils()

  const [announcement, setAnnouncement] = useState<
    AnnouncementBoxDataType | undefined
  >(dataAnnouncementBox)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (dataAnnouncementBox !== undefined) {
      setIsError(false)
      setAnnouncement(dataAnnouncementBox)
    } else {
      setIsError(true)
    }
  }, [dataAnnouncementBox])

  useEffect(() => {
    if (getToken() !== null) {
      if (
        getSessionStorage(SessionStorageKey.ShowWebAnnouncementLogin) === null
      ) {
        saveSessionStorage(SessionStorageKey.ShowWebAnnouncementLogin, 'true')
      }
    } else {
      if (
        getSessionStorage(SessionStorageKey.ShowWebAnnouncementNonLogin) ===
        null
      ) {
        saveSessionStorage(
          SessionStorageKey.ShowWebAnnouncementNonLogin,
          'true',
        )
      }
    }
  }, [
    getSessionStorage(SessionStorageKey.ShowWebAnnouncementNonLogin),
    getSessionStorage(SessionStorageKey.ShowWebAnnouncementLogin),
    getToken(),
  ])

  useAfterInteractive(() => {
    if (announcement) {
      setTimeout(() => {
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
        trackEventCountly(CountlyEventNames.WEB_ANNOUNCEMENT_VIEW, {
          ANNOUNCEMENT_TITLE: announcement.title,
          PAGE_ORIGINATION: pageOrigination?.includes('PDP')
            ? 'PDP - ' + valueMenuTabCategory()
            : pageOrigination,
        })
      }, 1000)
    }
  }, [announcement])

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
    trackEventCountly(CountlyEventNames.WEB_ANNOUNCEMENT_CLOSE_CLICK, {
      ANNOUNCEMENT_TITLE: announcement?.title,
    })
    saveShowAnnouncementBox(false)
    onCloseAnnouncementBox && onCloseAnnouncementBox(false)
  }

  if (isError) return <></>

  return (
    <>
      {showAnnouncementBox && announcement ? (
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
                trackEventCountly(CountlyEventNames.WEB_ANNOUNCEMENT_CLICK, {
                  ANNOUNCEMENT_TITLE: announcement.title,
                  PAGE_ORIGINATION: pageOrigination?.includes('PDP')
                    ? 'PDP - ' + valueMenuTabCategory()
                    : pageOrigination,
                  PAGE_DIRECTION_URL: announcement.url,
                })
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
  background-image: url(${ChristmasMobileLeft as any}),
    url(${ChristmasMobileRight as any}),
    linear-gradient(74.94deg, #c82120 0.54%, #f23a5c 83.1%);
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: 0% 100%, 95% 8px, center;
  padding-left: 78px;
  padding-right: 58px;
`

const bgCustom = (bgColor: string) => css`
  background-color: red;
  background-image: url(${CustomMobile as any});
  background-repeat: no-repeat;
  background-position: right;
  justify-content: start;
  padding-left: 15px;
  padding-right: 58px;
`

const bgNewYear = css`
  background-image: url(${NewYearMobileLeft as any}),
    url(${NewYearMobileRight as any}),
    linear-gradient(74.94deg, #002d95 0.54%, #2797ff 83.1%);
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-position: 0% 50%, 100% 100%, center;
  padding-left: 66px;
  padding-right: 43px;
`
const bgCNY2023 = css`
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
`

const bgRamadhan2023 = css`
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
`

const bgIdulFitri2023 = css`
  --desktop-width-img: 306.5px;
  --mobile-width-img-left: 63px;
  --mobile-width-img-right: 69px;

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
`

const Wrapper = styled.div<{
  bgColor: string
  bannerDesign: string
}>`
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  width: 100%;
  max-width: 570px;
  margin-left: auto;
  margin-right: auto;
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
    font-family: var(--open-sans-semi-bold);
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
      font-family: var(--open-sans-extra-bold);
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
  font-family: var(--open-sans-bold);
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
