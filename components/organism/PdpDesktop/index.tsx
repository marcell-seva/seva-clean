import React, { useContext, useEffect, useMemo, useState } from 'react'
import styles from 'styles/saas/organism/pdpDesktop.module.scss'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useRouter } from 'next/router'
import { useMediaQuery } from 'react-responsive'
import { usePreApprovalCarNotAvailable } from 'components/molecules/PreApprovalCarNotAvalable/useModalCarNotAvalable'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import { useContextCarVariantDetails } from 'context/carVariantDetailsContext/carVariantDetailsContext'
import { useContextRecommendations } from 'context/recommendationsContext/recommendationsContext'
import { useContextCarModelDetails } from 'context/carModelDetailsContext/carModelDetailsContext'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { LanguageCode, LocalStorageKey } from 'utils/models/models'
import { CityOtrOption } from 'utils/types'
import { useModalContext } from 'context/modalContext/modalContext'
import { variantListUrl } from 'routes/routes'
import { hundred, million, ten } from 'const/const'
import {
  getLowestDp,
  getLowestInstallment,
  getMinimumDp,
  getMinimumMonthlyInstallment,
} from 'utils/carModelUtils/carModelUtils'
import { saveLocalStorage } from 'utils/localstorageUtils'
import { CarRecommendation } from 'utils/types/utils'
import { savePreviouslyViewed } from 'utils/carUtils'
import { api } from 'services/api'
import { handleRecommendationsAndCarModelDetailsUpdate } from 'utils/recommendationUtils'
import { VariantListPageShimmer } from './VariantListPageShimmer'
import { HeaderAndContent } from '../HeaderAndContent/HeaderAndContent'
import { StickyButton } from 'components/molecules/StickyButton/StickyButton'
import {
  OriginationLeads,
  useContactUsModal,
} from 'components/molecules/ContactUsModal/ContactUsModal'
import { useLoginAlertModal } from 'components/molecules/LoginAlertModal/LoginAlertModal'
import { useDialogModal } from 'components/molecules/DialogModal/DialogModal'

