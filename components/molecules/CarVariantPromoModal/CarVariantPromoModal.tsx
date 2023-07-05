import React, { memo } from 'react'
import { colors } from 'styles/colors'
import styled from 'styled-components'
import { IconClose } from 'components/atoms'
import { useModal } from 'components/atoms/ModalOld/Modal'
import { PromoList } from 'components/organism/ContentPage/Price/PromoList/PromoList'

interface Props {
  onCloseModal?: () => void
}

export const useCarVariantPromoModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()

  const CarVariantPromoModal = memo(({ onCloseModal }: Props) => {
    return (
      <RenderModal blur={'0px'} transparent={false}>
        <PromoWrapper>
          <StyledCloseIconWrapper
            onClick={() => {
              onCloseModal && onCloseModal()
              hideModal()
            }}
          >
            <IconClose color={colors.body2} width={20} height={20} />
          </StyledCloseIconWrapper>
          <Title>Pilihan Promo</Title>
          <PromoList />
        </PromoWrapper>
      </RenderModal>
    )
  })

  return { CarVariantPromoModal, showModal, hideModal }
}

const PromoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 22px 10px 49px 45px;
  width: 403px;
  height: 438px;
  background-color: ${colors.white};
  border-radius: 8px;
`

const Title = styled.span`
  font-family: 'KanyonBold';
  font-size: 20px;
  line-height: 24px;
  color: ${colors.primary1};
  margin: 9px 0 24px;
`

const StyledCloseIconWrapper = styled.div`
  text-align: right;
  margin-right: 13px;
`
