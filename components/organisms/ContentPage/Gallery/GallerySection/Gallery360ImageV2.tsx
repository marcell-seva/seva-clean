import dynamic from 'next/dynamic'
import React from 'react'
import styled from 'styled-components'

const ExteriorViewer = dynamic(
  () => import('./ExteriorViewer/ExteriorViewer'),
  { ssr: false },
)
const InteriorViewer = dynamic(
  () => import('./InteriorViewer/InteriorViewer'),
  { ssr: false },
)

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