export default function index() {
  const router = useRouter()
  console.log('qwe query', router.query)
  const {
    carRecommendationsResDefaultCity,
    carModelDetailsResDefaultCity,
    carVariantDetailsResDefaultCity,
    metaTagDataRes,
    carVideoReviewRes,
  } = useContext(PdpDataLocalContext)

  const { model, brand, slug } = router.query
  const tab = Array.isArray(slug) ? slug[0] : undefined
  const [stickyCTA, setStickyCTA] = useState(false)
  // TODO @toni : read "loanRankCVL" from query param
  // const location = useLocation<
  //   { [LocationStateKey.loanRankCVL]: LoanRank } | undefined
  // >()

  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  // const { t } = useTranslation()
  const { showModal: showCarNotExistModal, PreApprovalCarNotAvailableModal } =
    usePreApprovalCarNotAvailable()
  const { showModal: showLoginModal, LoginAlertModal } = useLoginAlertModal()
  const { showModal: showContactUsModal, ContactUsModal } = useContactUsModal()
  const { funnelQuery } = useFunnelQueryData()
  const { DialogModal, showModal: showDialogModal } = useDialogModal()
  const [isShowLoading, setShowLoading] = useState(true)
  const { setCarVariantDetails } = useContextCarVariantDetails()
  const { setRecommendations } = useContextRecommendations()
  const { carModelDetails, setCarModelDetails } = useContextCarModelDetails()
  // const { showModal: showCitySelectorModal, CitySelectorModal } =
  //   useNewCitySelectoreModal()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const { modal } = useModalContext()

  const cityHandler = async () => {
    // if (!cityOtr) {
    //   showCitySelectorModal()
    // }
  }

  const formatTabUrl = (path: string) => {
    return variantListUrl.replace(':tab', path)
  }

  const minimumDp = useMemo(() => {
    if (!carModelDetails) return ''
    return getMinimumDp(carModelDetails.variants, LanguageCode.en, million, ten)
  }, [carModelDetails])

  const minimumMonthlyInstallment = useMemo(() => {
    if (!carModelDetails) return ''
    return getMinimumMonthlyInstallment(
      carModelDetails.variants,
      LanguageCode.en,
      million,
      hundred,
    )
  }, [carModelDetails])

  const onSubmitLeadSuccess = () => {
    showDialogModal()

    // const loanRankcr = location.state?.loanRankCVL
    // const trackerProperty: CarSearchPageMintaPenawaranParam = {
    //   Car_Brand: carModelDetails?.brand as string,
    //   Car_Model: carModelDetails?.model as string,
    //   OTR: `Rp${replacePriceSeparatorByLocalization(
    //     carModelDetails?.variants[0].priceValue as number,
    //     LanguageCode.id,
    //   )}`,
    //   DP: `Rp${minimumDp} Juta`,
    //   Cicilan: `Rp${minimumMonthlyInstallment} jt/bln`,
    //   Tenure: `${funnelQuery.tenure || 5} Tahun`, // convert string
    //   City: cityOtr?.cityName || '',
    //   Peluang_Kredit:
    //     funnelQuery.monthlyIncome && funnelQuery.age && loanRankcr
    //       ? loanRankcr === LoanRank.Green
    //         ? 'Mudah'
    //         : loanRankcr === LoanRank.Red
    //         ? 'Sulit'
    //         : 'Null'
    //       : 'Null',
    // }
    // trackCarVariantListPageLeadsFormSumit(trackerProperty)
    // // prettier-ignore
    // window.dataLayer.push({
    //   'event':'interaction',
    //   'eventCategory': 'Leads Generator',
    //   'eventAction': 'Variant List Page - Hubungi Kami Leads Form',
    //   'eventLabel': t('contactUs.confirmBtn'),
    // });
    // setTrackEventMoEngageWithoutValue('leads_created')
  }

  const mediaCTAArea = () => {
    if (isMobile) return setStickyCTA(true)
    return setStickyCTA(false)
  }

  const getCityParam = () => {
    return `?city=${cityOtr?.cityCode ?? 'jakarta'}&cityId=${
      cityOtr?.cityId ?? '118'
    }`
  }

  useEffect(() => {
    if (isMobile) {
      // return immediately, so that this useEffect wont run in aleph page
      return
    }

    saveLocalStorage(LocalStorageKey.Model, (model as string) ?? '')
    cityHandler()
    mediaCTAArea()
    api.getRecommendation(getCityParam()).then((result: any) => {
      let id = ''
      const carList = result.carRecommendations
      const currentCar = carList.filter(
        (value: CarRecommendation) =>
          value.model.replace(/ +/g, '-').toLowerCase() === model,
      )

      if (currentCar.length > 0) {
        id = currentCar[0].id
      } else {
        setShowLoading(false)
        showCarNotExistModal()
        return
      }
      savePreviouslyViewed(currentCar[0])

      Promise.all([
        api.getRecommendation(getCityParam()),
        api.getCarModelDetails(id, getCityParam()),
      ])
        .then((response: any) => {
          const runRecommendation =
            handleRecommendationsAndCarModelDetailsUpdate(
              setRecommendations,
              setCarModelDetails,
            )

          runRecommendation(response)
          const sortedVariantsOfCurrentModel = response[1].variants
            .map((item: any) => item)
            .sort((a: any, b: any) => a.priceValue - b.priceValue)

          api
            .getCarVariantDetails(
              sortedVariantsOfCurrentModel[0].id, // get cheapest variant
              getCityParam(),
            )
            .then((result3: any) => {
              if (result3.variantDetail.priceValue == null) {
                showCarNotExistModal()
              }
              setCarVariantDetails(result3)
              setShowLoading(false)
            })
        })
        .catch(() => {
          showCarNotExistModal()
        })
    })
    if (modal.isOpenContactUsModal) {
      showContactUsModal()
    }
  }, [])

  return (
    <>
      <div className={styles.pageHeaderWrapper}>
        {/* <PageHeaderSeva>{!isMobile ? <HeaderVariant /> : <></>}</PageHeaderSeva> */}
      </div>
      <div className={styles.container}>
        {isShowLoading && (
          <div className={styles.shimmerWrapper}>
            <VariantListPageShimmer />
          </div>
        )}
        <HeaderAndContent
          onClickPenawaran={showContactUsModal}
          toLoan={
            '/v3' +
            formatTabUrl('kredit')
              .replace(':brand', (brand as string) ?? '')
              .replace(':model', (model as string) ?? '')
          }
          onSticky={(sticky) => !isMobile && setStickyCTA(sticky)}
          isShowLoading={isShowLoading}
        />
      </div>
      {tab !== 'kredit' && (
        <StickyButton
          onClickPenawaran={showContactUsModal}
          toLoan={formatTabUrl('kredit')
            .replace(':brand', (brand as string) ?? '')
            .replace(':model', (brand as string) ?? '')}
          isSticky={stickyCTA}
        />
      )}
      {/* <CitySelectorModal /> */}
      <PreApprovalCarNotAvailableModal />
      <ContactUsModal
        title={'Punya Pertanyaan?'}
        onSubmitSuccess={onSubmitLeadSuccess}
        originationLeads={OriginationLeads.CarVariantList}
        onCheckLogin={() => {
          showLoginModal()
        }}
        carVariantData={{
          brand: carModelDetails?.brand as string,
          model: carModelDetails?.model as string,
          dp: getLowestDp(carModelDetails?.variants || []),
          monthlyInstallment: getLowestInstallment(
            carModelDetails?.variants || [],
          ),
          tenure: (funnelQuery.tenure as number) || 5,
        }}
      />
      <DialogModal
        title={'Terima kasih 🙌'}
        desc={
          'Agen kami akan segera menghubungi kamu di nomor telpon yang kamu sediakan'
        }
        confirmButtonText={'Ok'}
      />
      <LoginAlertModal />
    </>
  )
}
