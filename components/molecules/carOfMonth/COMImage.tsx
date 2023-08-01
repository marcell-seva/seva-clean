import { client } from 'const/const'
import { trackCarOfTheMonthBrandClick } from 'helpers/amplitude/seva20Tracking'
import elementId from 'helpers/elementIds'
import React, { useState, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'
import { colors } from 'styles/colors'
import { parsedToUnCapitalizeWithHyphen } from 'utils/parsedToUnCapitalizeWithHyphen'

const Arrow = '/revamp/illustration/Forward.svg'

export type carBrand = {
  name: string
  imgUrl?: string
}

type COMImageProps = {
  carBrand: carBrand[]
  onChangeTab: (index: number) => void
}

export const COMImage = ({ carBrand, onChangeTab }: COMImageProps) => {
  const [indexTab, setIndexTab] = useState(0)
  const [rightClick, setRightClick] = useState(false)
  const [fade, setFade] = useState(false)
  const brandRef = useRef() as React.MutableRefObject<HTMLDivElement>

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFade(false)
    }, 900)

    return () => clearTimeout(timeout)
  }, [indexTab])

  const scroll = (scrollOffset: number) => {
    brandRef.current.scrollLeft += scrollOffset
  }

  const cars = [...carBrand]

  return (
    <div className="image-wrapper-com">
      <div className="gradient-com" />
      <ImageBackground event={fade} imgUrl={carBrand[indexTab]?.imgUrl} />
      <div className="tab-wrapper-com">
        <ContentWrapper ref={brandRef}>
          <div className="brand-wrapper-com">
            {cars.map((item, index) => (
              <span
                className="brand-text-com"
                key={index}
                onClick={() => {
                  setFade(false)
                  setIndexTab(index)
                  onChangeTab(index)
                  setFade(true)
                  trackCarOfTheMonthBrandClick({
                    Car_Brand: item.name,
                  })
                }}
                data-testId={
                  elementId.Homepage.CarOfTheMonth.ListBrand +
                  parsedToUnCapitalizeWithHyphen(item.name)
                }
              >
                {item.name}
              </span>
            ))}
          </div>
          {cars.length > 3 && (
            <>
              {!rightClick ? (
                <div
                  role="button"
                  className="mobile-arrow-right-com"
                  onClick={() => {
                    setRightClick(true)
                    scroll(300)
                  }}
                >
                  <img
                    src={Arrow}
                    alt="seva-arrow-right"
                    width={9}
                    height={11}
                  />
                </div>
              ) : (
                <div
                  role="button"
                  className="mobile-arrow-left-com"
                  onClick={() => {
                    setRightClick(false)
                    scroll(-300)
                  }}
                >
                  <img
                    src={Arrow}
                    alt="seva-arrow-left"
                    width={9}
                    height={11}
                  />
                </div>
              )}
            </>
          )}
          <ActiveLine index={indexTab} length={cars.length} />
          <Line />
        </ContentWrapper>
      </div>
    </div>
  )
}

const fadeIn = css`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  animation: fadeIn 2s;
`

const ImageBackground = styled.div<{ event: boolean; imgUrl?: string }>`
  height: 100%;
  width: 694px;
  background-image: url(${({ imgUrl }) => imgUrl || ''});
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;

  ${({ event }) => (event ? fadeIn : '')}

  @media (max-width: 1024px) {
    width: 100%;
    height: 168px;
    background-size: cover;
  }
`

const isApple = () => {
  if (!client) {
    return false
  }

  if (
    /iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  ) {
    return true
  }

  return false
}

const ContentWrapper = styled.div`
  width: 100%;

  @media (max-width: 1024px) {
    overflow-x: hidden;
    ::-webkit-scrollbar {
      display: none;
    }
    ${isApple() === false && 'scroll-behavior: smooth;'}
  }
`

const calculateLeft = (index: number, length: number) => {
  const left = (100 / length) * index
  return left
}

const calculateLeftMobile = (index: number) => {
  return index * 35
}

const ActiveLine = styled.div<{ index: number; length: number }>`
  height: 3px;
  width: ${({ length }) => 100 / length}%;
  position: relative;
  bottom: 0;
  left: ${({ index, length }) => calculateLeft(index, length)}%;
  background-color: ${colors.white};
  transition: left 800ms cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 2;

  @media (max-width: 1024px) {
    width: 35%;
    left: ${({ index }) => calculateLeftMobile(index)}%;
  }
`

const Line = styled.div`
  width: 100%;
  background-color: ${colors.white};
  height: 1px;

  @media (max-width: 1024px) {
    width: 175%;
  }
`
