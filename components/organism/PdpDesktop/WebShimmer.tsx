import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
const ShimmerLoader = '/assets/illustration/placeholder.gif'

export const WebShimmer = () => {
  return (
    <Container>
      <GreyBox>
        <RowBetween>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <ShimmerBox width={250} height={22} />
            <ShimmerBox width={421} height={37} />
            <ShimmerBox width={250} height={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 22 }}>
            <ShimmerBox width={173} height={56} />
            <ShimmerBox width={173} height={56} />
          </div>
        </RowBetween>
      </GreyBox>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          padding: '0 60px',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              marginBottom: 25,
            }}
          >
            <ShimmerBox width={421} height={32} />
            <ShimmerBox width={250} height={22} />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginBottom: 25,
            }}
          >
            <ShimmerBox width={532} height={22} />
            <ShimmerBox width={532} height={22} />
            <ShimmerBox width={532} height={22} />
            <ShimmerBox width={532} height={22} />
            <ShimmerBox width={532} height={22} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: 31 }}>
            <ShimmerBox width={250} height={57} />
            <ShimmerBox width={250} height={57} />
          </div>
        </div>
        <ShimmerBox width={440} height={337} />
      </div>
    </Container>
  )
}

const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${colors.offWhite};
  position: absolute;
  z-index: 3;
`

const GreyBox = styled.div`
  height: 654px;
  width: 100%;
  background-color: rgba(158, 163, 172, 0.2);

  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  padding: 0 46px 56px 60px;

  border-radius: 0px 0px 8px 8px;

  margin-bottom: 50px;
`

const RowBetween = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
  width: 100%;
`

export const Shimmer = styled.div<{ radius?: number }>`
  background-image: url(${ShimmerLoader as any});
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 100%;
  border-radius: ${({ radius }) => radius || 10}px;
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
