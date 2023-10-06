import React, { useState } from 'react'
import styled, { css } from 'styled-components'
import { createPortal } from 'react-dom'
import { colors } from 'styles/colors'

export interface ModalProps {
  children?: React.ReactChild
  onClose?: () => void
  width?: string
  className?: string
  transparent?: boolean
  background?: string
  blur?: string
  clickContainerHandler?: () => void
  closeByClickOutside?: boolean
}

const ModalComponent = ({
  children,
  className,
  transparent = false,
  background = 'rgba(37, 37, 37, 0.93)',
  blur = '8px',
  clickContainerHandler,
  closeByClickOutside = false,
}: ModalProps) => {
  const domEl = document.querySelector('body')
  if (!domEl) return null

  return createPortal(
    <Container
      className={className}
      transparent={transparent}
      background={background}
      blur={blur}
      onClick={() => {
        closeByClickOutside && clickContainerHandler && clickContainerHandler()
      }}
    >
      <>{children}</>
    </Container>,
    domEl,
  )
}
export const Modal = React.memo(ModalComponent)

export const useModal = () => {
  const [isVisible, setIsVisible] = useState(false)

  const showModal = () => setIsVisible(true)
  const hideModal = () => setIsVisible(false)

  const RenderModal = ({ children, ...restProps }: ModalProps) => (
    <>
      {isVisible && (
        <Modal onClose={hideModal} {...restProps}>
          <>{children}</>
        </Modal>
      )}
    </>
  )

  return {
    showModal,
    hideModal,
    RenderModal,
    isVisible,
  }
}

type StyleProps = Pick<ModalProps, 'transparent' | 'background' | 'blur'>

const Container = styled.div<StyleProps>`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 40;
  overflow-y: scroll;

  ${({ transparent, background }) =>
    transparent
      ? css`
          background: ${colors.white};
          opacity: 0;
        `
      : css`
          background: ${background};
        `};
  backdrop-filter: ${({ blur }) => `blur(${blur})`};
  display: flex;
  justify-content: center;
  align-items: center;
  &.clickable {
    cursor: pointer;
  }
`
