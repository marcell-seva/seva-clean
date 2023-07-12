import React from 'react'
import styled from 'styled-components'
import { Shimmer } from '../shimmerOld'

const ShimmerLoader = '/v3/assets/illustration/placeholder.gif'

export const WebShimmer = () => (
  <>
    <StyledContainer></StyledContainer>
    <StyledSurveyBox>
      <FirstWrapper>
        <ShimmerBox height={20} />
        <ShimmerBox height={20} />
      </FirstWrapper>
      <SecondWrapper marginBottom={24}>
        <ShimmerBox height={40} />
        <ShimmerBox height={40} />
        <ShimmerBox height={40} />
      </SecondWrapper>
      <ShimmerBox height={56} marginBottom={38} />
      <SecondWrapper>
        <ShimmerBox height={56} width={'70%'} />
        <ShimmerBox height={56} width={'30%'} />
      </SecondWrapper>
    </StyledSurveyBox>
  </>
)

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background-image: url(${ShimmerLoader as any});
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  height: 80vh;
  border-radius: 0px 0px 10px 10px;
  width: 100%;
  z-index: 3;
  overflow: hidden;
  max-width: 1440px;
  margin: 0 auto;
`

const StyledSurveyBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: #f5f5f5;
  width: 60%;
  padding: 43px 108px 60px 108px;
  position: absolute;
  top: 450px;
  left: 20%;
  z-index: 4;
`

const ShimmerBox = styled(Shimmer)<{
  width?: string
  height: number
  marginBottom?: number
}>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width};
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`

const FirstWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 29px;
  padding: 0 14px;
`

const SecondWrapper = styled.div<{ marginBottom?: number }>`
  display: flex;
  flex-direction: row;
  gap: 16px;
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`
