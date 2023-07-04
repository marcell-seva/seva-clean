import React from 'react'
import { CityOtrOption, VideoDataType } from 'utils/types/utils'
import styles from 'styles/saas/components/organism/videoTab.module.scss'
import Youtube from 'react-youtube'
import elementId from 'helpers/elementIds'
import { trackPDPGalleryVideo } from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { LocalStorageKey } from 'utils/models/models'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'

interface Props {
  data: VideoDataType
  isShowAnnouncementBox: boolean | null
}

export const VideoTab = ({ data, isShowAnnouncementBox }: Props) => {
  const { carModelDetails } = useContextCarModelDetails()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

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
        onPlay={trackAmplitudeOnPlay}
      />
    </div>
  )
}
