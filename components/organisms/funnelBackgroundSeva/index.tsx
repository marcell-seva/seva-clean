import React, { ReactElement, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import {
  trackCarOfMonthLeadsFormSubmit,
  trackLandingPageLeadsFormSubmit,
} from 'helpers/amplitude/seva20Tracking'
import { setTrackEventMoEngageWithoutValue } from 'helpers/moengage'
import { useModalContext } from 'context/modalContext/modalContext'
import { getCities } from 'services/cities'
import {
  BannerHomepageType,
  CityOtrOption,
  USPAttributes,
} from 'utils/types/utils'
import {
  OriginationLeads,
  useContactUsModal,
} from 'components/molecules/ContactUsModal/ContactUsModal'
import { useLoginAlertModal } from 'components/molecules/LoginAlertModal/LoginAlertModal'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { LocalStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/localstorageUtils'
import { countDaysDifference } from 'utils/handler/countDaysDifference'
import {
  AdvisorSection,
  CitySelectorModal,
  ImageCarousel,
  useDialogModal,
} from 'components/molecules'
import FloatingIcon from 'components/molecules/FloatingIcon/FloatingIcon'
import { SearchWidget } from 'components/molecules/searchWidget'
import { FooterSeva } from '../FooterSeva'
import { SalesDashBoardButton } from 'components/molecules/salesDashboardButton'
import { CarBranchRecommendation } from 'components/molecules/carBranchRecommendation/carBranchRecommendation'
import { HowToUse } from 'components/molecules/howToUse/oldHowToUse'
import { LoanCalculatorWidgetV2 } from 'components/molecules/loanCalculatorWidgetV2'
import { CarBodyTypesDesktop } from 'components/molecules/carBodyTypesDesktop/carBodyTypesDesktop'
import { CarOfMonth } from 'components/molecules/carOfMonth/carOfMonth'
import Testimonial from 'components/molecules/testimonial/testimonial'
import { ArticlesV2Desktop } from 'components/molecules/articlesV2/articlesV2Desktop'
import { client } from 'utils/helpers/const'

interface FunnelBackgroundSevaProp {
  topBanner: BannerHomepageType[]
  children?: ReactElement
  enableSalesDashboardButton: boolean
  uspData: USPAttributes
}

export const FunnelBackgroundSeva = ({
  topBanner,
  children,
  enableSalesDashboardButton,
  uspData,
}: FunnelBackgroundSevaProp) => {
  const { t } = useTranslation()
  const [showCitySelectorModal, setShowCitySelectorModal] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 1024px)' })
  const { showModal: showContactUsModal, ContactUsModal } = useContactUsModal()
  const { showModal: showLoginModal, LoginAlertModal } = useLoginAlertModal()
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const { modal } = useModalContext()
  const [cityListApi, setCityListApi] = useState<Array<CityOtrOption>>([])

  const checkCitiesData = () => {
    if (cityListApi.length === 0) {
      getCities().then((res) => {
        setCityListApi(res)
      })
    }
  }

  const isIn30DaysInterval = () => {
    const lastTimeSelectCity = getLocalStorage<string>(
      LocalStorageKey.LastTimeSelectCity,
    )
    if (!lastTimeSelectCity) {
      return false
    } else if (
      countDaysDifference(lastTimeSelectCity, new Date().toISOString()) <= 30
    ) {
      return true
    } else {
      return false
    }
  }

  const cityHandler = async () => {
    if (!cityOtr && !isIn30DaysInterval()) {
      setShowCitySelectorModal(true)
    }
  }

  useEffect(() => {
    checkCitiesData()
    cityHandler()
    if (modal.isOpenContactUsModal) {
      showContactUsModal()
    }
  }, [])
  const { DialogModal, showModal: showDialogModal } = useDialogModal()

  const onSubmitCarOfMonthLeads = () => {
    const currentCOMCar = localStorage.getItem(
      LocalStorageKey.CurrentCarOfTheMonthItem,
    )
    const parsedData = currentCOMCar ? JSON.parse(currentCOMCar) : ''
    if (
      currentCOMCar &&
      parsedData.Car_Brand !== undefined &&
      parsedData.Car_Model !== undefined
    ) {
      trackCarOfMonthLeadsFormSubmit({
        Car_Brand: parsedData.Car_Brand,
        Car_Model: parsedData.Car_Model,
      })
    }

    showDialogModal()
  }

  const onSubmitLeadSuccess = (whatsappChecked?: boolean) => {
    showDialogModal()
    trackLandingPageLeadsFormSubmit({
      WA_Chat: typeof whatsappChecked === 'undefined' ? false : whatsappChecked,
    })
    // prettier-ignore
    window.dataLayer.push({
      'event':'interaction',
      'eventCategory': 'Leads Generator',
      'eventAction': 'Homepage - Leads Form - Control',
      'eventLabel': t(`advisorSection.button`),
    });
    client && setTrackEventMoEngageWithoutValue('leads_created')
  }

  return (
    <div className="wrapper">
      <FloatingIcon />
      <div className="content-wrapper">
        {topBanner.length > 0 ? (
          <ImageCarousel data={topBanner}>
            {!isMobile ? (
              <div className="widget-desktop-wrapper">
                <SearchWidget />
              </div>
            ) : (
              <></>
            )}
          </ImageCarousel>
        ) : (
          <></>
        )}
        <div className="content">{children}</div>
      </div>
      {enableSalesDashboardButton && (
        <div className="dashboard-button-wrapper">
          <SalesDashBoardButton />
        </div>
      )}
      <CarBranchRecommendation />
      <HowToUse uspData={uspData} />
      <LoanCalculatorWidgetV2 />
      <CarBodyTypesDesktop />
      <CarOfMonth
        onSendOffer={() => {
          showContactUsModal()
        }}
      />
      <Testimonial />
      <ArticlesV2Desktop />
      <AdvisorSection
        onSubmitSuccess={onSubmitLeadSuccess}
        onCheckLogin={() => {
          showLoginModal()
        }}
      />
      <ContactUsModal
        title="Punya Pertanyaan?"
        onSubmitSuccess={onSubmitCarOfMonthLeads}
        originationLeads={OriginationLeads.CarOfMonth}
        onCheckLogin={() => {
          showLoginModal()
        }}
      />
      <DialogModal
        title="Terima kasih 🙌"
        desc="Agen kami akan segera menghubungi kamu di nomor telpon yang kamu sediakan"
        confirmButtonText="Ok"
      />
      <LoginAlertModal />
      <CitySelectorModal
        isOpen={showCitySelectorModal}
        onClickCloseButton={() => setShowCitySelectorModal(false)}
        cityListFromApi={cityListApi}
      />
      <FooterSeva />
    </div>
  )
}
