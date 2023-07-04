import React, { useRef } from 'react'
import Tridi from 'react-tridi'
import 'react-tridi/dist/index.css'
import styled from 'styled-components'
import { RotateLeft, RotateRight } from 'components/atoms'
import { ImageUnavailable } from '../ImageUnavailable'
import { exteriorImagesListNew } from 'config/Exterior360ImageList.config'

export const ExteriorViewer = () => {
  const tridiRef = useRef<any>(null)

  const getImage = () => {
    const currentUrlPathname = window.location.pathname
    const temp = exteriorImagesListNew.filter((item) =>
      currentUrlPathname.includes(item.url),
    )
    if (temp.length === 0) return []
    return temp[0].source
  }

  if (!getImage() || getImage().length === 0)
    return <ImageUnavailable type={'eksterior 360'} />

  return (
    <Wrapper>
      <Tridi ref={tridiRef} images={getImage()} count="18" inverse />
      <ButtonWrapper>
        <div onClick={() => tridiRef.current?.next()}>
          <RotateRight width={65} height={30} />
        </div>
        <div onClick={() => tridiRef.current?.prev()}>
          <RotateLeft width={65} height={30} />
        </div>
      </ButtonWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin: 0 auto;
  width: 70%;

  @media (max-width: 1024px) {
    width: 100%;
  }
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 30px;
  cursor: pointer;
`
