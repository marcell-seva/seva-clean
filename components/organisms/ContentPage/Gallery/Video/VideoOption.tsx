import { IconPlay } from 'components/atoms'
import React, { ForwardedRef, forwardRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { MainVideoType } from './Video'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { VideoOptionType } from 'utils/types'

type VideoOptionProps = {
  isSelected: boolean
  videoOption: VideoOptionType
  onChooseOption: (option: MainVideoType) => void
}
export const ForwardVideoOption = (
  { isSelected, videoOption, onChooseOption }: VideoOptionProps,
  ref?: ForwardedRef<HTMLDivElement>,
) => {
  const [mainVideo, setMainVideo] = useState<MainVideoType>({
    uploadedBy: '',
    videoId: '',
    title: '',
    thumbnailVideo: '',
  })

  const getVideoReview = () => {
    // might need to change API request so that it can be fetched from server using brand and model data in URL dynamic slug
    fetch(`https://noembed.com/embed?dataType=json&url=${videoOption.videoUrl}`)
      .then((res) => res.json())
      .then((data) => {
        const dataMainVideo = {
          uploadedBy: videoOption.UploadedBy,
          videoId: videoOption.videoUrl.split(/[=&]/)[1],
          title: data.title,
          thumbnailVideo: data.thumbnail_url,
        }
        setMainVideo(dataMainVideo)
      })
  }

  const onClickOption = () => {
    onChooseOption(mainVideo)
  }

  useEffect(() => {
    getVideoReview()
  }, [])

  return (
    <VideoOptionWrapper
      onClick={onClickOption}
      isSelected={isSelected}
      ref={ref}
    >
      <PlayButtonWrapper>
        <IconPlay
          color={'#52627A'}
          width={18}
          height={19}
          alt="SEVA Play Icon"
        />
      </PlayButtonWrapper>
      <VideoImage
        src={mainVideo.thumbnailVideo}
        alt={`${mainVideo.title}`}
        effect="blur"
      />
      <TitleVideo>{mainVideo.title}</TitleVideo>
      <ChannelVideo>{'Uploaded by ' + mainVideo.uploadedBy}</ChannelVideo>
    </VideoOptionWrapper>
  )
}

export const VideoOption = forwardRef(ForwardVideoOption)

const VideoOptionWrapper = styled.div<{ isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  position: relative;
  width: 266px;
  height: 223px;
  background: ${colors.white};
  border: 1px solid ${colors.line};
  border-radius: 6px;
  box-shadow: ${({ isSelected }) =>
    isSelected ? '0px 0px 12px 2px rgb(35 109 210 / 80%)' : ''};
`

const VideoImage = styled(LazyLoadImage)`
  @media (min-width: 1025px) {
    height: 146px;
    width: 100%;
    object-fit: cover;
    border-radius: 6px 6px 0 0;
  }
`

const TitleVideo = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 19px;
  margin: 10px 24px 0 14px;
`

const ChannelVideo = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  color: ${colors.placeholder};
  margin-left: 14px;
  margin-right: 89px;
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
  right: 50%;
  top: 30%;

  @media (min-width: 1025px) {
    top: 25%;
    right: 43%;
  }
`
