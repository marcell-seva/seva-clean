import React from 'react'
import styled from 'styled-components'
import { useMediaQuery } from 'react-responsive'
import { MobileShimmer, WebShimmer } from 'components/atoms'

export const HomePageShimmer = () => {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })

  return <Container>{isMobile ? <MobileShimmer /> : <WebShimmer />}</Container>
}

const Container = styled.div`
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  height: 100vh;
  overflow: hidden;
`
