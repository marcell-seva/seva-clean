import React, {
  createRef,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { IconPlay } from 'components/atoms'
import { useMediaQuery } from 'react-responsive'
import { useVideoModalGallery } from '../GallerySection/ModalVideoGallery'
import { Container } from '../GallerySection/GalleryImageOptionsListV2'
import { LazyLoadComponent } from 'react-lazy-load-image-component'
import { VideoOption } from './VideoOption'
import { trackPDPGalleryVideo } from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import {
  CarModelDetailsResponse,
  CityOtrOption,
  VideoOptionType,
  VideoReviewType,
} from 'utils/types'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { api } from 'services/api'

type VideoProps = {
  modelDetail: CarModelDetailsResponse
}

export type MainVideoType = {
  uploadedBy: string
  videoId: string
  title: string
  thumbnailVideo: string
}
export type MainVideoResponseType = {
  id: number
  modelId: string
  link: string
  thumbnail: string
  isMain: boolean
  title: string
  accountName: string
  createdAt: string
  updatedAt: string
  listVideo: VideoOptionType[]
}

export const Video = ({ modelDetail }: VideoProps) => {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const [videoReview, setVideoReview] = useState<VideoReviewType>()
  const [mainVideo, setMainVideo] = useState<MainVideoType>({
    uploadedBy: '',
    videoId: '',
    title: '',
    thumbnailVideo: '',
  })
  const { showModal: showVideoModal, VideoModal } = useVideoModalGallery()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const containerRef = useRef() as MutableRefObject<HTMLDivElement>
  const refs =
    videoReview &&
    videoReview.listVideo &&
    videoReview?.listVideo.reduce<any>((acc, value) => {
      acc[value.videoUrl] = createRef()
      return acc
    }, {})

  const scrollToOption = (index: number, item: string) => {
    const lastIndex = videoReview ? videoReview.listVideo.length - 1 : 0
    refs[item].current.scrollIntoView({
      behavior: 'smooth',
      block: isMobile
        ? 'nearest'
        : index === 0 || index === lastIndex
        ? 'nearest'
        : 'center',
      inline: isMobile ? 'center' : 'nearest',
    })

    if (index === 0)
      containerRef.current.scrollTo({ top: -50, behavior: 'smooth' })
    if (index === lastIndex)
      containerRef.current.scrollTo({ top: 2000, behavior: 'smooth' })
  }

  const getVideoReview = async () => {
    // TODO @toni : use data from server side
    const dataVideoReview: any = await api.getCarVideoReview()
    const filterVideoReview = dataVideoReview.data.data.filter(
      (video: MainVideoResponseType) => video.modelId === modelDetail.id,
    )[0]

    if (filterVideoReview) {
      const linkVideo = filterVideoReview.link.split(/[=&]/)[1]
      const idThumbnailVideo = filterVideoReview.thumbnail.substring(
        filterVideoReview.thumbnail.indexOf('d/') + 2,
        filterVideoReview.thumbnail.lastIndexOf('/view'),
      )
      const thumbnailVideo =
        'https://drive.google.com/uc?export=view&id=' + idThumbnailVideo
      const dataMainVideo = {
        uploadedBy: filterVideoReview.accountName,
        videoId: linkVideo,
        title: filterVideoReview.title,
        thumbnailVideo: thumbnailVideo,
      }
      setVideoReview(filterVideoReview)
      setMainVideo(dataMainVideo)
    }
  }

  const trackProperties = {
    Car_Brand: modelDetail.brand,
    Car_Model: modelDetail.model,
    OTR: `Rp${replacePriceSeparatorByLocalization(
      modelDetail.variants[0].priceValue,
      LanguageCode.id,
    )}`,
    City: cityOtr?.cityName || 'Null',
  }

  const onShowVideo = () => {
    showVideoModal()
    trackPDPGalleryVideo(
      TrackingEventName.WEB_PDP_OPEN_VIDEO_POP_UP,
      trackProperties,
    )
  }

  const onTrackVideo = () => {
    trackPDPGalleryVideo(TrackingEventName.WEB_PDP_PLAY_VIDEO, trackProperties)
  }

  useEffect(() => {
    getVideoReview()
  }, [])

  if (mainVideo.title.length === 0 && mainVideo.thumbnailVideo.length === 0)
    return <></>

  return (
    <ContainerVideoReview>
      <StyledText>
        Video {modelDetail.brand + ' ' + modelDetail.model}
      </StyledText>
      <DesktopWrapper>
        <ContentMainVideo>
          <PlayButtonWrapper onClick={onShowVideo}>
            <IconPlay
              color={'#52627A'}
              width={!isMobile ? 26.76 : 19}
              height={!isMobile ? 32.25 : 19}
            />
          </PlayButtonWrapper>
          <MainVideoImage
            src={mainVideo.thumbnailVideo}
            onClick={onShowVideo}
            alt={`${modelDetail.brand} ${modelDetail.model} video review`}
            loading="lazy"
          />
          <StyledTextTitleVideo>{mainVideo.title}</StyledTextTitleVideo>
          <StyledTextChannelVideo>
            {'Uploaded by ' + mainVideo.uploadedBy}
          </StyledTextChannelVideo>
          <VideoModal
            videoSrc={mainVideo.videoId}
            trackProperties={trackProperties}
            onStart={onTrackVideo}
          />
        </ContentMainVideo>
        {!isMobile && (
          <ContainerListVideo ref={containerRef}>
            <ListVideoWrapper>
              {videoReview &&
                videoReview.listVideo &&
                videoReview?.listVideo.map((option, index) => (
                  <LazyLoadComponent key={index}>
                    <VideoOption
                      ref={refs[option.videoUrl]}
                      isSelected={
                        mainVideo.thumbnailVideo ===
                        option.videoUrl.split(/[=&]/)[1]
                      }
                      videoOption={option}
                      onChooseOption={(selected) => {
                        scrollToOption(index, option.videoUrl)
                        setMainVideo(selected)
                      }}
                    />
                  </LazyLoadComponent>
                ))}
            </ListVideoWrapper>
          </ContainerListVideo>
        )}
      </DesktopWrapper>
    </ContainerVideoReview>
  )
}

const ContainerVideoReview = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0px 16px;
  padding-top: 31px;
  background: #f2f5f9;
  margin-top: 10px;

  @media (min-width: 1025px) {
    padding: 42px 0 46px;
    height: 602px;
    margin-top: 64px;
  }
`

const StyledText = styled.span`
  letter-spacing: 0px;
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;

  color: #031838;

  @media (min-width: 1025px) {
    width: 1040px;
    margin: 0 auto;
    font-size: 20px;
    line-height: 28px;
    margin-bottom: 14px;
  }
`

const ContentMainVideo = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  position: relative;

  @media (min-width: 1025px) {
    background: ${colors.white};
    border: 1px solid ${colors.line};
    border-radius: 6px;
    margin-top: 0;
  }
`

const MainVideoImage = styled.img`
  height: 223px;
  object-fit: cover;
  @media (min-width: 1025px) {
    width: 731px;
    height: auto;
    aspect-ratio: 16/9;
    border-radius: 6px 6px 0 0;
  }
`
const StyledTextTitleVideo = styled.span`
  letter-spacing: 0px;
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 32px;
  color: #000000;
  padding-top: 5px;

  @media (min-width: 1025px) {
    margin-left: 27px;
    line-height: 18px;
    padding-top: 15px;
  }
`

const StyledTextChannelVideo = styled.span`
  letter-spacing: 0px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 32px;
  color: #9ea3ac;
  padding-bottom: 10px;
  @media (min-width: 1025px) {
    margin-left: 27px;
    line-height: 24px;
  }
`
const PlayButtonWrapper = styled.div`
  width: 36px;
  height: 36px;
  background: #ffffff;
  display: flex;
  align-items: center;
  border-radius: 50%;
  justify-content: center;
  position: absolute;
  right: 42%;
  top: 30%;

  @media (min-width: 1025px) {
    top: 35%;
    right: 43%;
    width: 80px;
    height: 80px;
  }
`

const DesktopWrapper = styled.div`
  @media (min-width: 1025px) {
    width: 1040px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    gap: 26px;
    overflow-y: hidden;
  }
`

const ContainerListVideo = styled(Container)``

const ListVideoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 26px;
  align-items: center;
`
