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
import { CarRecommendation } from 'utils/types'
import { LanguageCode } from 'utils/enum'
import { getCityWithoutDefault } from 'utils/hooks/useCurrentCityOtr/useCurrentCityOtr'

interface Props {
  carModel: CarRecommendation
}

export const RVCCarInfo = ({ carModel }: Props) => {
  const { funnelQuery } = useFunnelQueryData()
  const currentCity = getCityWithoutDefault()

  const getCarPrice = () => {
    return formatPriceNumberThousandDivisor(
      carModel.lowestAssetPrice,
      LanguageCode.id,
    )
  }

  const renderCityInfoLabel = () => {
    if (
      carModel.brand.toLowerCase() === 'daihatsu' ||
      carModel.brand.toLowerCase() === 'bmw'
    ) {
      return '(OTR Jakarta Pusat)'
    } else {
      return `(OTR ${currentCity?.cityName ?? 'Jakarta Pusat'})`
    }
  }

  return (
    <Container>
      <CarName>
        {carModel.brand} {carModel.model}
      </CarName>
      <StartsFrom>Harga mulai dari</StartsFrom>
      <OtrLabel>
        OTR<CarPrice>Rp {getCarPrice()}</CarPrice>
        <CityInfo>{renderCityInfoLabel()}</CityInfo>
      </OtrLabel>
      <LoanInfo>
        <LoanLabel>
          Cicilan
          <LoanValue>
            Rp
            {getMinimumMonthlyInstallment(
              carModel.variants,
              LanguageCode.en,
              million,
              hundred,
            )}{' '}
            jt
            <span style={{ fontFamily: 'KanyonMedium', fontWeight: 500 }}>
              /bln
            </span>
          </LoanValue>
        </LoanLabel>
        <LoanLabel>
          DP
          <LoanValue>
            Rp{getMinimumDp(carModel.variants, LanguageCode.en, million, ten)}{' '}
            jt
          </LoanValue>
        </LoanLabel>
        <LoanLabel>
          Tenor
          <LoanValue>{funnelQuery.tenure || 5} tahun</LoanValue>
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

  @media (min-width: 1025px) {
    padding: 16px 20px 23px;
  }
`

const CarName = styled.span`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 16px;
  color: ${colors.body2};

  @media (min-width: 1025px) {
    font-size: 20px;
    line-height: 20px;
    height: 40px;
  }
`

const StartsFrom = styled.span`
  margin-top: 10px;
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 10px;
  line-height: 10px;
  color: ${colors.placeholder};

  @media (min-width: 1025px) {
    margin-top: 5px;
    font-size: 12px;
    line-height: 16px;
  }
`

const InfoLabel = css`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 10px;
  color: ${colors.body2};

  @media (min-width: 1025px) {
    font-size: 14px;
    line-height: 18px;
  }
`

const OtrLabel = styled.span`
  ${InfoLabel}
  margin-top: 8px;

  @media (min-width: 1025px) {
    margin-top: 4px;
    line-height: 0;
  }
`

const CarPrice = styled.span`
  margin-left: 5px;
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 10px;
  color: ${colors.body2};

  @media (min-width: 1025px) {
    font-size: 16px;
    line-height: 16px;
  }
`

const CityInfo = styled.span`
  margin-left: 7px;
  font-family: 'OpenSans';
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

  @media (min-width: 1025px) {
    gap: 30px;
    margin-top: 6px;
  }
`

const LoanLabel = styled.span`
  ${InfoLabel}

  display: flex;
  flex-direction: column;
  gap: 1px;

  @media (max-width: 480px) {
    flex-direction: row;
  }
`

const LoanValue = styled.span`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 10px;
  color: #4d4d4d;

  @media (min-width: 1025px) {
    font-size: 14px;
    line-height: 18px;
  }
`
