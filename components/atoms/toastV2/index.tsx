import React, { HTMLAttributes, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { maxPageWidth } from 'styles/globalStyle'
import { ToastType } from 'utils/types/models'
import { TextLegalMedium } from 'utils/typography/TextLegalMedium'
import { isMobileDevice } from 'utils/window'
import { CloseSnackBar, OpenSnackBar } from '../Animation/slide'
import { CloseOutlined } from '../icon/CloseOutlined'

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  type: ToastType
  message: string
  onClose?: () => void
  visible?: boolean
  duration?: number // in seconds
}

const MILLISECONDS_IN_A_SECOND = 1000

export const ToastV2 = ({
  type,
  message,
  visible,
  onClose = () => ({}),
  duration = 4,
}: ToastProps) => {
  const domEl = document.querySelector('body')
  if (!domEl) return null

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (type === ToastType.Success) {
        if (visible) onClose()
      }
    }, duration * MILLISECONDS_IN_A_SECOND)

    return () => clearTimeout(timeout)
  }, [visible, type])

  return createPortal(
    <StyledToastContainer visible={visible}>
      <StyledToastWrapper type={type}>
        <TextLegalMedium>{message}</TextLegalMedium>
        <StyledCloseButton onClick={onClose}>
          <CloseOutlined color={colors.offWhite} />
        </StyledCloseButton>
      </StyledToastWrapper>
    </StyledToastContainer>,
    domEl,
  )
}

interface ToastWrapperProps {
  type: ToastType
}

const HiddenBlock = css`
  visibility: hidden;
`

const StyledToastContainer = styled.div<{ visible?: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: ${maxPageWidth};
  z-index: 1000;

  ${isMobileDevice
    ? css`
        bottom: 0;
      `
    : css`
        top: 0;
      `};

  ${({ visible }) =>
    typeof visible === 'undefined'
      ? HiddenBlock
      : visible
      ? OpenSnackBar
      : CloseSnackBar}
`

const ErrorStyle = css`
  background: ${colors.error};
`

const SuccessStyle = css`
  background: ${colors.supportSuccess};
`

const InfoStyle = css`
  background: ${colors.body};
`
const StyledToastWrapper = styled.div<ToastWrapperProps>`
  width: 100%;
  min-height: 72px;
  color: ${colors.offWhite};
  display: flex;
  justify-content: space-around;
  padding: 25px 16px;

  ${({ type }) => {
    switch (type) {
      case ToastType.Error:
        return ErrorStyle
      case ToastType.Success:
        return SuccessStyle
      case ToastType.Info:
        return InfoStyle
      default:
        return InfoStyle
    }
  }}

  justify-content: space-between;
  align-items: center;
`

const StyledCloseButton = styled.div`
  :hover {
    cursor: pointer;
  }
`
