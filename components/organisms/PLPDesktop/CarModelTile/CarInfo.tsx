import React from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { formatPriceNumberThousandDivisor } from 'utils/numberUtils/numberUtils'
import {
  getMinimumDp,
  getMinimumMonthlyInstallment,
} from 'utils/carModelUtils/carModelUtils'
import { hundred, million, ten } from 'utils/helpers/const'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import elementId from 'helpers/elementIds'
import { LanguageCode } from 'utils/enum'
import { getCityWithoutDefault } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'
import { CarRecommendation } from 'utils/types'

interface Props {
  carModel: CarRecommendation
}

export const CarInfo = ({ carModel }: Props) => {
  const { funnelQuery } = useFunnelQueryData()
  const currentCity = getCityWithoutDefault()

  const getCarPrice = () => {
    return formatPriceNumberThousandDivisor(
      carModel.lowestAssetPrice,
      LanguageCode.id,
    )
  }

  const renderCityInfoLabel = () => {
    return `(OTR ${currentCity?.cityName ?? 'Jakarta Pusat'})`
  }

  return (
    <Container>
      <CarName
        data-testid={
          elementId.CarResultPage.CarModel +
          carModel.brand +
          ' ' +
          carModel.model
        }
      >
        {carModel.brand} {carModel.model}
      </CarName>
      <StartsFrom>Harga mulai dari</StartsFrom>
      <OtrLabel>
        OTR
        <CarPrice
          data-testid={elementId.CarResultPage.CarPrice + getCarPrice()}
        >
          Rp {getCarPrice()}
        </CarPrice>
        <CityInfo>{renderCityInfoLabel()}</CityInfo>
      </OtrLabel>
      <LoanInfo>
        <LoanLabel>
          Cicilan
          <LoanValue data-testid={elementId.CarResultPage.Installment}>
            Rp{''}
            {getMinimumMonthlyInstallment(
              carModel.variants,
              LanguageCode.en,
              million,
              hundred,
            )}{' '}
            jt
            <span
              style={{ fontFamily: 'var(--kanyon-medium)', fontWeight: 500 }}
            >
              /bln
            </span>
          </LoanValue>
        </LoanLabel>
        <LoanLabel>
          DP
          <LoanValue data-testid={elementId.CarResultPage.DP}>
            Rp{getMinimumDp(carModel.variants, LanguageCode.en, million, ten)}{' '}
            jt
          </LoanValue>
        </LoanLabel>
        <LoanLabel>
          Tenor
          <LoanValue
            data-testid={
              elementId.CarResultPage.Tenor +
              (funnelQuery.tenure || 5 + 'Tahun')
            }
          >
            {funnelQuery.tenure || 5} Tahun
          </LoanValue>
        </LoanLabel>
      </LoanInfo>
    </Container>
  )
}

const Container = styled.div`
  background-color: ${colors.white};
  width: 100%;
  padding: 20px 20px 10px;
  border-bottom: 1px solid ${colors.inputBg};
  display: flex;
  flex-direction: column;

  @media (min-width: 1024px) {
    padding: 16px 20px;
  }
`

const CarName = styled.span`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: ${colors.body2};

  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (min-width: 1024px) {
    font-size: 20px;
    line-height: 20px;
  }
`

const StartsFrom = styled.span`
  margin-top: 10px;
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 10px;
  color: ${colors.placeholder};

  @media (min-width: 1024px) {
    margin-top: 8px;
    font-size: 12px;
    line-height: 16px;
  }
`

const InfoLabel = css`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 10px;
  color: ${colors.body2};

  @media (min-width: 1024px) {
    font-size: 14px;
    line-height: 14px;
  }
`

const OtrLabel = styled.span`
  ${InfoLabel}
  margin-top: 8px;

  @media (min-width: 1024px) {
    margin-top: 4px;
  }
`

const CarPrice = styled.span`
  margin-left: 5px;
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 10px;
  color: ${colors.body2};

  @media (min-width: 1024px) {
    font-size: 16px;
    line-height: 16px;
  }
`

const CityInfo = styled.span`
  margin-left: 7px;
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 14px;
  color: ${colors.body2};
`

const LoanInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-top: 12px;

  @media (min-width: 1024px) {
    gap: 30px;
    margin-top: 7px;
  }
`

const LoanLabel = styled.span`
  ${InfoLabel}

  display: flex;
  flex-direction: column;
  gap: 5px;

  @media (max-width: 480px) {
    flex-direction: row;
  }
`

const LoanValue = styled.span`
  font-family: var(--kanyon-bold);
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 10px;
  color: #4d4d4d;

  @media (min-width: 1024px) {
    font-size: 14px;
    line-height: 18px;
  }
`
