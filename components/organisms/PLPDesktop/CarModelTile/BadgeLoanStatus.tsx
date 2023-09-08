import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import {
  trackCekPeluangBadgeClick,
  trackCekPeluangPopUpCloseClick,
  trackCekPeluangPopUpCtaClick,
  trackPeluangMudahBadgeClick,
  trackPeluangMudahPopUpCtaClick,
  trackPeluangSulitBadgeClick,
  trackPeluangMudahPopUpCloseClick,
  trackPeluangSulitPopUpCta1Click,
  trackPeluangSulitPopUpCta2Click,
  trackPeluangSulitPopUpCloseClick,
} from 'helpers/amplitude/seva20Tracking'
import { formatPriceNumberThousandDivisor } from 'utils/numberUtils/numberUtils'
import {
  getMinimumDp,
  getMinimumMonthlyInstallment,
} from 'utils/carModelUtils/carModelUtils'
import { hundred, million, ten } from 'utils/helpers/const'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { LocalStorageKey, LanguageCode } from 'utils/enum'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { CarRecommendation, CityOtrOption } from 'utils/types'
import { IconInfo } from 'components/atoms'
import {
  useLoanRankInfoModal,
  LoanRankInfoAmplitudeType,
} from 'components/organisms/LoanRankInfoModal/LoanRankInfoModal'
import {
  useLoanRankStatusModal,
  LoanRankStatusAmplitudeType,
} from 'components/organisms/LoanRankStatusModal/LoanRankStatusModal'
import { LoanRank } from 'utils/types/models'

interface Props {
  loanRank: string
  carModel: CarRecommendation
  loanRankNavigationHandler?: () => void
  onModelClick: MouseEventHandler<HTMLDivElement | HTMLButtonElement>
}

export const BadgeLoanStatus = ({
  loanRank,
  carModel,
  onModelClick,
}: Props) => {
  const { LoanRankInfoModal, showModal: showLoanRankInfoModal } =
    useLoanRankInfoModal()
  const { LoanRankStatusModal, showModal: showLoanRankStatusModal } =
    useLoanRankStatusModal()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const { funnelQuery } = useFunnelQueryData()

  const getWording = () => {
    if (loanRank === LoanRank.Green) {
      return (
        <Wording>
          Peluang Kreditmu:&nbsp;
          <span style={{ fontFamily: 'OpenSansBold', fontWeight: 700 }}>
            MUDAH
          </span>
        </Wording>
      )
    } else if (loanRank === LoanRank.Red) {
      return (
        <Wording>
          Peluang Kreditmu:&nbsp;
          <span style={{ fontFamily: 'OpenSansBold', fontWeight: 700 }}>
            SULIT
          </span>
        </Wording>
      )
    } else {
      return (
        <Wording>
          Lihat&nbsp;
          <span style={{ fontFamily: 'OpenSansBold', fontWeight: 700 }}>
            Peluang Kreditmu
          </span>
        </Wording>
      )
    }
  }

  const getDataForAmplitude = () => {
    return {
      Car_Brand: carModel.brand,
      Car_Model: carModel.model,
      City: cityOtr?.cityName || 'Jakarta Pusat',
      OTR: `Rp${formatPriceNumberThousandDivisor(
        carModel.lowestAssetPrice,
        LanguageCode.id,
      )}`,
      DP: `Rp${getMinimumDp(
        carModel.variants,
        LanguageCode.en,
        million,
        ten,
      )} Juta`,
      Cicilan: `Rp${getMinimumMonthlyInstallment(
        carModel.variants,
        LanguageCode.en,
        million,
        hundred,
      )} jt/bln`,
      Tenure: `${funnelQuery.tenure || 5}`,
    }
  }

  const clickHandler = () => {
    if (loanRank === LoanRank.Green) {
      trackPeluangMudahBadgeClick(getDataForAmplitude())
      showLoanRankStatusModal()
    } else if (loanRank === LoanRank.Red) {
      trackPeluangSulitBadgeClick(getDataForAmplitude())
      showLoanRankStatusModal()
    } else {
      trackCekPeluangBadgeClick(getDataForAmplitude())
      showLoanRankInfoModal()
    }
  }

  const loanRankInfoAmplitudeHandler = (value: LoanRankInfoAmplitudeType) => {
    if (value === LoanRankInfoAmplitudeType.ClickCta) {
      trackCekPeluangPopUpCtaClick(getDataForAmplitude())
    } else if (value === LoanRankInfoAmplitudeType.OnClose) {
      trackCekPeluangPopUpCloseClick(getDataForAmplitude())
    }
  }

  const loanRankStatusAmplitudeHandler = (
    value: LoanRankStatusAmplitudeType,
  ) => {
    if (value === LoanRankStatusAmplitudeType.GreenCta) {
      trackPeluangMudahPopUpCtaClick(getDataForAmplitude())
    } else if (value === LoanRankStatusAmplitudeType.OnCloseGreen) {
      trackPeluangMudahPopUpCloseClick(getDataForAmplitude())
    } else if (value === LoanRankStatusAmplitudeType.RedCta1) {
      trackPeluangSulitPopUpCta1Click(getDataForAmplitude())
    } else if (value === LoanRankStatusAmplitudeType.RedCta2) {
      trackPeluangSulitPopUpCta2Click(getDataForAmplitude())
    } else if (value === LoanRankStatusAmplitudeType.OnCloseRed) {
      trackPeluangSulitPopUpCloseClick(getDataForAmplitude())
    }
  }

  return (
    <>
      <Container loanRank={loanRank} onClick={clickHandler}>
        {getWording()}
        <IconWrapper>
          <IconInfo color={colors.white} width={10} height={10} />
        </IconWrapper>
      </Container>
      <LoanRankInfoModal
        trackAmplitude={(value: any) => loanRankInfoAmplitudeHandler(value)}
      />
      <LoanRankStatusModal
        loanRank={loanRank}
        carName={carModel.brand + ' ' + carModel.model}
        onModelClick={onModelClick}
        trackAmplitude={(value: any) => loanRankStatusAmplitudeHandler(value)}
      />
    </>
  )
}

const getBackgroundColor = (loanRank: string) => {
  if (loanRank === LoanRank.Green) {
    return colors.supportSuccess
  } else if (loanRank === LoanRank.Red) {
    return colors.secondary
  } else {
    return colors.primaryDarkBlue
  }
}

const Container = styled.div<{
  loanRank: string
}>`
  background-color: ${({ loanRank }) => getBackgroundColor(loanRank)};
  padding: 6px 10px 6px 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  border-radius: 4px 0px 0px 4px;

  @media (min-width: 1024px) {
    padding: 6px 10px;
    gap: 8px;
  }
`

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Wording = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
  display: flex;
  align-items: center;
  color: ${colors.white};

  @media (min-width: 1024px) {
    font-size: 14px;
  }
`
