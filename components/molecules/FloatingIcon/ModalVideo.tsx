import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { IconClose } from 'components/atoms/icon/Close'
import { useModal } from 'components/atoms/ModalOld/Modal'

export const useVideoModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()

  interface Props {
    videoSrc: string
  }

  const VideoModal = ({ videoSrc }: Props) => {
    const onClickCancel = () => hideModal()

    return (
      <RenderModal blur={'0px'} transparent={false}>
        <StyledContainer>
          <StyledContent>
            <StyledTopHalfWrapper>
              <StyledCloseIcon onClick={onClickCancel}>
                <IconClose color={colors.black} width={24} height={24} />
              </StyledCloseIcon>
              <StyledIframe
                src={videoSrc}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
              />
            </StyledTopHalfWrapper>
          </StyledContent>
        </StyledContainer>
      </RenderModal>
    )
  }

  return { VideoModal, hideModal, showModal }
}

const StyledContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  padding: 0 16px;
`
const StyledIframe = styled.iframe`
  width: 70vw;
  height: 100%;
  @media (max-width: 768px) {
    width: 90%;
    height: 80%;
  }
`
const StyledContent = styled.div`
  border-radius: 16px;
  text-align: center;
  padding: 50px 24px 10px;
  margin: 0 auto;
  background-size: cover;
  height: 100%;
  width: 343px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  max-height: 980px;

  @media (max-width: 1440px) {
    padding: 50px 24px 10px;
    max-height: 680px;
  }
  @media (max-width: 768px) {
    height: 100vh;
    max-height: 460px;
    padding: 20px 24px 10px;
  }
`
const StyledTopHalfWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 80%;
`

const StyledCloseIcon = styled.div`
  cursor: pointer;
  display: flex;
`
