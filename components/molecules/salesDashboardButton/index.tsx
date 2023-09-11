import { ArrowRightOutlined } from 'components/atoms/icon/ArrowRightOutlined'
import Link from 'next/link'
import React from 'react'
import { SalesDashboardPAUrl, SalesDashboardUrl } from 'utils/helpers/routes'
import styled from 'styled-components'
import { colors } from 'styles/colors'

const LogoGiias = '/revamp/illustration/logo-giias.webp'

interface Props {
  isEvent?: boolean
}

export const SalesDashBoardButton = ({ isEvent = false }: Props) => {
  return (
    <Container
      isEvent={isEvent}
      href={isEvent ? SalesDashboardUrl : SalesDashboardPAUrl}
    >
      <ImageWordingWrapper>
        {isEvent ? <StyledImage src={LogoGiias} /> : <></>}
        <Title isEvent={isEvent}>Buka Sales Dashboard</Title>
      </ImageWordingWrapper>
      <div>
        <ArrowRightOutlined width={24} height={24} color={colors.white} />
      </div>
    </Container>
  )
}

const Container = styled(Link)<{ isEvent: boolean }>`
  width: 100%;
  max-width: 632px;
  height: 56px;
  border-radius: 16px;
  background-color: ${({ isEvent }) =>
    isEvent ? colors.primaryDarkBlue : colors.primaryRed};
  padding: 16px ${({ isEvent }) => (isEvent ? '12px' : '24px')};
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  @media (min-width: 1025px) {
    height: 72px;
    padding: 20px 48px;
  }
`

const ImageWordingWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;

  @media (min-width: 1025px) {
    gap: 24px;
  }
`

const StyledImage = styled.img`
  height: 18px;

  @media (min-width: 1025px) {
    height: 32px;
  }
`

const Title = styled.p<{ isEvent: boolean }>`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: ${({ isEvent }) => (isEvent ? '14px' : '16px')};
  line-height: ${({ isEvent }) => (isEvent ? '18px' : '24px')};
  display: flex;
  letter-spacing: 0px;
  color: ${colors.white};

  @media (min-width: 1025px) {
    font-size: 24px;
    line-height: 24px;
  }
`
