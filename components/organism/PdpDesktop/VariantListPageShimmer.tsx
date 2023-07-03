import React from 'react'
import styled from 'styled-components'
import { WebShimmer } from './WebShimmer'
import { colors } from 'styles/colors'

export const VariantListPageShimmer = () => {
  return (
    <Container>
      <WebShimmer />
    </Container>
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
