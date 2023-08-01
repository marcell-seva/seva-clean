import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
const ImageNotAvailableDesktop =
  '/revamp/illustration/image-unavailable-desktop.webp'

interface Props {
  type: string
}

export const ImageUnavailable = ({ type }: Props) => {
  return (
    <Container>
      {/* <img src={isMobile ? ImageNotAvailable : ImageNotAvailableDesktop} /> */}
      <img src={ImageNotAvailableDesktop} width={217} height={168} />
      <Title>Gambar {type} untuk mobil ini belum tersedia</Title>
    </Container>
  )
}

const Container = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 61px 0 42px;

  @media (min-width: 1025px) {
    width: 100%;
    height: 552px;
    margin: 0 auto;
  }
`

const Title = styled.span`
  margin-top: 22px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  text-align: center;
  color: ${colors.label};

  @media (min-width: 1025px) {
    margin-top: 30px;
    font-size: 14px;
  }
`
