import React, { MouseEventHandler } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { useModalContext } from 'context/modalContext/modalContext'
import { useMediaQuery } from 'react-responsive'
import elementId from 'helpers/elementIds'
import { useModal } from 'components/atoms/ModalOld/Modal'
import { LoanRank } from 'utils/enum'
import { IconClose } from 'components/atoms'

const BackgroundDesktopGreen =
  '/revamp/illustration/background-desktop-green.webp'
const BackgroundDesktopRed = '/revamp/illustration/background-desktop-red.webp'

export enum LoanRankStatusAmplitudeType {
  GreenCta = 'greenCta',
  OnCloseGreen = 'onCloseGreen',
  RedCta1 = 'redCta1',
  RedCta2 = 'redCta2',
  OnCloseRed = 'onCloseRed',
}

interface Props {
  loanRank: string
  carName: string
  loanRankNavigationHandler?: () => void
  onModelClick: MouseEventHandler<HTMLDivElement | HTMLButtonElement>
  trackAmplitude?: (value: LoanRankStatusAmplitudeType) => void
}

export const useLoanRankStatusModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()

  const LoanRankStatusModal = ({
    loanRank,
    carName,
    onModelClick,
    trackAmplitude,
  }: Props) => {
    const isMobile = useMediaQuery({ query: '(max-width: 480px)' })
    const { patchModal } = useModalContext()

    const getLoanRankLabel = () => {
      if (loanRank === LoanRank.Green) {
        return 'Hore, Peluang Kreditmu'
      } else if (loanRank === LoanRank.Red) {
        return 'Yah, Peluang Kreditmu'
      } else {
        return '-'
      }
    }

    const getLoanRankValue = () => {
      if (loanRank === LoanRank.Green) {
        return 'Mudah!'
      } else if (loanRank === LoanRank.Red) {
        return 'Sulit.'
      } else {
        return '-'
      }
    }

    const openFilter = () => {
      trackAmplitude && trackAmplitude(LoanRankStatusAmplitudeType.RedCta1)
      hideModal()
      if (isMobile) {
        patchModal({ isOpenCarFilter: true })
      } else {
        const elem = document.getElementById('filter-side-menu-income')
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }

    const getSubtitle = () => {
      if (loanRank === LoanRank.Green) {
        return 'Sekarang kamu sudah bisa melanjutkan proses Instant Approval untuk mobil ini.'
      } else if (loanRank === LoanRank.Red) {
        return 'Sesuaikan nilai DP dan tenormu atau cari mobil lain untuk mendapatkan peluang kredit yang mudah.'
      } else {
        return '-'
      }
    }
    const getLabelButton = () => {
      if (loanRank === LoanRank.Green) {
        return 'Ajukan Instant Approval'
      } else {
        return 'Tutup'
      }
    }

    const closeModalHandler = () => {
      if (loanRank === LoanRank.Green) {
        trackAmplitude &&
          trackAmplitude(LoanRankStatusAmplitudeType.OnCloseGreen)
      } else if (loanRank === LoanRank.Red) {
        trackAmplitude && trackAmplitude(LoanRankStatusAmplitudeType.OnCloseRed)
      }
      hideModal()
    }

    const clickGreenCtaHandler = (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
      if (loanRank === LoanRank.Green) {
        trackAmplitude && trackAmplitude(LoanRankStatusAmplitudeType.GreenCta)
        onModelClick(e)
      } else {
        hideModal()
      }
    }

    const getCtaType = () => {
      if (loanRank === LoanRank.Green) {
        return (
          <>
            <StyledButton1
              data-testid={elementId.InstantApproval.ButtonApplyIA}
              onClick={(e) => clickGreenCtaHandler(e)}
            >
              <ButtonText1>{getLabelButton()}</ButtonText1>
            </StyledButton1>
          </>
        )
      } else if (loanRank === LoanRank.Red) {
        return (
          <>
            <StyledButton2 onClick={openFilter}>
              <ButtonText2>Ubah DP dan Tenormu</ButtonText2>
            </StyledButton2>
          </>
        )
      } else {
        return <></>
      }
    }

    return (
      <>
        <RenderModal
          blur={'0px'}
          transparent={false}
          closeByClickOutside={true}
          clickContainerHandler={closeModalHandler}
        >
          <StyledWrapper>
            <Content
              onClick={(e) => {
                // prevent modal closed accidentally
                e.stopPropagation()
              }}
              loanRank={loanRank}
            >
              <CloseIconWrapper onClick={closeModalHandler}>
                <IconClose color={colors.white} width={24} height={24} />
              </CloseIconWrapper>
              <CarName>{carName}</CarName>
              <LoanRankLabel>{`${getLoanRankLabel()} ${getLoanRankValue()}`}</LoanRankLabel>
              <Subtitle>{getSubtitle()}</Subtitle>
              {getCtaType()}
              {loanRank === LoanRank.Red && (
                <PickOtherCar
                  onClick={() => {
                    trackAmplitude &&
                      trackAmplitude(LoanRankStatusAmplitudeType.RedCta2)
                    hideModal()
                  }}
                >
                  Pilih Mobil Lain
                </PickOtherCar>
              )}
            </Content>
          </StyledWrapper>
        </RenderModal>
      </>
    )
  }

  return { LoanRankStatusModal, hideModal, showModal }
}

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  padding: 0 37px;
`

const getBackgroundImageDesktop = (loanRank: string) => {
  if (loanRank === LoanRank.Green) {
    return `url(${BackgroundDesktopGreen})`
  } else if (loanRank === LoanRank.Red) {
    return `url(${BackgroundDesktopRed})`
  }
}

const Content = styled.div<{
  loanRank: string
}>`
  margin: 0 auto;
  width: auto;
  border-radius: 8px;
  text-align: center;
  padding: 32px 55px;
  max-width: 543px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-image: ${({ loanRank }) => getBackgroundImageDesktop(loanRank)};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
