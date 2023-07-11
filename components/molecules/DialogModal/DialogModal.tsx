import React from 'react'
import styled from 'styled-components'
import { Button, ButtonType } from 'components/atoms/ButtonOld/Button'
import { colors } from 'styles/colors'
import { IconClose } from 'components/atoms'
import { useModal } from 'components/atoms/ModalOld/Modal'

interface DialogModalProps {
  title?: string
  desc?: string
  confirmButtonText?: string
  cancelButtonText?: string
  onConfirm?: () => void
  onCancel?: () => void
  isNeedCancelButton?: boolean
  confirmButtonLoading?: boolean
  shouldCloseOnConfirm?: boolean
  modalImage?: JSX.Element
  isCloseIconShow?: boolean
}

export const useDialogModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()
  const DialogModal = ({
    title,
    desc,
    confirmButtonText = 'Oke!',
    cancelButtonText = 'Membatalkan!',
    onConfirm = hideModal,
    onCancel = hideModal,
    isNeedCancelButton,
    confirmButtonLoading,
    shouldCloseOnConfirm = true,
    modalImage,
    isCloseIconShow,
  }: DialogModalProps) => {
    const onClickOK = (e: React.MouseEvent) => {
      e.stopPropagation()
      onConfirm && onConfirm()
      shouldCloseOnConfirm && hideModal()
    }
    const onClickCancel = (e: React.MouseEvent) => {
      e.stopPropagation()
      onCancel && onCancel()
      hideModal()
    }
    return (
      <RenderModal blur={'0px'} transparent={false}>
        <StyledContainer>
          <StyledContent>
            {isCloseIconShow && (
              <StyledCloseIcon onClick={onClickCancel}>
                <IconClose color={colors.primary1} width={24} height={24} />
              </StyledCloseIcon>
            )}
            {title && <StyledTitle>{title}</StyledTitle>}
            {modalImage}
            <StyledDesc>{desc}</StyledDesc>
            <StyledButton
              buttonType={ButtonType.primary1}
              onClick={onClickOK}
              loading={confirmButtonLoading}
            >
              {confirmButtonText}
            </StyledButton>
            {isNeedCancelButton && (
              <StyledButton
                buttonType={ButtonType.subtle}
                onClick={onClickCancel}
              >
                {cancelButtonText}
              </StyledButton>
            )}
          </StyledContent>
        </StyledContainer>
      </RenderModal>
    )
  }

  return { DialogModal, hideModal, showModal }
}

const StyledContainer = styled.div`
  width: 700px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  padding: 0 16px;
`

const StyledContent = styled.div`
  background-color: ${colors.white};
  border-radius: 16px;
  text-align: center;
  flex: 1;
  padding: 24px 24px 12px;
  position: relative;
`
const StyledTitle = styled.p`
  font-family: 'KanyonBold';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
  letter-spacing: 0px;
  margin: 40px 23px;
`
const StyledDesc = styled.p`
  font-family: 'OpenSans';
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: 0px;
  margin: 35px 0 30px 0;
  color: ${colors.label};
`

const StyledButton = styled(Button)`
  width: 100%;
  margin-bottom: 12px;
`
const StyledCloseIcon = styled.div`
  display: flex;
  justify-content: flex-end;
`
