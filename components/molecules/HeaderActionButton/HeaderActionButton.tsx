import React from 'react'
import styled from 'styled-components'
import elementId from 'helpers/elementIds'
import {
  HitungCicilanButton,
  LinkHitungCicilan,
  MintaPenawaranButton,
  StickyButtonProps,
} from '../StickyButton/StickyButton'
import { TanyaSeva } from '../TanyaSeva/TanyaSeva'
import { ButtonType } from 'components/atoms/ButtonOld/Button'

export const ActionButton = ({
  onClickPenawaran,
  toLoan,
}: StickyButtonProps) => {
  return (
    <ActionButtonWrapper>
      <MintaPenawaranButton
        data-testid={elementId.InstantApproval.ButtonOffer}
        buttonType={ButtonType.secondary5}
        onClick={onClickPenawaran}
      >
        Minta Penawaran
      </MintaPenawaranButton>
      <LinkHitungCicilan href={toLoan}>
        <HitungCicilanButton buttonType={ButtonType.primary5} height={'48px'}>
          Hitung Cicilan
        </HitungCicilanButton>
      </LinkHitungCicilan>
      <TanyaSeva />
    </ActionButtonWrapper>
  )
}

const ActionButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`
