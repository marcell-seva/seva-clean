import React from 'react'
import { variantListUrl } from 'utils/helpers/routes'
import styled from 'styled-components'
import { IconFuel, IconSeat, IconTransmission } from 'components/atoms'
import { useRouter } from 'next/router'

export type VariantSpecificationsType = {
  bodyType?: string
  fuelType: string
  transmission: string
  engineCapacity?: string
  carSeats: number
  length?: string
  BrandAndModel?: string
  contentPadding: string
  onClickDetail?: () => void
}

export const ProductSpecification = (props: VariantSpecificationsType) => {
  const router = useRouter()
  const { model, brand, slug } = router.query
  const tab = Array.isArray(slug) ? slug[0] : undefined

  return (
    <StyledContainer contentPadding={props.contentPadding}>
      <StyledHeader>
        <StyledTitleText>Spesifikasi {props.BrandAndModel}</StyledTitleText>
      </StyledHeader>
      <StyledBody>
        <StyledBodyInfo>
          <IconSeat color={'#52627A'} width={24} height={24} />
          <StyledTextDetailSeats>
            {props.carSeats + ' Kursi'}
          </StyledTextDetailSeats>
        </StyledBodyInfo>
        <StyledBodyInfo>
          <IconFuel color={'#52627A'} width={25} height={24} />
          <StyledTextDetailSeats>{props.fuelType}</StyledTextDetailSeats>
        </StyledBodyInfo>
        <StyledBodyInfo>
          <IconTransmission color={'#52627A'} width={25} height={24} />
          <StyledTextDetailSeats>{props.transmission}</StyledTextDetailSeats>
        </StyledBodyInfo>
      </StyledBody>
      <StyledTitleTextDetail
        onClick={() => {
          props.onClickDetail && props.onClickDetail()
          router.push(
            variantListUrl
              .replace(':brand', (brand as string) ?? '')
              .replace(':model', (model as string) ?? '')
              .replace(':tab?', 'spesifikasi'),
          )
        }}
      >
        LIHAT DETIL
      </StyledTitleTextDetail>
    </StyledContainer>
  )
}
const StyledContainer = styled.div<{
  contentPadding: string
}>`
  background: #eef6fb;
  padding: ${({ contentPadding }) => contentPadding};

  @media (min-width: 1025px) {
    width: 50%;
    flex-shrink: 0;
  }
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  justify-content: space-between;

  @media (min-width: 1025px) {
    margin-bottom: 32px;
  }
`

const StyledBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 19px;

  @media (min-width: 1025px) {
    max-width: 420px;
    margin-bottom: 33px;
  }
`
const StyledBodyInfo = styled.div`
  display: flex;
  align-items: center;
`

const StyledTitleText = styled.h2`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 24px;
  letter-spacing: 0px;
  color: #000000;

  @media (min-width: 1025px) {
    font-size: 20px;
    line-height: 28px;
  }
`
const StyledTitleTextDetail = styled.a`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 10px;
  line-height: 16px;
  text-align: right;
  letter-spacing: 0px;
  color: #246ed4;

  @media (min-width: 1025px) {
    font-size: 14px;
  }
`

const StyledTextDetailSeats = styled.h2`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
  color: #404040;
  margin-left 8px;

  @media (min-width: 1025px) {
    font-size: 16px;
    line-height: 20px;
  }
`
