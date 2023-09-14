import React from 'react'
import styled from 'styled-components'
import { colors } from 'styles/colors'

export const PromoList = () => {
  const promoList = [
    {
      title: 'Cashback 1 Angsuran',
      description:
        'Dapatkan max. cashback 4 juta rupiah setelah melakukan pembayaran Angsuran Pertama. Khusus pembelian mobil secara kredit dengan tenor 1 - 5 tahun melalui ACC dan TAF',
    },
    {
      title: 'Bebas 1 Tahun Asuransi Comprehensive Garda Oto',
      description:
        'Berlaku untuk pembelian mobil baru Toyota dan Daihatsu dengan tipe mobil passenger car. Khusus pembelian mobil secara kredit dengan tenor 3 - 5 tahun.',
    },
  ]

  return (
    <PromoListWrapper showScrollbar={promoList.length > 2}>
      {promoList.map((item, index) => (
        <div key={index} style={{ display: 'flex', flexDirection: 'column' }}>
          <PromoListTitle>{item.title}</PromoListTitle>
          <PromoListDescription>{item.description}</PromoListDescription>
          <Line />
        </div>
      ))}
    </PromoListWrapper>
  )
}

const PromoListWrapper = styled.div<{ showScrollbar?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: ${({ showScrollbar }) => (showScrollbar ? 'auto' : 'hidden')};
  padding-right: 34px;
  &::-webkit-scrollbar {
    width: 4px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: ${colors.line};
    border-radius: 4px;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: ${colors.placeholder};
    border-radius: 4px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.placeholder};
  }
`

const PromoListTitle = styled.span`
  font-family: var(--kanyon-bold);
  font-size: 14px;
  line-height: 20px;
  color: ${colors.primaryBlue};
  margin-bottom: 6px;

  @media (min-width: 1025px) {
    font-size: 16px;
  }
`

const PromoListDescription = styled.span`
  font-family: var(--open-sans);
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  color: ${colors.label};
  margin-bottom: 24px;

  @media (min-width: 1025px) {
    font-size: 14px;
    margin-bottom: 26px;
  }
`

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${colors.placeholder};
`
