import React from 'react'
import styled from 'styled-components'
const ShimmerLoader = '/v3/assets/illustration/placeholder.gif'

export const DesktopShimmerCarBrand = () => (
  <StyledContainer>
    <StyledCarCardContainer>
      <StyledCarCard>
        <ShimmerBox width={288} height={100} marginBottom={10} />
        <ShimmerBox width={288} height={15} marginBottom={30} />
        <ShimmerBox width={288} height={15} marginBottom={10} />
        <ShimmerBox width={80} height={15} marginBottom={10} />
      </StyledCarCard>
      <StyledCarCard>
        <ShimmerBox width={288} height={100} marginBottom={10} />
        <ShimmerBox width={288} height={15} marginBottom={30} />
        <ShimmerBox width={288} height={15} marginBottom={10} />
        <ShimmerBox width={80} height={15} marginBottom={10} />
      </StyledCarCard>
      <StyledCarCard>
        <ShimmerBox width={288} height={100} marginBottom={10} />
        <ShimmerBox width={288} height={15} marginBottom={30} />
        <ShimmerBox width={288} height={15} marginBottom={10} />
        <ShimmerBox width={80} height={15} marginBottom={10} />
      </StyledCarCard>
    </StyledCarCardContainer>
  </StyledContainer>
)

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: start;
  background-image: url(${ShimmerLoader as any});
  background-repeat: no-repeat;
  background-size: cover;
  height: auto;
  border-radius: 0px 0px 10px 10px;
  width: 100%;
  z-index: 3;
  overflow: hidden;
`
const StyledCarCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 10px;
  background-color: #f5f5f5;
  width: 100%;
  gap: 6px;
  padding: 16px 16px;
`
const StyledCarCard = styled.div`
  display: flex;
  flex-direction: column;
`
const Shimmer = styled.div<{ radius?: number }>`
  background-image: url(${ShimmerLoader as any});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: ${({ radius }) => radius || 10}px;
`
const ShimmerBox = styled(Shimmer)<{
  width?: number
  height: number
  marginBottom?: number
}>`
  height: ${({ height }) => height}px;
  width: ${({ width }) => width}px;
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`
