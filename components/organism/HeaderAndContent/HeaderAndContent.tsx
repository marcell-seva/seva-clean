import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
// import { useShareModal } from 'components/ShareModal/ShareModal'
// import { FooterSeva } from 'pages/component/FooterSeva/FooterSeva'
// import { Link, useParams } from 'react-router-dom'
import { variantListUrl } from 'routes/routes'
import styled from 'styled-components'
import { colors } from 'styles/colors'
// import { Params } from './CarVariantListPage'
// import { ContentPage } from './ContentPage'
import { useMediaQuery } from 'react-responsive'
import { trackCarVariantShareClick } from 'helpers/amplitude/seva20Tracking'
import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import { useRouter } from 'next/router'
import { StickyButtonProps } from 'components/molecules/StickyButton/StickyButton'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { CityOtrOption } from 'utils/types'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { CarHeader } from 'components/molecules/CarHeader/CarHeader'
import Link from 'next/link'
import { ContentPage } from '../ContentPage/ContentPage'
import { useShareModal } from 'components/molecules/OldShareModal/ShareModal'
import { client } from 'const/const'

export interface HeaderAndContentProps extends StickyButtonProps {
  onSticky?: (sticky: boolean) => void
  isShowLoading?: boolean
}

export const HeaderAndContent = ({
  onSticky,
  isShowLoading,
  ...props
}: HeaderAndContentProps) => {
  const router = useRouter()
  const { model, brand, slug } = router.query
  const tab = Array.isArray(slug) ? slug[0] : undefined
  const { showModal: showShareModal, ShareModal } = useShareModal()
  const [scrollXTab, setScrollXTab] = useState(0)
  const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' })
  const [scrollPosition, setScrollPosition] = useState(0)
  const { carModelDetails } = useContextCarModelDetails()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const isSticky = useMemo(() => {
    if (isDesktop && scrollPosition >= 525) {
      onSticky && onSticky(true)
      return true
    }
    if (!isDesktop && scrollPosition > 280) {
      onSticky && onSticky(true)
      return true
    }

    onSticky && onSticky(false)
    return false
  }, [scrollPosition])

  const handleScroll = () => {
    const position = window.pageYOffset
    setScrollPosition(position)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const checkActiveTab = () => {
    let positionValue = 0
    if (tab === 'spesifikasi' || tab === 'galeri') {
      positionValue = 200
    } else if (tab === 'harga') {
      if (scrollXTab < 106) {
        positionValue = 100
      } else {
        positionValue = -50
      }
    }

    scroll(positionValue)
  }

  useEffect(() => {
    checkActiveTab()
  }, [tab])

  const detectScroll = () => {
    const scrollLeft = tabRef.current.scrollLeft
    setScrollXTab(scrollLeft)
  }

  const tabRef = useRef() as React.MutableRefObject<HTMLDivElement>

  const scroll = (scrollOffset: number) => {
    if (tabRef && tabRef.current) {
      tabRef.current.scrollTo({
        left: (tabRef.current.scrollLeft += scrollOffset),
        behavior: 'smooth',
      })
    }
  }

  const formatTabUrl = (path: string) => {
    return variantListUrl.replace(':tab', path)
  }

  const routeTabMenu = [
    { key: undefined, name: 'RINGKASAN', route: formatTabUrl('') },
    {
      key: 'harga',
      name: 'HARGA',
      route: formatTabUrl('harga'),
    },
    { key: 'kredit', name: 'KREDIT', route: formatTabUrl('kredit') },
    {
      key: 'spesifikasi',
      name: 'SPESIFIKASI',
      route: formatTabUrl('spesifikasi'),
    },
    { key: 'galeri', name: 'GALERI', route: formatTabUrl('galeri') },
  ]

  const sortCarModelVariant = useMemo(() => {
    return (
      carModelDetails?.variants.sort(function (a, b) {
        return a.priceValue - b.priceValue
      }) || []
    )
  }, [carModelDetails])

  const carOtrPrice = useMemo(() => {
    return carModelDetails
      ? replacePriceSeparatorByLocalization(
          sortCarModelVariant[0].priceValue || 0,
          LanguageCode.id,
        )
      : 0
  }, [sortCarModelVariant])

  const getDataForAmplitude = () => {
    return {
      Car_Brand: carModelDetails?.brand ?? '',
      Car_Model: carModelDetails?.model ?? '',
      OTR: `Rp${carOtrPrice}`,
      City: cityOtr?.cityName || 'null',
      Page_Origination_URL: client ? window.location.href : '',
    }
  }

  return (
    <>
      <CarHeader
        onClickShare={() => {
          trackCarVariantShareClick(getDataForAmplitude())
          showShareModal()
        }}
        isSticky={isSticky}
        {...props}
      />
      <TabContainer
        ref={tabRef}
        sticky={isSticky}
        dekstop={isDesktop}
        onScroll={detectScroll}
      >
        <TabWrapper>
          {routeTabMenu.map((item, index) => (
            <TabMenu
              key={index}
              href={item.route
                .replace(':brand', (brand as string) ?? '')
                .replace(':model', (model as string) ?? '')}
              active={
                tab && tab.includes('SEVA')
                  ? item.key === undefined
                  : item.key === tab
              }
            >
              <TabText>{item.name}</TabText>
            </TabMenu>
          ))}
        </TabWrapper>
      </TabContainer>
      <TabContentWrapper sticky={isSticky}>
        <Suspense fallback={''}>
          <ContentPage
            tab={tab}
            isSticky={isSticky}
            isShowLoading={isShowLoading}
          />
          {/* <FooterSeva /> */}
        </Suspense>
      </TabContentWrapper>
      <ShareModal dataForAmplitude={getDataForAmplitude()} />
    </>
  )
}

const TabContainer = styled.div<{
  sticky: boolean
  dekstop: boolean
}>`
  width: 100%;
  height: ${({ sticky }) => (sticky ? '38px' : '50px')};
  overflow: auto;
  ::-webkit-scrollbar {
    display: none;
  }
  position: ${({ sticky }) => (sticky ? 'fixed' : 'initial')};
  top: ${({ sticky, dekstop }) => (sticky && dekstop ? '0px' : '59px')};
  z-index: 3;
  scroll-snap-type: x proximity;
  float: left;

  @media (min-width: 1025px) {
    height: 48px;
    background-color: ${colors.primaryDarkBlue};
    margin-top: ${({ sticky }) => sticky && '0px'};
  }

  @media (max-width: 1024px) and (min-width: 480px) {
    max-width: 480px;
    margin: 0 auto;
  }
`

const TabWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 530px;
  height: 100%;
  background-color: ${colors.primaryDarkBlue};

  @media (min-width: 1025px) {
    max-width: 1040px;
    width: 100%;
    margin: 0 auto;
  }
`

const TabMenu = styled(Link)<{ active: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 106px;
  background-color: ${({ active }) =>
    active ? colors.primaryBlue : `transparent`};
  scroll-snap-align: start;
  scroll-snap-stop: normal;

  @media (min-width: 1025px) {
    width: 208px;
  }
`

const TabContentWrapper = styled.div<{ sticky: boolean }>`
  @media (max-width: 1024px) {
    min-height: 30vh;
    ${({ sticky }) => sticky && 'padding-top: 100px;'}
  }

  @media (min-width: 1025px) {
    ${({ sticky }) => sticky && 'padding-top: 45px;'}
  }
`

const TabText = styled.h2`
  font-family: 'KanyonBold';
  font-size: 12px;
  line-height: 16px;
  color: ${colors.white};
`
