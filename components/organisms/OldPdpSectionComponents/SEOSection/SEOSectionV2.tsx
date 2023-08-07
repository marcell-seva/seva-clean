import { TrackingEventName } from 'helpers/amplitude/eventTypes'
import { trackSEOFooterExpandClick } from 'helpers/amplitude/seva20Tracking'
import React, { useState, useRef, useEffect } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { ExpandAction } from '../Description/Description'
import { SeoParagraphItem } from './SeoParagraphItem'
import { CarModelDetailsResponse } from 'utils/types'

type SeoProps = {
  carModel?: CarModelDetailsResponse
}
export const SEOSectionV2 = ({ carModel }: SeoProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const expandRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const handleClick = () => {
    if (isOpen) {
      trackSEOFooterExpandClick(TrackingEventName.WEB_SEO_FOOTER_CLICK_CLOSE)
    } else {
      trackSEOFooterExpandClick(TrackingEventName.WEB_SEO_FOOTER_CLICK_EXPAND)
    }
    setIsOpen((prev) => !prev)
  }

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        expandRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }, 600)
    }
  }, [isOpen])

  return (
    <Container>
      <ContentWrapper isOpen={isOpen}>
        <Wrapper aria-expanded={isOpen} isOpen={isOpen}>
          {carModel && (
            <>
              <StyledSeoParagraphItem
                title={`Membeli Mobil ${
                  carModel?.brand + ' ' + carModel?.model
                }? Seperti Ini Cara Perawatannya!`}
                content={`Saat ini membeli mobil baru bukanlah hal buruk. Di tahun ${new Date().getFullYear()}, data menunjukan bahwa pembelian mobil baru mengalami peningkatan yang cukup signifikan,
               ini artinya mobil baru masih menjadi pilihan banyak orang. Jika kamu berniat membeli mobil baru, mobil baru ${
                 carModel?.brand + ' ' + carModel?.model
               } dapat menjadi pilihan yang tepat. <br/>​
               <br/>
              Membeli mobil baru sama halnya seperti membeli mobil bekas, kita juga harus memperhatikan perawatannya, karena mobil yang rajin perawatan tentu akan bertahan untuk jangka waktu yang panjang. Perawatan yang bisa dilakukan untuk mobil baru ${
                carModel?.brand + ' ' + carModel?.model
              } adalah pergantian oli, filter AC, periksa tekanan ban, serta mencuci mobil. ​`}
                isOpen={isOpen}
              />
              <StyledSeoParagraphItem
                title={`Ini Dia Keunggulan Mobil ${
                  carModel?.brand + ' ' + carModel?.model
                }`}
                content={`“Tak kenal maka tak sayang” peribahasa yang cocok untuk menggambarkan kondisi mobil. Sebelum kamu membungkus mobil baru ${
                  carModel?.brand + ' ' + carModel?.model
                }, mari mencari tahu terlebih dahulu seperti apa kondisinya hingga kelebihan dari mobil ${
                  carModel?.brand
                } ini.<br/>
              <br/>
              Dari luar mobil ${
                carModel?.model
              } memiliki tampilan yang sangat kokoh, membuat siapapun yang melihatnya akan terpesona. Mulai dari tampilan lampu LEDnya, grill krom, bagian belakangnya yang ditambah dengan lampu LED sederhana, serta roda tambahan. Body mobil yang tinggi dan bongsor memang membuat mobil terlihat tangguh dari luar. Interior mobilnya pun gak kalah, sudah dilengkapi dengan fitur-fitur teknologi yang canggih. ​ ​`}
                isOpen={isOpen}
              />
              <StyledSeoParagraphItem
                title={`Mobil ${
                  carModel?.brand + ' ' + carModel?.model
                }, Mobil Yang Tahan Segala Cuaca!`}
                content={`Kamu yang ingin membeli mobil ${
                  carModel?.brand + ' ' + carModel?.model
                } sekarang tak perlu khawatir, kamu bisa membeli mobil ini di SEVA yang menawarkan mobil baru kualitas dan banyak promonya. Mobil ${
                  carModel?.brand + ' ' + carModel?.model
                } terkenal dengan mobil yang tahan segala cuaca loh, kenapa? Karena dengan round clearance tinggi, bannya yang besar, penggerak roda belakangnya yang kuat membuat mobil ini cocok untuk kemana saja. Bikin hati aman karena mampu di segala medan. 
              <br/>
              <br/>
              Tak perlu risau juga, di jalan banjir pun, ${
                carModel?.brand + ' ' + carModel?.model
              } mampu melewatinya dengan aman tanpa takut mogok di tengah jalan. Mobil ini memang sangat cocok untuk berpetualang bersama keluarga ataupun teman.​​`}
                isOpen={isOpen}
              />
            </>
          )}
        </Wrapper>
        <div ref={expandRef}>
          <StyledExpandAction
            open={isOpen}
            onClick={handleClick}
            arrowColor={colors.label}
          />
        </div>
      </ContentWrapper>
    </Container>
  )
}

const Container = styled.div`
  background-color: ${colors.inputBg};
  width: 100%;
`

const ContentWrapper = styled.div<{
  isOpen: boolean
}>`
  display: flex;
  flex-direction: column;
  padding: ${({ isOpen }) => (isOpen ? '37' : '38')}px 16px 0;
  max-width: 1040px;
  margin: 0 auto;

  @media (min-width: 1025px) {
    padding: 40px 0 0;
  }
`

export const rotate = css`
  transform: rotate(90deg);
`

const Wrapper = styled.div<{
  isOpen: boolean
}>`
  display: flex;
  flex-direction: row;
  gap: 18px;
  overflow: hidden;

  max-height: 77px;
  transition: all 1s cubic-bezier(0, 1, 0, 1);

  &[aria-expanded='true'] {
    max-height: 300px;
    transition: all 1s ease-in-out;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 30px;
    max-height: 94px;
  }
`

const StyledSeoParagraphItem = styled(SeoParagraphItem)`
  color: ${colors.placeholder};
`

const StyledExpandAction = styled(ExpandAction)<{ open: boolean }>`
  margin-top: ${({ open }) => (open ? 12.5 : 14)}px;
  margin-bottom: ${({ open }) => (open ? 27.5 : 29)}px;

  @media (min-width: 1025px) {
    justify-content: flex-start;
    margin-top: 31px;
    margin-bottom: 35px;

    label {
      font-size: 12px !important;
      line-height: 14.68px !important;
    }
  }

  label {
    color: ${colors.label};
    line-height: 14.68px;
  }

  svg {
    margin-bottom: ${({ open }) => (open ? 0 : 3)}px !important;
  }
`
