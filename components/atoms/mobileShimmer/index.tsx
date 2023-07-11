import React from 'react'
import styled from 'styled-components'
import { Shimmer } from '../shimmerOld'

const ShimmerLoader = '/v3/assets/illustration/placeholder.gif'

export const MobileShimmer = () => (
  <StyledContainer>
    <StyledSurveyBox>
      <ShimmerBox width={232} height={20} marginBottom={12} />
      <ShimmerBox height={40} marginBottom={12} />
      <ShimmerBox height={32} marginBottom={10} />
      <ShimmerBox height={32} marginBottom={10} />
      <ShimmerBox height={32} marginBottom={10} />
      <ShimmerBox height={48} marginBottom={10} />
    </StyledSurveyBox>
  </StyledContainer>
)

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  background-image: url(${ShimmerLoader});
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  height: 100vh;
  border-radius: 0px 0px 10px 10px;
  width: 100%;
  z-index: 3;
  overflow: hidden;
`

const StyledSurveyBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background-color: #f5f5f5;
  width: 91%;
  padding: 12px 8px 16px 11px;
`

export const ShimmerBox = styled(Shimmer)<{
  width?: number
  height: number
  marginBottom?: number
}>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`
