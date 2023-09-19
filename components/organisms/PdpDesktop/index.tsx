import { useCitySelectorModal } from 'components/molecules/citySelector/citySelectorModal'
import {
  OriginationLeads,
  useContactUsModal,
} from 'components/molecules/ContactUsModal/ContactUsModal'
import { useDialogModal } from 'components/molecules/dialogModal/DialogModal'
import HeaderVariant from 'components/molecules/header/header'
import { useLoginAlertModal } from 'components/molecules/LoginAlertModal/LoginAlertModal'
import { usePreApprovalCarNotAvailable } from 'components/molecules/PreApprovalCarNotAvalable/useModalCarNotAvalable'
import { StickyButton } from 'components/molecules/StickyButton/StickyButton'
import { useFunnelQueryData } from 'services/context/funnelQueryContext'
import { useModalContext } from 'services/context/modalContext'
import {
  CarSearchPageMintaPenawaranParam,
  trackCarVariantListPageLeadsFormSumit,
} from 'helpers/amplitude/seva20Tracking'
import { setTrackEventMoEngageWithoutValue } from 'helpers/moengage'
import { useRouter } from 'next/router'
import { PdpDataLocalContext } from 'pages/mobil-baru/[brand]/[model]/[[...slug]]'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useMediaQuery } from 'react-responsive'
import { api } from 'services/api'
import { useCar } from 'services/context/carContext'
import { handleRecommendationsAndCarModelDetailsUpdate } from 'services/recommendations'
import styles from 'styles/components/organisms/pdpDesktop.module.scss'
import {
  getLowestDp,
  getLowestInstallment,
  getMinimumDp,
  getMinimumMonthlyInstallment,
} from 'utils/carModelUtils/carModelUtils'
import { savePreviouslyViewed } from 'utils/carUtils'
import { hundred, million, ten } from 'utils/helpers/const'
import { variantListUrl } from 'utils/helpers/routes'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { LoanRank } from 'utils/types/models'
import { replacePriceSeparatorByLocalization } from 'utils/handler/rupiah'
import { CityOtrOption } from 'utils/types'
import { CarRecommendation } from 'utils/types/utils'
import { HeaderAndContent } from '../HeaderAndContent/HeaderAndContent'
import { PageHeaderSeva } from '../PageHeaderSeva/PageHeaderSeva'
import { LanguageCode, LocalStorageKey } from 'utils/enum'
import { defaultCity, getCity } from 'utils/hooks/useGetCity'
import Seo from 'components/atoms/seo'
import { monthId } from 'utils/handler/date'

