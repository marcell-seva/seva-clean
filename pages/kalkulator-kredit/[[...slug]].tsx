import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { getToken } from 'utils/handler/auth'
import { loanCalculatorDefaultUrl } from 'utils/helpers/routes'
import { CityOtrOption } from 'utils/types'
import { MobileWebTopMenuType } from 'utils/types/utils'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { useUtils } from 'services/context/utilsContext'
import {
  getCities,
  getMobileHeaderMenu,
  getMobileFooterMenu,
  getAnnouncementBox as gab,
} from 'services/api'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { serverSideManualNavigateToErrorPage } from 'utils/handler/navigateErrorPage'
import { MobileWebFooterMenuType } from 'utils/types/props'
import { LoanCalculatorPageV1 } from 'components/organisms/loanCalculator/v1'
import { InstallmentTypeOptions } from 'utils/types/models'
import { LoanCalculatorPageV2 } from 'components/organisms/loanCalculator/v2'

export interface FormLCState {
  city: CityOtrOption
  model:
    | {
        modelId: string
        modelName: string
        modelImage: string
        brandName: string
        loanRank: string
      }
    | undefined
  variant:
    | {
        variantId: string
        variantName: string
        otr: string
        discount: number
      }
    | undefined
  promoCode: string
  isValidPromoCode: boolean
  age: string
  monthlyIncome: string
  downPaymentAmount: string
  paymentOption: InstallmentTypeOptions
  leasingOption?: string
}

export const getSlug = (query: any, index: number) => {
  return (
    query.slug && query.slug.length > index && (query.slug[index] as string)
  )
}

export default function LoanCalculatorPage({
  dataMobileMenu,
  dataFooter,
  dataCities,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter()
  const { v } = router.query
  const {
    saveMobileWebTopMenus,
    saveCities,
    saveMobileWebFooterMenus,
    saveDataAnnouncementBox,
  } = useUtils()

  const checkCitiesData = () => {
    if (dataCities.length === 0) {
      getCities().then((res) => {
        saveCities(res)
      })
    } else {
      saveCities(dataCities)
    }
  }

  const getAnnouncementBox = async () => {
    try {
      const res: any = await gab({
        headers: {
          'is-login': getToken() ? 'true' : 'false',
        },
      })
      saveDataAnnouncementBox(res.data)
    } catch (error) {}
  }

  const fetchDataContext = () => {
    saveMobileWebTopMenus(dataMobileMenu)
    saveMobileWebFooterMenus(dataFooter)
  }

  useEffect(() => {
    checkCitiesData()
    getAnnouncementBox()
    fetchDataContext()

    // mock validation
    // TODO : replace with the real one later
    const isCarNotAvailable = false
    if (isCarNotAvailable) {
      // use replace, so that user cant go back to error page
      router.replace(loanCalculatorDefaultUrl)
    }
  }, [])

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      {v === '1' ? <LoanCalculatorPageV1 /> : <LoanCalculatorPageV2 />}
    </>
  )
}

export const getServerSideProps: GetServerSideProps<{
  dataMobileMenu: MobileWebTopMenuType[]
  dataFooter: MobileWebFooterMenuType[]
  dataCities: CityOtrOption[]
}> = async (ctx) => {
  ctx.res.setHeader(
    'Cache-Control',
    'public, s-maxage=59, stale-while-revalidate=3000',
  )

  try {
    const [menuMobileRes, footerRes, cityRes]: any = await Promise.all([
      getMobileHeaderMenu(),
      getMobileFooterMenu(),
      getCities(),
    ])

    return {
      props: {
        dataMobileMenu: menuMobileRes.data,
        dataFooter: footerRes.data,
        dataCities: cityRes,
      },
    }
  } catch (e: any) {
    return serverSideManualNavigateToErrorPage(e?.response?.status)
  }
}
