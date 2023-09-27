import React from 'react'
import { CityOtrOption, VideoDataType } from 'utils/types/utils'
import styles from 'styles/components/organisms/videoTab.module.scss'
import Youtube from 'react-youtube'
import elementId from 'helpers/elementIds'
import { trackPDPGalleryVideo } from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { LocalStorageKey } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { useCar } from 'services/context/carContext'
import { useRouter } from 'next/router'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LoanRank } from 'utils/types/models'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'

interface Props {
  data: VideoDataType
  isShowAnnouncementBox: boolean | null
}

export const VideoTab = ({ data, isShowAnnouncementBox }: Props) => {
  const { carModelDetails } = useCar()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const router = useRouter()
  const loanRankcr = router.query.loanRankCVL ?? ''
  const filterStorage: any = getLocalStorage(LocalStorageKey.CarFilter)

  const isUsingFilterFinancial =
    !!filterStorage?.age &&
    !!filterStorage?.downPaymentAmount &&
    !!filterStorage?.monthlyIncome &&
    !!filterStorage?.tenure

  const trackAmplitudeOnPlay = () => {
    if (!carModelDetails) return

    const originationUrl = window.location.href.replace('https://www.', '')
    const trackProperties = {
      Car_Brand: carModelDetails?.brand,
      Car_Model: carModelDetails?.model,
      Page_Origination_URL: originationUrl,
      City: cityOtr?.cityName || 'Null',
    }
    trackPDPGalleryVideo(TrackingEventName.WEB_PDP_PLAY_VIDEO, trackProperties)
  }

  const trackCountlyOnPlay = () => {
    let creditBadge = 'Null'
    if (loanRankcr && loanRankcr.includes(LoanRank.Green)) {
      creditBadge = 'Mudah disetujui'
    } else if (loanRankcr && loanRankcr.includes(LoanRank.Red)) {
      creditBadge = 'Sulit disetujui'
    }

    trackEventCountly(CountlyEventNames.WEB_PDP_VIDEO_CLICK, {
      CAR_BRAND: carModelDetails?.brand ?? 'Null',
      CAR_MODEL: carModelDetails?.model ?? 'Null',
      PELUANG_KREDIT_BADGE: isUsingFilterFinancial ? creditBadge : 'Null',
      SOURCE_SECTION: 'Visual tab',
      VIDEO_URL: data.videoSrc,
    })
  }

  const onPlayHandler = () => {
    trackAmplitudeOnPlay()
    trackCountlyOnPlay()
  }

  return (
    <div
      className={styles.container}
      style={{ marginTop: isShowAnnouncementBox ? '34px' : '0px' }}
      data-testid={elementId.Tab + 'video-video'}
    >
      <Youtube
        videoId={data.videoId}
        className={styles.iframeYoutubeContainer}
        iframeClassName={styles.iframeYoutube}
        title={data.title}
        onPlay={onPlayHandler}
      />
    </div>
  )
}
