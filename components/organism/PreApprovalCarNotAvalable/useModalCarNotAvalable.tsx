// import React from 'react'
// import { useModal } from 'components/Modal/Modal'
// import styled from 'styled-components'
// import { colors } from 'styles/colors'
// import { LinkLabelSmallSemiBold } from 'components/typography/LinkLabelSmallSemiBold'
// import { TextMediumRegular } from 'components/typography/TextMediumRegular'
// import { TextLegalSmallRegular } from 'components/typography/TextLegalSmallRegular'
// import { screenSize } from 'utils/window'
// import CarImg from 'public/assets/illustration/car-not-exist.webp'
// import { useHistory } from 'react-router'
// import { carResultsUrl } from 'routes/routes'
// import { ModalBodyCarNotAvailable } from 'components/ModalBodyWrapper/ModalBodyCarNotAvailable'

// export const usePreApprovalCarNotAvailable = () => {
//   const { showModal, hideModal, RenderModal } = useModal()
//   const history = useHistory()
//   const goToCarResult = () => {
//     hideModal()
//     history.push(carResultsUrl)
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

//   @media (max-width: 1024px) {
//     padding: 16px;
//   }
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
//   font-weight: 700;
//   @media (max-width: 1024px) {
//     font-size: 20px;
//     line-height: 28px;
//     width: 100%;
//     margin: auto;
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
//   @media (max-width: 1024px) {
//     margin-left: 0px;
//   }
// `

// const StyledPositiveButtonWrapper = styled(LinkLabelSmallSemiBold)`
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 308px;
//   height: 56px;
//   margin-bottom: 16px;
//   font-size: 16px;
//   line-height: 22.4px;
//   background: ${colors.primary1};
//   color: ${colors.white};
//   border-radius: 16px;
//   margin-left: auto;
//   margin-right: auto;
//   margin-top: 30px;
//   :hover {
//     cursor: pointer;
//   }
//   @media (max-width: 1024px) {
//     line-height: 24px;
//     font-size: 16px;
//     height: 56px;
//     width: 280px;
//   }
//   @media (max-width: ${screenSize.mobileS}) {
//     margin-top: 10px;
//   }
// `
// const StyledWrapperModal = styled.div`
//   margin: auto;

//   @media (max-width: 1024px) {
//     margin-top: 50px;
//   }
// `
// const StyledDesc = styled(TextLegalSmallRegular)`
//   font-family: 'Kanyon';
//   font-size: 16px;
//   line-height: 24px;
//   @media (max-width: 1024px) {
//     width: 100%;
//     margin: auto;
//     font-size: 16px;
//     line-height: 24px;
//   }
// `
