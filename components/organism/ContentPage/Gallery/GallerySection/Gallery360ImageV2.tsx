import React from 'react'
import styled from 'styled-components'
import { ExteriorViewer } from './ExteriorViewer/ExteriorViewer'
import { InteriorViewer } from './InteriorViewer/InteriorViewer'

interface Props {
  isSelectedExterior: boolean
}

export const Gallery360ImageV2 = ({ isSelectedExterior }: Props) => {
  return (
    <Container>
      {isSelectedExterior ? <ExteriorViewer /> : <InteriorViewer />}
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
`
