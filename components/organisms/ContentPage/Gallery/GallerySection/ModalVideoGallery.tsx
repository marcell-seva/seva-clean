import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { IconClose } from 'components/atoms'
import {
  CarVariantParam,
  trackPDPGalleryVideo,
} from 'helpers/amplitude/seva20Tracking'
import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import Youtube from 'react-youtube'
import { useModal } from 'components/atoms/ModalOld/Modal'

export const useVideoModalGallery = () => {
  const { showModal, hideModal, RenderModal } = useModal()

  interface Props {
    videoSrc: string
    trackProperties?: CarVariantParam
    onStart: () => void
  }

  const VideoModal = ({ videoSrc, onStart, trackProperties }: Props) => {
    const onClickCancel = () => {
      if (trackProperties) {
        trackPDPGalleryVideo(
          TrackingEventName.WEB_PDP_CLOSE_VIDEO_POP_UP,
          trackProperties,
        )
      }
      hideModal()
    }

    return (
      <RenderModal
        blur={'0px'}
        transparent={false}
        background={'rgba(0, 0, 0, 0.8)'}
      >
        <StyledContainer>
          <StyledContent>
            <StyledDesktopWrapper>
              <StyledTopHalfWrapper>
                <StyledCloseIcon onClick={onClickCancel}>
                  <IconClose color={colors.white} width={24} height={24} />
                </StyledCloseIcon>
                <Youtube
                  videoId={videoSrc}
                  className="iframe-video"
                  iframeClassName="iframe-video"
                  onPlay={onStart}
                  title="Embedded youtube"
                />
              </StyledTopHalfWrapper>
            </StyledDesktopWrapper>
          </StyledContent>
        </StyledContainer>
      </RenderModal>
    )
  }

  return { VideoModal, hideModal, showModal }
}

const StyledContainer = styled.div`
  width: auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  padding: 0 4px;

  @media (max-width: 1024px) {
    width: 700px;
  }
`

const StyledContent = styled.div`
  border-radius: 16px;
  text-align: center;
  padding: 50px 24px 10px;
  margin: 0 auto;
  background-size: cover;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-height: 980px;

  @media (min-width: 1025px) {
    padding: 0;
  }

  @media (max-width: 1024px) {
    height: 100vh;
    max-height: 460px;
    padding: 20px 0px 10px;
  }
`

const StyledDesktopWrapper = styled.div`
  width: 100%;
  height: 80%;
  @media (min-width: 1025px) {
    align-items: center;
    display: flex;
    justify-content: center;
  }
`

const StyledTopHalfWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  @media (min-width: 1025px) {
    flex-direction: row-reverse;
    align-items: flex-start;
  }
`

const StyledCloseIcon = styled.div`
  cursor: pointer;
  display: flex;
  border-radius: 50%;
  background: black;
  width: 31px;
  height: 31px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  margin-bottom: 8px;

  @media (min-width: 1025px) {
    background: transparent;
    margin-left: 23px;
  }
`
