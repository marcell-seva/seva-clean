import { MaxWidthStyle } from 'components/atoms'
import { useToast } from 'components/atoms/OldToast/Toast'
import { HomePageShimmer } from 'components/molecules'
import HeaderVariant from 'components/molecules/header/header'
import { client } from 'const/const'
import { useContextContactFormPatch } from 'context/contactFormContext/contactFormContext'
import { trackLandingPageView } from 'helpers/amplitude/seva20Tracking'
import endpoints from 'helpers/endpoints'
import {
  setTrackEventMoEngage,
  setTrackEventMoEngageWithoutValue,
} from 'helpers/moengage'
import Head from 'next/head'
import { HomePageDataLocalContext } from 'pages'
import React, { useContext, useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { getCustomerInfoWrapperSeva } from 'services/customer'
import styled from 'styled-components'
import { API, getToken } from 'utils/api'
import { encryptValue } from 'utils/encryptionUtils'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { useAmplitudePageView } from 'utils/hooks/useAmplitudePageView/useAmplitudePageView'
import { useSessionStorage } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { saveLocalStorage } from 'utils/localstorageUtils'
import {
  ContactFormKey,
  initUSPAttributes,
  LocationStateKey,
} from 'utils/models/models'
import { BannerHomepageType, USPAttributes } from 'utils/types/utils'
import { FunnelBackgroundSeva } from '../funnelBackgroundSeva'
import { PageHeaderSeva } from '../PageHeaderSeva/PageHeaderSeva'

const apiBanner = 'https://api.sslpots.com'

interface HomepageDesktopProps {}

const HomepageDesktop: React.FC<HomepageDesktopProps> = ({}) => {
  const { dataBanner, dataUsage } = useContext(HomePageDataLocalContext)
  const [topBannerData, setTopBannerData] =
    useState<BannerHomepageType[]>(dataBanner)
  const [uspData, setUspData] = useState<USPAttributes>(dataUsage)
  const patchContactFormValue = useContextContactFormPatch()
  const [enableSalesDashboardButton, setEnableSalesDashboardButton] =
    useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  if (!isMobile) useAmplitudePageView(trackLandingPageView)
  const [load, setLoad] = useState(true)
  const [_, __, removeLoanRankPLP] = useSessionStorage(
    SessionStorageKey.LoanRankFromPLP,
    false,
  )

  // TODO @Robby
  // const location = useLocation<{
  //   [LocationStateKey.PAAmbassadorError]: string
  // }>()
  const { showToast, RenderToast } = useToast()

  const getBannerHomepage = async () => {
    try {
      const data = await API.get(endpoints.bannerHomepage)
      setTopBannerData(data.data.data)
    } catch (e) {
      setTopBannerData([])
      throw new Error("Can't get banner homepage")
    } finally {
      setLoad(false)
    }
  }

  useEffect(() => {
    if (!isMobile) {
      getBannerHomepage()
      removeLoanRankPLP()
      patchContactFormValue({
        [ContactFormKey.PhoneNumberMiniSurvey]: ``,
      })

      const fetchStrapi = async () => {
        try {
          const callUsp = apiBanner + '/api/how-to-use-seva-config?populate=*'

          const [usp] = await Promise.all([
            fetch(callUsp).then((response) => response.json()),
          ])

          setUspData(usp.data.attributes)
        } catch (e) {
          console.error(e)
        }
      }

      fetchStrapi()

      // const MoengageTrack = async (data: CustomerInfoSeva[]) => {
      //   if (data && data.length > 0) {
      //     moengage.trackEvent('view_homepage', {
      //       name: data[0].fullName,
      //       mobilenumber: data[0].phoneNumber,
      //       gender: data[0].gender,
      //       birthdate: data[0].dob,
      //       email: data[0].email,
      //       registerdate: data[0].updatedAt
      //         ? data[0].updatedAt.slice(0, 10)
      //         : '-',
      //     })
      //   } else {
      //     moengage.trackEvent('view_homepage')
      //   }
      // }
      if (getToken()) {
        getCustomerInfoWrapperSeva()
          .then((res: any) => {
            const customerData = res.data[0]
            setCustomerDetail(customerData)
            setEnableSalesDashboardButton(customerData.isSales)
            // MoengageTrack(res.data)
            const objData = {
              name: customerData.fullName,
              mobilenumber: customerData.phoneNumber,
              gender: customerData.gender,
              birthdate: customerData.dob,
              email: customerData.email,
              registerdate: customerData.createdAt,
            }
            client && setTrackEventMoEngage('view_homepage', objData)
          })
          .catch((e) => console.error(e))
      } else {
        client && setTrackEventMoEngageWithoutValue('view_homepage')
      }
    }

    // replace state to remove the state from the history when user refresh the page
    window.addEventListener('beforeunload', () => {
      window.history.replaceState({}, document.title)
    })
  }, [])

  const setCustomerDetail = (payload: any) => {
    const encryptedData = encryptValue(JSON.stringify(payload))
    saveLocalStorage(LocalStorageKey.sevaCust, encryptedData)
  }

  // TODO @Robby
  // useEffect(() => {
  //   if (location.state?.[LocationStateKey.PAAmbassadorError]) {
  //     showToast()
  //   }
  // }, [location.state?.[LocationStateKey.PAAmbassadorError]])

  return (
    <>
      <Head>
        <title>SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik</title>
        <meta
          name="title"
          content="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        />
        <meta
          name="description"
          content="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <MaxWidthStyle />
      <Container>
        <PageHeaderSeva>
          <SearchWrapper>
            <HeaderVariant />
          </SearchWrapper>
        </PageHeaderSeva>

        <Wrapper scroll={!load}>
          {load && <HomePageShimmer />}
          <FunnelBackgroundSeva
            topBanner={topBannerData}
            enableSalesDashboardButton={enableSalesDashboardButton}
            uspData={uspData}
          ></FunnelBackgroundSeva>
        </Wrapper>
      </Container>
    </>
  )
}

export default HomepageDesktop

export const SearchWrapper = styled.div`
  @media (max-width: 1024px) {
    display: none;
  }
`

const Wrapper = styled.div<{ scroll: boolean }>`
  height: ${({ scroll }) => (scroll ? '100%' : '100vh')};
  overflow-y: ${({ scroll }) => (scroll ? 'auto' : 'hidden')};
  margin: 0 auto;

  @media (max-width: 1024px) {
    max-width: 480px;
  }
`
const Container = styled.div`
  width: 100%;
`