export default function index() {
  const router = useRouter()
  const {
    carRecommendationsResDefaultCity,
    carModelDetailsResDefaultCity,
    dataCombinationOfCarRecomAndModelDetailDefaultCity,
    carVariantDetailsResDefaultCity,
  } = useContext(PdpDataLocalContext)

  const { model, brand, slug } = router.query
  const tab = Array.isArray(slug) ? slug[0] : undefined
  const [stickyCTA, setStickyCTA] = useState(false)

  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const { showModal: showCarNotExistModal, PreApprovalCarNotAvailableModal } =
    usePreApprovalCarNotAvailable()
  const { showModal: showLoginModal, LoginAlertModal } = useLoginAlertModal()
  const { showModal: showContactUsModal, ContactUsModal } = useContactUsModal()
  const { funnelQuery } = useFunnelQueryData()
  const { DialogModal, showModal: showDialogModal } = useDialogModal()
  const [isShowLoading, setShowLoading] = useState(false)
  const {
    saveCarVariantDetails,
    saveRecommendation,
    carModelDetails,
    saveCarModelDetails,
  } = useCar()
  const modelDetailData =
    carModelDetails || dataCombinationOfCarRecomAndModelDetailDefaultCity
  const { showModal: showCitySelectorModal, CitySelectorModal } =
    useCitySelectorModal()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const isCurrentCitySameWithSSR = getCity().cityCode === defaultCity.cityCode

  const { modal } = useModalContext()

  const cityHandler = async () => {
    if (!cityOtr) {
      showCitySelectorModal()
    }
  }

  const formatTabUrl = (path: string) => {
    return variantListUrl.replace(':tab', path)
  }

  const minimumDp = useMemo(() => {
    if (!modelDetailData) return ''
    return getMinimumDp(modelDetailData.variants, LanguageCode.en, million, ten)
  }, [modelDetailData])

  const minimumMonthlyInstallment = useMemo(() => {
    if (!modelDetailData) return ''
    return getMinimumMonthlyInstallment(
      modelDetailData.variants,
      LanguageCode.en,
      million,
      hundred,
    )
  }, [modelDetailData])

  const onSubmitLeadSuccess = () => {
    showDialogModal()

    const loanRankcr = router.query.loanRankCVL ?? ''
    const trackerProperty: CarSearchPageMintaPenawaranParam = {
      Car_Brand: modelDetailData?.brand as string,
      Car_Model: modelDetailData?.model as string,
      OTR: `Rp${replacePriceSeparatorByLocalization(
        modelDetailData?.variants[0].priceValue as number,
        LanguageCode.id,
      )}`,
      DP: `Rp${minimumDp} Juta`,
      Cicilan: `Rp${minimumMonthlyInstallment} jt/bln`,
      Tenure: `${funnelQuery.tenure || 5} Tahun`, // convert string
      City: cityOtr?.cityName || '',
      Peluang_Kredit:
        funnelQuery.monthlyIncome && funnelQuery.age && loanRankcr
          ? loanRankcr === LoanRank.Green
            ? 'Mudah'
            : loanRankcr === LoanRank.Red
            ? 'Sulit'
            : 'Null'
          : 'Null',
    }
    trackCarVariantListPageLeadsFormSumit(trackerProperty)
    // // prettier-ignore
    window.dataLayer.push({
      event: 'interaction',
      eventCategory: 'Leads Generator',
      eventAction: 'Variant List Page - Hubungi Kami Leads Form',
      eventLabel: 'Kirim Rincian',
    })
    setTrackEventMoEngageWithoutValue('leads_created')
  }

  const mediaCTAArea = () => {
    if (isMobile) return setStickyCTA(true)
    return setStickyCTA(false)
  }

  const getCityParam = () => {
    return `?city=${cityOtr?.cityCode ?? 'jakarta'}&cityId=${
      cityOtr?.id ?? '118'
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

    if (!isCurrentCitySameWithSSR) {
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
                saveRecommendation,
                saveCarModelDetails,
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
                saveCarVariantDetails(result3)
                setShowLoading(false)
              })
          })
          .catch(() => {
            showCarNotExistModal()
          })
      })
    } else {
      const runRecommendation = handleRecommendationsAndCarModelDetailsUpdate(
        saveRecommendation,
        saveCarModelDetails,
      )

      runRecommendation([
        carRecommendationsResDefaultCity,
        carModelDetailsResDefaultCity,
      ])
      saveCarVariantDetails(carVariantDetailsResDefaultCity)
      const currentCar =
        carRecommendationsResDefaultCity.carRecommendations.filter(
          (value: CarRecommendation) =>
            value.model.replace(/ +/g, '-').toLowerCase() === model,
        )
      savePreviouslyViewed(currentCar[0])
    }

    if (modal.isOpenContactUsModal) {
      showContactUsModal()
    }
  }, [])

  const todayDate = new Date()

  return (
    <>
      <div className={styles.pageHeaderWrapper}>
        <PageHeaderSeva>{!isMobile ? <HeaderVariant /> : <></>}</PageHeaderSeva>
      </div>
      <div className={styles.container}>
        <HeaderAndContent
          onClickPenawaran={showContactUsModal}
          toLoan={formatTabUrl('kredit')
            .replace(':brand', (brand as string) ?? '')
            .replace(':model', (model as string) ?? '')}
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

      <CitySelectorModal />
      <PreApprovalCarNotAvailableModal />
      <ContactUsModal
        title={'Punya Pertanyaan?'}
        onSubmitSuccess={onSubmitLeadSuccess}
        originationLeads={OriginationLeads.CarVariantList}
        onCheckLogin={() => {
          showLoginModal()
        }}
        carVariantData={{
          brand: modelDetailData?.brand as string,
          model: modelDetailData?.model as string,
          dp: getLowestDp(modelDetailData?.variants || []),
          monthlyInstallment: getLowestInstallment(
            modelDetailData?.variants || [],
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
