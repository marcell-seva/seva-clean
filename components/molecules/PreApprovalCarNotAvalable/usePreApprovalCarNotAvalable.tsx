// import React from 'react'
// import { useModal } from '../../../components/Modal/Modal'
// import styled from 'styled-components'
// import { colors } from '../../../styles/colors'
// import { LinkLabelSmallSemiBold } from '../../../components/typography/LinkLabelSmallSemiBold'
// import { TextMediumRegular } from 'components/typography/TextMediumRegular'
// import { TextLegalSmallRegular } from 'components/typography/TextLegalSmallRegular'
// import { screenSize } from '../../../utils/window'
// import CarImg from './images/CarNotExist.webp'
// import { useHistory } from 'react-router'
// import { SimpleCarVariantDetail } from 'types/types'
// import { useLocalStorage } from 'hooks/useLocalStorage/useLocalStorage'
// import { DownPaymentType, FunnelQueryKey, LocalStorageKey } from 'models/models'
// import { carResultsUrl } from 'const/routes'
// import { useFunnelQueryData } from 'services/context/funnelQueryContext'
// import { ModalBodyCarNotAvailable } from 'components/ModalBodyWrapper/ModalBodyCarNotAvailable'

// export const usePreApprovalCarNotAvalable = () => {
//   const { showModal, hideModal, RenderModal } = useModal()
//   const history = useHistory()
//   const { patchFunnelQuery } = useFunnelQueryData()
//   const [
//     simpleCarVariantDetails,
//   ] = useLocalStorage<SimpleCarVariantDetail | null>(
//     LocalStorageKey.SimpleCarVariantDetails,
//     null,
//   )
//   const goToCarResult = () => {
//     hideModal()
//     if (
//       simpleCarVariantDetails &&
//       simpleCarVariantDetails.loanMonthlyInstallment
//     ) {
//       let monthlyInstallmentTemp = ''
//       let downPaymentAmountTemp = ''
//       if (simpleCarVariantDetails.loanMonthlyInstallment > 10000000) {
//         monthlyInstallmentTemp = '10000001'
//       } else if (
//         simpleCarVariantDetails.loanMonthlyInstallment > 7000000 &&
//         simpleCarVariantDetails.loanMonthlyInstallment <= 10000000
//       ) {
//         monthlyInstallmentTemp = '10000000'
//       } else if (
//         simpleCarVariantDetails.loanMonthlyInstallment > 6000000 &&
//         simpleCarVariantDetails.loanMonthlyInstallment <= 7000000
//       ) {
//         monthlyInstallmentTemp = '7000000'
//       } else if (
//         simpleCarVariantDetails.loanMonthlyInstallment > 5000000 &&
//         simpleCarVariantDetails.loanMonthlyInstallment < 6000000
//       ) {
//         monthlyInstallmentTemp = '6000000'
//       } else if (
//         simpleCarVariantDetails.loanMonthlyInstallment > 4000000 &&
//         simpleCarVariantDetails.loanMonthlyInstallment < 5000000
//       ) {
//         monthlyInstallmentTemp = '5000000'
//       } else if (
//         simpleCarVariantDetails.loanMonthlyInstallment > 3000000 &&
//         simpleCarVariantDetails.loanMonthlyInstallment < 4000000
//       ) {
//         monthlyInstallmentTemp = '4000000'
//       } else if (simpleCarVariantDetails.loanMonthlyInstallment < 3000000) {
//         monthlyInstallmentTemp = '3000000'
//       }

//       //patch dp amount to mobil-baru filter
//       if (simpleCarVariantDetails.loanDownPayment > 350000000) {
//         downPaymentAmountTemp = '350000001'
//       } else if (
//         simpleCarVariantDetails.loanDownPayment > 250000000 &&
//         simpleCarVariantDetails.loanDownPayment <= 350000000
//       ) {
//         downPaymentAmountTemp = '350000000'
//       } else if (
//         simpleCarVariantDetails.loanDownPayment > 150000000 &&
//         simpleCarVariantDetails.loanDownPayment <= 250000000
//       ) {
//         downPaymentAmountTemp = '250000000'
//       } else if (
//         simpleCarVariantDetails.loanDownPayment > 100000000 &&
//         simpleCarVariantDetails.loanDownPayment <= 150000000
//       ) {
//         downPaymentAmountTemp = '150000000'
//       } else if (
//         simpleCarVariantDetails.loanDownPayment > 75000000 &&
//         simpleCarVariantDetails.loanDownPayment < 100000000
//       ) {
//         downPaymentAmountTemp = '100000000'
//       } else if (
//         simpleCarVariantDetails.loanDownPayment > 60000000 &&
//         simpleCarVariantDetails.loanDownPayment <= 75000000
//       ) {
//         downPaymentAmountTemp = '75000000'
//       } else if (
//         simpleCarVariantDetails.loanDownPayment > 50000000 &&
//         simpleCarVariantDetails.loanDownPayment < 60000000
//       ) {
//         downPaymentAmountTemp = '60000000'
//       } else if (
//         simpleCarVariantDetails.loanDownPayment > 40000000 &&
//         simpleCarVariantDetails.loanDownPayment < 50000000
//       ) {
//         downPaymentAmountTemp = '50000000'
//       } else if (
//         simpleCarVariantDetails.loanDownPayment > 30000000 &&
//         simpleCarVariantDetails.loanDownPayment < 40000000
//       ) {
//         downPaymentAmountTemp = '40000000'
//       } else if (simpleCarVariantDetails.loanDownPayment < 30000000) {
//         downPaymentAmountTemp = '30000000'
//       }

