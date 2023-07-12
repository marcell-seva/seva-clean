import React from 'react'
import { useModal } from 'components/atoms/ModalOld/Modal'
import styled from 'styled-components'
import { colors } from '../../../styles/colors'
import {
  PreApprovalIntroModalConfig as config,
  PreApprovalStepConfig,
} from './PreApprovalIntroModal.config'
import { IconClose } from 'components/atoms'
import { setTrackEventMoEngage } from 'helpers/moengage'
import { getLocalStorage } from 'utils/localstorageUtils'
import { useContextContactFormData } from 'context/contactFormContext/contactFormContext'
import { ModalBody } from 'components/atoms/ModalBodyWrapper/ModalBodyWrapper'
import { Shield } from 'components/atoms/icon/Shield'
import { LocalStorageKey } from 'utils/models/models'

interface PreApprovalIntroModalProps {
  onPositiveButtonClick: () => void
  onModalHideClick?: () => void
}

export const usePreApprovalIntroModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()
  const moengageAttribute = getLocalStorage(LocalStorageKey.MoengageAttribute)
  const contactFormData = useContextContactFormData()

  const renderStepItem = (stepConfig: PreApprovalStepConfig, index: number) => (
    <StyledStepItemWrapper key={index}>
      <StyledStepIndex>{index + 1}</StyledStepIndex>
      <>
        <StyledStepIconWrapper>
          {stepConfig.icon}
          {stepConfig.checkmark}
        </StyledStepIconWrapper>
        <StyledStepText>{stepConfig.text}</StyledStepText>
      </>
    </StyledStepItemWrapper>
  )

  const PreApprovalIntroModal = ({
    onPositiveButtonClick,
    onModalHideClick,
  }: PreApprovalIntroModalProps) => (
    <RenderModal>
      <ModalBody>
        <StyledWrapper>
          <StyledClose
            onClick={() => {
              hideModal()
              onModalHideClick && onModalHideClick()
            }}
          >
            <IconClose width={24} height={24} color={colors.primary1} />
          </StyledClose>
          <StyledTitle>{config.title}</StyledTitle>
          <StyledSubtitle>{config.subtitle}</StyledSubtitle>
          <StyledProgressWrapper>
            {config.steps.map(renderStepItem)}
          </StyledProgressWrapper>
          <StyledSecureInfoWrapper>
            <Shield width={40} height={45} />
            <StyledSecureTextWrapper>
              <StyledSecureInfoTitle>
                {config.secureInfoTitle}
              </StyledSecureInfoTitle>
              <StyledSecureInfoDesc>
                {config.secureInfoDesc}
              </StyledSecureInfoDesc>
            </StyledSecureTextWrapper>
          </StyledSecureInfoWrapper>
          <StyledPositiveButtonWrapper
            onClick={() => {
              hideModal()
              onPositiveButtonClick()
              const data: any = moengageAttribute
              data.mobile_number = contactFormData.phoneNumber
              setTrackEventMoEngage(
                'Click_yuk_mulai_pop-up_start_instant_approval',
                data,
              )
            }}
          >
            {config.positiveButton}
          </StyledPositiveButtonWrapper>
        </StyledWrapper>
      </ModalBody>
    </RenderModal>
  )
  return { PreApprovalIntroModal, showModal, hideModal }
}
const StyledWrapper = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  text-align: center;

  @media (max-width: 320px) {
    padding: 8px;
  }
`
const StyledClose = styled.div`
  align-self: flex-end;
`

const StyledTitle = styled.h2`
  margin-top: 16px;
  color: ${colors.title};
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0px;

  @media (max-width: 320px) {
    margin-top: 8px;
  }
`
const StyledSubtitle = styled.h2`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;
  color: ${colors.label};
  margin-top: 8px;
  margin-bottom: 16px;
`
const StyledProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: stretch;
`

const StyledStepItemWrapper = styled.span`
  position: relative;
  width: 130px;
  height: 128px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  align-self: center;
  margin-bottom: 16px;
  background-color: ${colors.inputBg};
  border-radius: 16px;

  @media (max-width: 320px) {
    width: 116px;
    height: 110px;
  }
`
const StyledStepIndex = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  letter-spacing: 0px;
  text-align: center;
  color: ${colors.primary1};
  background-color: ${colors.primary2};
`

const StyledStepIconWrapper = styled.div`
  margin-top: 8px;
  position: relative;
`

const StyledStepText = styled.span`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0px;
  width: 75%;
  margin-bottom: 16px;
`

const StyledSecureInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 12px;
`

const StyledSecureInfoTitle = styled.span`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0px;
  color: ${colors.title};
`

const StyledSecureInfoDesc = styled.span`
  font-family: 'Poppins';
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0px;
`

const StyledSecureTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  text-align: left;
  margin-left: 20px;
  width: 78%;
  color: ${colors.label};
`

const StyledPositiveButtonWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 48px;
  margin-top: 30px;
  margin-bottom: 16px;
  background: ${colors.primary1};
  color: ${colors.white};
  border-radius: 16px;
  font-family: 'KanyonBold';
  font-size: 14px;
  line-height: 20px;
  letter-spacing: 0px;
  :hover {
    cursor: pointer;
  }

  @media (max-width: 320px) {
    margin-top: 10px;
  }
`