`

const CloseIconWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;

  @media (max-width: 1024px) {
    top: 8px;
    right: 8px;
  }
`

const CommonFontStyle = css`
  font-style: normal;
  font-size: 12px;
  line-height: 16px;
  color: ${colors.white};

  @media (min-width: 1025px) {
    font-size: 16px;
    line-height: 20px;
  }
`

const CarName = styled.span`
  ${CommonFontStyle}
  font-family: 'OpenSansBold';
  font-weight: 700;
`

const LoanRankStyle = css`
  font-family: 'OpenSansBold';
  font-style: normal;
  font-weight: 700;
  color: ${colors.white};
`

const LoanRankLabel = styled.span`
  margin-top: 36px;
  ${LoanRankStyle}
  font-size: 14px;
  line-height: 18px;

  @media (min-width: 1025px) {
    margin-top: 24px;
    font-size: 20px;
    line-height: 28px;
  }
`

const Subtitle = styled.span`
  margin-top: 10px;
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${colors.white};

  @media (min-width: 1025px) {
    margin-top: 16px;
    font-size: 16px;
    line-height: 24px;
  }
`

const StyledButton1 = styled.button`
  margin-top: 22px;
  height: 34px;
  border-radius: 4px;
  padding: 10px;
  background: ${colors.white};
  border: 1px solid ${colors.white};
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (min-width: 1025px) {
    margin-top: 32px;
    padding: 16px;
  }
`

const StyledButton2 = styled.button`
  margin-top: 22px;
  height: 34px;
  border-radius: 4px;
  padding: 10px;
  background: none;
  border: 1px solid ${colors.white};
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (min-width: 1025px) {
    padding: 16px;
    margin-top: 32px;
  }
`

const ButtonTextStyle = css`
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;

  @media (min-width: 1025px) {
    font-size: 16px;
    line-height: 14px;
  }
`

const ButtonText1 = styled.span`
  ${ButtonTextStyle}
  color: ${colors.black};
`

const ButtonText2 = styled.span`
  ${ButtonTextStyle}
  color: ${colors.white};
`

const PickOtherCar = styled.button`
  margin-top: 6px;
  background: none;
  border: none;
  font-family: 'OpenSansBold';
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  line-height: 14px;
  color: ${colors.white};
  cursor: pointer;

  @media (min-width: 1025px) {
    margin-top: 21px;
    font-size: 16px;
    line-height: 14px;
  }
`
