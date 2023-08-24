import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import styled from 'styled-components'
import { trimLastChar } from 'utils/urlUtils'
import { availableList, availableListColors } from './AvailableListColors'

export const VariantColor = () => {
  const [colors, setColors] = useState<any[]>([])
  const [colors2, setColors2] = useState<any[]>([])
  const mobileSmall = useMediaQuery({ query: '(max-height: 3800px)' })

  useEffect(() => {
    if (availableList.includes(trimLastChar(window.location.pathname))) {
      const colorsTmp = availableListColors.filter(
        (url) => url.url === trimLastChar(window.location.pathname),
      )[0].colors
      if (colorsTmp.length > 10) {
        if (mobileSmall) {
          setColors(colorsTmp.slice(0, 9))
          setColors2(colorsTmp.slice(9))
        } else {
          setColors(colorsTmp.slice(0, 10))
          setColors2(colorsTmp.slice(10))
        }
      } else {
        setColors(colorsTmp)
      }
    }
  }, [])

  return colors.length > 0 ? (
    <StyledContainer>
      <StyledHeader>
        <StyledTitleText>Variasi Warna</StyledTitleText>
      </StyledHeader>
      <StyledBody>
        {colors.length !== 0 &&
          colors.map((color) => {
            return typeof color !== 'string' ? (
              <StyledBodyInfo key={color}>
                <StyledColorOptions color={'none'}>
                  <StyledColorOption1 color={color[0]} />
                  <StyledColorOption2 color={color[1]} />
                </StyledColorOptions>
              </StyledBodyInfo>
            ) : (
              <StyledBodyInfo key={color}>
                <StyledColorOptions color={color} />
              </StyledBodyInfo>
            )
          })}
      </StyledBody>
      {colors.length >= 9 && (
        <StyledBody>
          {colors2.length !== 0 &&
            colors2.map((color) => {
              return typeof color !== 'string' ? (
                <StyledBodyInfo key={color}>
                  <StyledColorOptions color={'none'}>
                    <StyledColorOption1 color={color[0]} />
                    <StyledColorOption2 color={color[1]} />
                  </StyledColorOptions>
                </StyledBodyInfo>
              ) : (
                <StyledBodyInfo key={color}>
                  <StyledColorOptions color={color} />
                </StyledBodyInfo>
              )
            })}
        </StyledBody>
      )}
      <StyledTextDetailSeats>
        Note: Kami tidak menjamin ketersediaan warna pada dealer
      </StyledTextDetailSeats>
    </StyledContainer>
  ) : (
    <Space />
  )
}
const StyledContainer = styled.div`
  // padding: 26px 16px;
  margin-bottom: 31px;

  @media (min-width: 1025px) {
    width: 50%;
    margin-bottom: 0;
    margin-left: 162px;
  }
`

const Space = styled.div`
  height: 20px;
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 15px;
  justify-content: space-between;

  @media (min-width: 1025px) {
    margin-top: 0;
    margin-bottom: 28px;
  }
`

const StyledBody = styled.div`
  display: flex;
  align-items: center;
  margin-top 8px;
  margin-bottom: 8px;

  @media (min-width: 1025px) {
    margin-top: 0;
    margin-bottom: 28px;
  }
`
const StyledBodyInfo = styled.div`
  display: flex;
  align-items: center;
  margin-right: 7px;
`

const StyledTitleText = styled.h2`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0px;
  color: #000000;

  @media (min-width: 1025px) {
    font-size: 20px;
    line-height: 28px;
  }
`

const StyledTextDetailSeats = styled.h2`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 8px;
  line-height: 16px;
  letter-spacing: 0px;
  color: #404040;

  @media (min-width: 1025px) {
    font-size: 10px;
    color: #52627a;
  }
`
const StyledColorOptions = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  width: 30px;
  height: 30px;
  border-radius: 30px;
  border: 1px solid #d0d5dd;
`

const StyledColorOption1 = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  height: 50%;
  border-top-right-radius: 30px;
  border-top-left-radius: 30px;
`
const StyledColorOption2 = styled.div<{ color: string }>`
  background: ${({ color }) => color};
  height: 50%;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 30px;
`
