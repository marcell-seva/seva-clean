import React from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { WebShimmer } from './WebShimmer'
import { colors } from 'styles/colors'

export const VariantListPageShimmer = () => {
  // const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  // return <Container>{isMobile ? <MobileShimmer /> : <WebShimmer />}</Container>
  return (
    <div>
      <h1>SHIMMER</h1>
    </div>
  )
}

const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background-color: ${colors.offWhite};
  @media (max-width: 1024px) {
    margin: 0;
    max-width: 480px;
  }
`
