import React from 'react'
import { Pannellum } from 'pannellum-react'
import styled from 'styled-components'
import { interiorImagesList } from './InteriorImagesList'
import { trimLastChar } from 'utils/urlUtils'
import { Icon360 } from 'components/atoms'
import { ImageUnavailable } from '../ImageUnavailable'

export const InteriorViewer = () => {
  const getImage = () => {
    return interiorImagesList[trimLastChar(window.location.pathname)]
  }

  const renderNonStatic = () => {
    if (getImage()?.includes('tso')) {
      return (
        <Wrapper>
          <Pannellum
            width="100%"
            height="100%"
            image={getImage()}
            pitch={-20}
            yaw={0}
            hfov={110}
            autoLoad
          ></Pannellum>
          <IconWrapper>
            <Icon360 />
          </IconWrapper>
        </Wrapper>
      )
    } else {
      return <StyledIframe src={getImage()} />
    }
  }

  if (!getImage()) return <ImageUnavailable type={'interior 360'} />

  return (
    <>
      {getImage()?.includes('StaticImage') ? (
        <StyledImg src={getImage()}></StyledImg>
      ) : (
        renderNonStatic()
      )}
    </>
  )
}

const StyledImg = styled.img`
  width: 100%;
`

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 552px;

  @media (max-width: 1024px) {
    height: 70vw;
  }
`

const IconWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`

const StyledIframe = styled.iframe`
  width: 100%;
  height: 552px;

  @media (max-width: 1024px) {
    height: 70vw;
  }
`
