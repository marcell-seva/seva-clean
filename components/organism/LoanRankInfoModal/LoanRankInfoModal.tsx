import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import { useModalContext } from 'context/modalContext/modalContext'
import { useMediaQuery } from 'react-responsive'
import { useModal } from 'components/atoms/ModalOld/Modal'
import { IconClose } from 'components/atoms'

const BackgroundDesktop = '/v3/assets/illustration/background-desktop.webp'

export enum LoanRankInfoAmplitudeType {
  ClickCta = 'clickCta',
  OnClose = 'onClose',
}

interface Props {
  trackAmplitude?: (value: LoanRankInfoAmplitudeType) => void
}

export const useLoanRankInfoModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()

  const LoanRankInfoModal = ({ trackAmplitude }: Props) => {
    const isMobile = useMediaQuery({ query: '(max-width: 480px)' })
    const { patchModal } = useModalContext()

    const openFilter = () => {
      trackAmplitude && trackAmplitude(LoanRankInfoAmplitudeType.ClickCta)
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

    const closeModalHandler = () => {
      trackAmplitude && trackAmplitude(LoanRankInfoAmplitudeType.OnClose)
      hideModal()
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
            >
              <CloseIconWrapper onClick={closeModalHandler}>
                <IconClose color={colors.white} width={24} height={24} />
              </CloseIconWrapper>
              <Title>
                Mau Tahu Soal{' '}
                <span style={{ fontFamily: 'OpenSansBold', fontWeight: 700 }}>
                  Peluang Kredit?
                </span>
              </Title>
              <Subtitle>
                Peluang Kredit adalah fitur SEVA untuk mengetahui mudah atau
                sulit pengajuan kredit mobil baru impianmu dengan melengkapi
                besar pendapatan dan data usia saat ini.
              </Subtitle>
              <StyledButton onClick={openFilter}>
                <ButtonText>Lengkapi Sekarang</ButtonText>
              </StyledButton>
            </Content>
          </StyledWrapper>
        </RenderModal>
      </>
    )
  }

  return { LoanRankInfoModal, hideModal, showModal }
}

const StyledWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  padding: 0 37px;
`

const Content = styled.div`
  margin: 0 auto;
  width: auto;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;

  background-image: url(${BackgroundDesktop});
  padding: 58px 55px 84px;
  max-width: 543px;
`

const CloseIconWrapper = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
`

const Title = styled.span`
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 18px;
  color: ${colors.white};

  @media (min-width: 1025px) {
    font-size: 20px;
    line-height: 18px;
  }
`

const Subtitle = styled.span`
  margin-top: 36px;
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 16px;
  color: ${colors.white};

  @media (min-width: 1025px) {
    font-size: 16px;
    line-height: 24px;
  }
`

const StyledButton = styled.button`
  margin-top: 46px;
  height: 34px;
  border-radius: 4px;
  padding: 10px;
  background: none;
  border: 1px solid ${colors.white};
  display: flex;
  align-items: center;
  cursor: pointer;

  @media (min-width: 1025px) {
    margin-top: 32px;
    padding: 16px;
  }
`

const ButtonText = styled.span`
  font-family: 'OpenSansSemiBold';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 14px;
  color: ${colors.white};

  @media (min-width: 1025px) {
    font-size: 16px;
    line-height: 14px;
  }
`
