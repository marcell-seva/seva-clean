import { Forward } from 'components/atoms/icon/Forward'
import { useModal } from 'components/atoms/ModalOld/Modal'
import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import HeaderVariant from '../header/header'

export const useSearchModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()

  const closeModal = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    hideModal()
  }

  const SearchModal = () => {
    return (
      <>
        <RenderModal blur={'0px'} transparent={false}>
          <StyledWrapper>
            <StyledContent>
              <SearchWrapper>
                <ForwardWrapper onClick={closeModal}>
                  <Forward />
                </ForwardWrapper>
                <HeaderVariant
                  overrideDisplay={'static'}
                  isOnModal={true}
                  suggestionListMobileWidth={'100%'}
                  closeModal={closeModal}
                />
              </SearchWrapper>
            </StyledContent>
          </StyledWrapper>
        </RenderModal>
      </>
    )
  }

  return { SearchModal, hideModal, showModal }
}

const StyledWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: unset;
}
`

const StyledContent = styled.div`
  border-radius: 0;
  text-align: center;
  flex: 1;
  padding: 20px 24px 19px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: ${colors.white};
`

const SearchWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  @media (max-width: 1024px) {
    width: 100%;
  }
`

const ForwardWrapper = styled.div`
  position: absolute;
  transform: rotate(180deg);
  top: 12px;
  left: 10px;

  @media (max-width: 1024px) {
    top: 14px;
  }
`
