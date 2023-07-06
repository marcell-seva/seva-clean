import React from 'react'
import { Pannellum } from '@georgedrpg/pannellum-react-next'
import '@georgedrpg/pannellum-react-next/es/css/video-js.css'
import '@georgedrpg/pannellum-react-next/es/css/pannellum.css'
import '@georgedrpg/pannellum-react-next/es/css/style-textInfo.css'
import styled from 'styled-components'
import { Icon360 } from 'components/atoms'
import { ImageUnavailable } from '../ImageUnavailable'
import { interiorImagesListNew } from 'config/Interior360ImageList.config'

export const InteriorViewer = () => {
  const getImage = () => {
    const currentUrlPathname = window.location.pathname
    const temp = interiorImagesListNew.filter((item) =>
      currentUrlPathname.includes(item.url),
    )
    if (temp.length === 0) return ''
    return temp[0].source
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
