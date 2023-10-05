import React, { useState } from 'react'
import styles from 'styles/components/molecules/videoItemCard.module.scss'
import { CityOtrOption, VideoDataType } from 'utils/types/utils'
import { IconPlay } from 'components/atoms'
import { useUtils } from 'services/context/utilsContext'
import { articleDateFormat } from 'utils/handler/date'
import Youtube, { YouTubeEvent } from 'react-youtube'
import elementId from 'helpers/elementIds'
import { trackPDPGalleryVideo } from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
import { useCar } from 'services/context/carContext'
import { useRouter } from 'next/router'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LoanRank } from 'utils/types/models'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import Image from 'next/image'

interface Props {
  data: VideoDataType
}

export const VideoItemCard = ({ data }: Props) => {
  const { currentLanguage } = useUtils()
  const [showVideo, setShowVideo] = useState(false)
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

  const clickThumbnailHandler = () => {
    setShowVideo(true)
  }

  const onReadyYoutubeHandler = (event: YouTubeEvent<any>) => {
    event?.target.playVideo()
  }

  const onEndYoutubeHandler = () => {
    setShowVideo(false)
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
      SOURCE_SECTION: 'Menu tab',
      VIDEO_URL: data.videoSrc,
    })
  }

  const onPlayYoutubeHandler = () => {
    if (!carModelDetails) return

    const originationUrl = window.location.href.replace('https://www.', '')
    const trackProperties = {
      Car_Brand: carModelDetails?.brand,
      Car_Model: carModelDetails?.model,
      City: cityOtr?.cityName || 'Null',
      Page_Origination_URL: originationUrl,
    }
    trackPDPGalleryVideo(TrackingEventName.WEB_PDP_PLAY_VIDEO, trackProperties)
    trackCountlyOnPlay()
  }

  return (
    <div
      className={styles.container}
      data-testid={elementId.PDP.RingkasanTab.VideoSection.Card}
    >
      {showVideo ? (
        <Youtube
          videoId={data.videoId}
          className={styles.iframeYoutube}
          iframeClassName={styles.iframeYoutube}
          title={data.title}
          onReady={onReadyYoutubeHandler}
          onEnd={onEndYoutubeHandler}
          onPlay={onPlayYoutubeHandler}
        />
      ) : (
        <div
          className={styles.thumbnailWrapper}
          onClick={clickThumbnailHandler}
          data-testid={elementId.PDP.RingkasanTab.VideoSection.Thumbnail}
        >
          <Image
            className={styles.thumbnail}
            src={data.thumbnailVideo}
            alt={`${data.title}`}
            width="258"
            height="194"
            loading="lazy"
          />
          <div className={styles.playIconWrapper}>
            <IconPlay
              width={24}
              height={24}
              color="#FFFFFF"
              alt="SEVA Play Icon"
            />
          </div>{' '}
        </div>
      )}

      <div
        className={styles.infoWrapper}
        data-testid={elementId.PDP.VideoUlasan}
      >
        <span className={styles.dateText}>
          {articleDateFormat(new Date(data.date), currentLanguage)}
        </span>
        <span className={styles.titleText}>{data.title}</span>
      </div>
    </div>
  )
}
