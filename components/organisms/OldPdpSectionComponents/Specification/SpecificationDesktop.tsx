import React from 'react'
import styled from 'styled-components'
import { VariantColor } from '../VariantColor/VariantColor'
import { ProductSpecification } from './Spesification'

type VariantSpecificationsType = {
  bodyType?: string
  fuelType: string
  transmission: string
  engineCapacity?: string
  carSeats: number
  length?: string
  BrandAndModel?: string
  onClickDetail?: () => void
}

export const SpecificationDesktop = (props: VariantSpecificationsType) => {
  return (
    <Container>
      <Content>
        <ProductSpecification
          fuelType={props.fuelType}
          carSeats={props.carSeats}
          transmission={props.transmission}
          BrandAndModel={props.BrandAndModel}
          contentPadding={'0'}
          onClickDetail={props.onClickDetail}
        />
        <VariantColor />
      </Content>
    </Container>
  )
}

const Container = styled.div`
  background: #eef6fb;
`

const Content = styled.div`
  width: 1040px;
  margin: 0 auto;
  padding: 33px 0 35px;
  display: flex;
  align-items: center;
`
