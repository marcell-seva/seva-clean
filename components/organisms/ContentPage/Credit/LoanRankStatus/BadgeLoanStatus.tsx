import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { IconInfo } from 'components/atoms'
import { useMediaQuery } from 'react-responsive'
import { useLoanRankInfoModal } from 'components/organisms/LoanRankInfoModal/LoanRankInfoModal'
import { useLoanRankStatusModal } from 'components/organisms/LoanRankStatusModal/LoanRankStatusModal'
import { LoanRank } from 'utils/types/models'

interface Props {
  loanRank: string
  carName: string
  loanRankNavigationHandler?: () => void
  onModelClick: MouseEventHandler<HTMLDivElement | HTMLButtonElement>
}

export const LoanRankStatus = ({ loanRank, carName, onModelClick }: Props) => {
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const { LoanRankInfoModal, showModal: showLoanRankInfoModal } =
    useLoanRankInfoModal()
  const { LoanRankStatusModal, showModal: showLoanRankStatusModal } =
    useLoanRankStatusModal()

  const getWording = () => {
    if (loanRank === LoanRank.Green) {
      return (
        <Wording>
          {!isMobile && `Peluang Kreditmu: `}
          <span
            style={{ fontFamily: 'var(--open-sans-bold)', fontWeight: 700 }}
          >
            MUDAH
          </span>
        </Wording>
      )
    } else if (loanRank === LoanRank.Red) {
      return (
        <Wording>
          Peluang Kreditmu:&nbsp;
          <span
            style={{ fontFamily: 'var(--open-sans-bold)', fontWeight: 700 }}
          >
            SULIT
          </span>
        </Wording>
      )
    } else {
      return (
        <Wording>
          Lihat&nbsp;
          <span
            style={{ fontFamily: 'var(--open-sans-bold)', fontWeight: 700 }}
          >
            Peluang Kreditmu
          </span>
        </Wording>
      )
    }
  }

  const clickHandler = () => {
    if (loanRank === LoanRank.Green) {
      showLoanRankStatusModal()
    } else if (loanRank === LoanRank.Red) {
      showLoanRankStatusModal()
    } else {
      showLoanRankInfoModal()
    }
  }

  return (
    <>
      <Container loanRank={loanRank} onClick={clickHandler}>
        {getWording()}
        <IconWrapper>
          <IconInfo color={colors.white} width={16} height={16} />
        </IconWrapper>
      </Container>
      <LoanRankInfoModal />
      <LoanRankStatusModal
        loanRank={loanRank}
        carName={carName}
        onModelClick={onModelClick}
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
  font-weight: 700;
  font-size: 10px;
  line-height: 14px;
  display: flex;
  align-items: center;
  color: ${colors.white};

  @media (min-width: 1024px) {
    font-size: 14px;
    font-weight: 600;
  }
`