//       patchFunnelQuery({
//         [FunnelQueryKey.MonthlyInstallment]: monthlyInstallmentTemp,
//         [FunnelQueryKey.DownPaymentType]: DownPaymentType.DownPaymentAmount,
//         [FunnelQueryKey.DownPaymentAmount]: downPaymentAmountTemp,
//       })
//       history.push(carResultsUrl)
//     }
//   }
//   const PreApprovalCarNotAvailableModal = () => (
//     <RenderModal>
//       <StyledWrapperModal>
//         <ModalBodyCarNotAvailable>
//           <StyledWrapper>
//             <StyledImageWrapper>
//               <StyledTitleImg src={CarImg} />
//             </StyledImageWrapper>
//             <StyledSubtitle>
//               Mobil yang Kamu lihat atau pilih saat ini tidak tersedia di lokasi
//               Kamu.
//             </StyledSubtitle>
//             <StyledProgressWrapper></StyledProgressWrapper>
//             <StyledSecureInfoWrapper>
//               <StyledSecureTextWrapper>
//                 <StyledDesc>
//                   Kamu dapat memilih mobil lain untuk melakukan pembelian di
//                   lokasi Kamu
//                 </StyledDesc>
//               </StyledSecureTextWrapper>
//             </StyledSecureInfoWrapper>
//             <StyledPositiveButtonWrapper onClick={goToCarResult}>
//               Pilih Mobil Lain
//             </StyledPositiveButtonWrapper>
//           </StyledWrapper>
//         </ModalBodyCarNotAvailable>
//       </StyledWrapperModal>
//     </RenderModal>
//   )
//   return { PreApprovalCarNotAvailableModal, showModal, hideModal }
// }
// const StyledWrapper = styled.div`
//   padding: 24px;
//   display: flex;
//   flex-direction: column;
//   text-align: center;

//   @media (max-width: ${screenSize.mobileS}) {
//     padding: 8px;
//   }
// `

// const StyledTitleImg = styled.img`
//   max-width: 87px;
//   max-height: 57px;
//   @media (max-width: ${screenSize.mobileS}) {
//     margin-top: 8px;
//   }
// `
// const StyledSubtitle = styled(TextMediumRegular)`
//   color: #252525;
//   font-family: 'KanyonBold';
//   margin-top: 8px;
//   font-size: 24px;
//   line-height: 32px;
//   margin-bottom: 16px;
//   @media (max-width: 1024) {
//     font-size: 20px;
//     line-height: 28px;
//   }
// `
// const StyledProgressWrapper = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   justify-content: space-around;
//   align-items: stretch;
// `

// const StyledSecureInfoWrapper = styled.div`
//   display: flex;
//   flex-direction: row;
//   margin-top: 12px;
//   justify-content: center;
// `

// const StyledImageWrapper = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-bottom: 21px;
// `
// const StyledSecureTextWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   text-align: center;
//   margin-left: 20px;
//   width: 90%;
//   color: ${colors.label};
// `

// const StyledPositiveButtonWrapper = styled(LinkLabelSmallSemiBold)`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   height: 48px;
//   margin-top: 30px;
//   margin-bottom: 16px;
//   background: ${colors.primary1};
//   color: ${colors.white};
//   border-radius: 16px;
//   :hover {
//     cursor: pointer;
//   }

//   @media (max-width: ${screenSize.mobileS}) {
//     margin-top: 10px;
//   }
// `
// const StyledWrapperModal = styled.div`
//   margin: auto;
//   // @media (max-width: 800px) {
//   //   margin-top: 20px;
//   // }
//   @media (max-width: 480px) {
//     margin-top: 50px;
//   }
// `
// const StyledDesc = styled(TextLegalSmallRegular)`
//   font-family: 'Kanyon';
//   font-size: 16px;
//   line-height: 24px;
//   @media (max-width: 1024) {
//     font-size: 14px;
//     line-height: 20px;
//   }
// `
export {}
