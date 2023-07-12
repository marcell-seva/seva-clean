import { Shimmer } from 'components/atoms/shimmerOld'
import React from 'react'
import styled from 'styled-components'

export const ArticlesItemV2Placeholder = () => {
  return (
    <Container>
      <ShimmerBox width={'86px'} height={'86px'} />
      <Content>
        <ShimmerBox width={'54px'} height={'20px'} />
        <ShimmerBox width={'220px'} height={'40px'} />
        <ShimmerBox width={'88px'} height={'16px'} />
      </Content>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  align-datas: center;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 16px;
`

const ShimmerBox = styled(Shimmer)<{
  width: string
  height: string
  marginBottom?: number
}>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  margin-bottom: ${({ marginBottom }) => marginBottom}px;
`
