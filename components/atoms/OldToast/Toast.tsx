import React, { HTMLAttributes, useEffect, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'
import { colors } from 'styles/colors'
import { IconClose } from 'components/atoms'
import { createPortal } from 'react-dom'
import { preApprovalQuestionFlowUrl } from 'utils/helpers/routes'
import { useRouter } from 'next/router'
import { isMobileDevice } from 'utils/window'
import { ToastType } from 'utils/types/models'

interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  type: ToastType
  message?: string
  onClose?: () => void
  isDismissible?: boolean
  duration?: number // in seconds
  visible?: boolean
  messageAsComponent?: () => JSX.Element
  overridePositionToBottom?: boolean
}

const MILLISECONDS_IN_A_SECOND = 1000

const ToastComponent = ({
  type,
  message = '',
  isDismissible = true,
  onClose = () => ({}),
  duration = 5,
  visible,
  messageAsComponent,
  overridePositionToBottom,
}: ToastProps) => {
  const domEl = document.querySelector('body')
  if (!domEl) return null

  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (type !== ToastType.ErrorPreApproval) {
        onClose()
      }
    }, duration * MILLISECONDS_IN_A_SECOND)

    return () => clearTimeout(timer)
  }, [])

  const handleRetry = () => {
    router.push(preApprovalQuestionFlowUrl)
  }

  const renderMessage = () => {
    if (!!messageAsComponent) {
      return messageAsComponent()
    } else if (type === ToastType.ErrorPreApproval) {
      return (
        <StyledText>
          {message}{' '}
          <TextRetry onClick={() => handleRetry()}>
            Ulangi Instant Approval
          </TextRetry>
        </StyledText>
      )
    } else {
      return <StyledText>{message}</StyledText>
    }
  }

  return createPortal(
    <StyledToastContainer
      visible={visible}
      overridePositionToBottom={overridePositionToBottom}
    >
      <StyledToastWrapper type={type} hasCloseIcon={isDismissible}>
        {renderMessage()}
        {isDismissible && (
          <StyledCloseButton onClick={onClose}>
            <IconClose color={colors.offWhite} width={24} height={24} />
          </StyledCloseButton>
        )}
      </StyledToastWrapper>
    </StyledToastContainer>,
    domEl,
  )
}

const Toast = React.memo(ToastComponent)

export const useToast = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isVisibleAnimation, setIsVisibleAnimation] = useState(false)

  const showToast = () => {
    setIsVisible(true)
    setIsVisibleAnimation(true)
  }
  const hideToast = () => {
    setIsVisibleAnimation(false)
    setTimeout(() => {
      setIsVisible(false)
    }, 1000) // same duration with animation
  }

  const RenderToast = ({ ...props }: ToastProps) => (
    <>
      {isVisible && (
        <Toast onClose={hideToast} visible={isVisibleAnimation} {...props} />
      )}
    </>
  )

  return {
    showToast,
    hideToast,
    RenderToast,
  }
}

interface ToastWrapperProps {
  type: ToastType
  hasCloseIcon: boolean
}

const HiddenBlock = css`
  visibility: hidden;
`

const getToastLocation = (overridePositionToBottom?: boolean) => {
  if (overridePositionToBottom) {
    return 'bottom: 0;'
  } else if (isMobileDevice) {
    return 'top: 0;'
  } else {
    return 'bottom: 0;'
  }
}

const StyledToastContainer = styled.div<{
  visible?: boolean
  overridePositionToBottom?: boolean
}>`
  position: fixed;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
  max-width: 700px;
  z-index: 1000;

  ${({ overridePositionToBottom }) =>
    getToastLocation(overridePositionToBottom)};

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
  background: ${colors.success};
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
      case ToastType.ErrorPreApproval:
        return ErrorStyle
      default:
        return InfoStyle
    }
  }}

  ${({ hasCloseIcon }) =>
    hasCloseIcon &&
    css`
      justify-content: space-between;
      align-items: center;
    `};
`

const StyledCloseButton = styled.div`
  :hover {
    cursor: pointer;
  }
`

const TextRetry = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0px;

  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
`

const StyledText = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 18px;
  letter-spacing: 0px;
`

export const SlideInUp = keyframes`
     from {
        transform: translate3d(0, 100%, 0);
        opacity: 0;
    }
    to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
`

export const SlideOutDown = keyframes`
     from {
        opacity: 1;
        transform: translate3d(0, 0, 0);
    }
    to {
        opacity: 0;
        transform: translate3d(0, 100%, 0);
    }
`

export const OpenSnackBar = css`
  animation: ${SlideInUp} 1s;
`

export const CloseSnackBar = css`
  opacity: 0;
  animation: ${SlideOutDown} 1s;
`
