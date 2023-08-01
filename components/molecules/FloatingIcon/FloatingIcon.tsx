import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useVideoModal } from './ModalVideo'

import { useMediaQuery } from 'react-responsive'
import {
  trackFloatingIconClick,
  trackFloatingIconOnExpandClick,
} from 'helpers/amplitude/seva20Tracking'

const FloatingImage = '/revamp/images/floating/FloatingIconNew.webp'
const ExpandImage = '/revamp/images/floating/IconExpand.png'

export default function FloatingIcon() {
  const [expand, setExpand] = useState(false)
  const [rightWidth, setRightWidth] = useState('0px')
  const [rightWidthImage, setRightWidthImage] = useState('0px')
  const { showModal: showVideoModal, VideoModal } = useVideoModal()
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  const expandClick = () => {
    setExpand(!expand)
    if (expand) {
      trackFloatingIconClick({
        Page_Origination_URL: window.location.href.replace('https://www.', ''),
      })
    }
  }
  useEffect(() => {
    if (!isMobile) {
      if (expand) {
        setRightWidth('287px')
        setRightWidthImage('288px')
      } else {
        setRightWidth('0px')
      }
    } else {
      if (expand) {
        setRightWidth('187px')
        setRightWidthImage('188px')
      } else {
        setRightWidth('0px')
      }
    }
  }, [expand])
  return (
    <>
      <StyledBack right={rightWidth} onClick={() => expandClick()}>
        <StyledImg src={FloatingImage} alt="seva-how-to-use-image" />
      </StyledBack>
      {expand ? (
        <StyledContainer rightImage={rightWidthImage}>
          <StyledImgPreview
            onClick={() => {
              trackFloatingIconOnExpandClick({
                Page_Origination_URL: window.location.href.replace(
                  'https://www.',
                  '',
                ),
              })
              showVideoModal()
            }}
            src={ExpandImage}
          />
          <VideoModal videoSrc={'https://www.youtube.com/embed/6_1Ssisygyg'} />
        </StyledContainer>
      ) : null}
    </>
  )
}

const StyledContainer = styled.div<{
  rightImage: string
}>`
  background: transparent;
  width: ${({ rightImage }) => rightImage};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  top: 19.5%;
  z-index: 35;
  heigth: 200px;
  position: fixed;
  right: 0px;
`
const StyledImgPreview = styled.img`
  width: 100%;
  height: auto;
  margin-bottom: 20px;
`
const StyledImg = styled.img`
  max-width: 90px;
  margin-top: 30px;
  max-height: 140px;
  height: 140px;
  @media (max-width: 1680px) {
    max-width: 90px;
    margin-top: 30px;
    max-height: 140px;
    height: 140px;
  }
  @media (max-width: 1024px) {
    max-width: 90px;
    margin-top: 30px;
    max-height: 100px;
    height: 100px;
  }
`
const StyledBack = styled.div<{
  right: string
}>`
  cursor: pointer;
  position: fixed;
  top: 19.5%;
  right: ${({ right }) => right};
  border-radius: 8px;
  z-index: 35;
  @media (max-width: 1024px) {
    position: fixed;
    right: ${({ right }) => right};
  }
`
