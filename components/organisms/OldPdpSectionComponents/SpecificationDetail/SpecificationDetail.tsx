import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { CarVariantRecommendation } from 'utils/types'

type SpecificationDetailProps = {
  selected: CarVariantRecommendation | null
}

export function SpecificationDetail({ selected }: SpecificationDetailProps) {
  if (!selected) return <></>
  return (
    <SpecificationDetailWrapper>
      <SpecificationDetailItem blueBg>
        <SpecificationDetailName>Kapasitas Kursi</SpecificationDetailName>
        <SpecificationDetailValue>
          {selected?.carSeats} Kursi
        </SpecificationDetailValue>
      </SpecificationDetailItem>
      <SpecificationDetailItem>
        <SpecificationDetailName>Bahan Bakar</SpecificationDetailName>
        <SpecificationDetailValue>
          {selected?.fuelType}
        </SpecificationDetailValue>
      </SpecificationDetailItem>
      <SpecificationDetailItem blueBg>
        <SpecificationDetailName>Transmisi</SpecificationDetailName>
        <SpecificationDetailValue>
          {selected?.transmission}
        </SpecificationDetailValue>
      </SpecificationDetailItem>
    </SpecificationDetailWrapper>
  )
}

const SpecificationDetailWrapper = styled.div`
  border: 1.5px solid #e4e9f1;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  margin-top: 8px;

  @media (min-width: 1025px) {
    width: 1040px;
    margin: 27px auto 0;
  }
`

const SpecificationDetailItem = styled.div<{ blueBg?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 11px 11px 15px 15px;
  background-color: ${({ blueBg }) => (blueBg ? colors.inputBg : colors.white)};

  @media (min-width: 1025px) {
    padding: 14px 34px 12px 32px;
  }
`

const SpecificationDetailName = styled.span`
  font-family: var(--open-sans);
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
  color: ${colors.placeholder};

  @media (min-width: 1025px) {
    font-size: 14px;
    color: ${colors.label};
  }
`

const SpecificationDetailValue = styled.span`
  font-family: var(--open-sans);
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
  @media (min-width: 1025px) {
    font-size: 14px;
    color: ${colors.greyscale};
  }
`
