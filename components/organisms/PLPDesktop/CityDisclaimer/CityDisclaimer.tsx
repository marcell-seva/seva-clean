import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { useMediaQuery } from 'react-responsive'
import { AlertBlue } from 'components/atoms/icon/AlertBlue'

export const CityDisclaimer = () => {
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' })

  return (
    <Container>
      <IconWrapper>
        <AlertBlue
          width={isDesktop ? 32 : 16}
          height={isDesktop ? 32 : 16}
          color={colors.primary1}
        />
      </IconWrapper>
      <Wording>Harga OTR Daihatsu menggunakan harga OTR Jakarta Pusat.</Wording>
    </Container>
  )
}

const Container = styled.div`
  margin: 16px 16px 16px;
  background: #eef6fb;
  border-radius: 8px;
  padding: 12px 9px;
  display: flex;
  align-items: center;
  gap: 7px;

  @media (min-width: 1025px) {
    margin: 22px 0 0;
    padding: 14px 24px;
    gap: 24px;
  }
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wording = styled.div`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 16px;
  display: flex;
  align-items: center;
  color: ${colors.label};

  @media (min-width: 1025px) {
    font-size: 14px;
  }
`
