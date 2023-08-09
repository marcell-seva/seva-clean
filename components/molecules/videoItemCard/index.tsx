import React, { useState } from 'react'
import styles from 'styles/components/molecules/videoItemCard.module.scss'
import { CityOtrOption, VideoDataType } from 'utils/types/utils'
import { IconPlay } from 'components/atoms'
import { useCurrentLanguageFromContext } from 'context/currentLanguageContext/currentLanguageContext'
import { articleDateFormat } from 'utils/dateUtils'
import Youtube, { YouTubeEvent } from 'react-youtube'
import elementId from 'helpers/elementIds'
import { trackPDPGalleryVideo } from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { LocalStorageKey } from 'utils/models/models'
import { useCar } from 'services/context/carContext'

interface Props {
  data: VideoDataType
}

export const VideoItemCard = ({ data }: Props) => {
  const { currentLanguage } = useCurrentLanguageFromContext()
  const [showVideo, setShowVideo] = useState(false)
  const { carModelDetails } = useCar()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const clickThumbnailHandler = () => {
    setShowVideo(true)
  }

  const onReadyYoutubeHandler = (event: YouTubeEvent<any>) => {
    event?.target.playVideo()
  }

  const onEndYoutubeHandler = () => {
    setShowVideo(false)
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
          <img
            className={styles.thumbnail}
            src={data.thumbnailVideo}
            alt={`${data.title}`}
            width="258"
            height="194"
            loading="lazy"
          />
          <div className={styles.playIconWrapper}>
            <IconPlay width={24} height={24} color="#FFFFFF" />
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
