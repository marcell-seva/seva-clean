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
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

export const ActionButton = ({
  onClickPenawaran,
  toLoan,
}: StickyButtonProps) => {
  return (
    <ActionButtonWrapper>
      <MintaPenawaranButton
        data-testid={elementId.InstantApproval.ButtonOffer}
        version={ButtonVersion.Secondary}
        onClick={onClickPenawaran}
        size={ButtonSize.Big}
      >
        Minta Penawaran
      </MintaPenawaranButton>
      <LinkHitungCicilan href={toLoan}>
        <HitungCicilanButton
          version={ButtonVersion.PrimaryDarkBlue}
          size={ButtonSize.Big}
        >
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
