import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/instant-approval-review.module.scss'
import { Modal, Progress, Tooltip } from 'antd'
import { Button, IconInfo } from '../../../components/atoms'
import { ButtonSize, ButtonVersion } from '../../../components/atoms/button'
import { getSessionStorage } from 'utils/handler/sessionStorage'

import { MoengageEventName, setTrackEventMoEngage } from 'helpers/moengage'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { useRouter } from 'next/router'
import { LanguageCode, LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { getLocalStorage } from 'utils/handler/localStorage'
import {
  CityOtrOption,
  LoanCalculatorInsuranceAndPromoType,
  NewFunnelCarVariantDetails,
  SendKualifikasiKreditRequest,
  SimpleCarVariantDetail,
} from 'utils/types/utils'
import { InstallmentTypeOptions, TrackerFlag } from 'utils/types/models'
import { useFinancialQueryData } from 'services/context/finnancialQueryContext'
import { useSessionStorageWithEncryption } from 'utils/hooks/useSessionStorage/useSessionStorage'
import { useLocalStorage } from 'utils/hooks/useLocalStorage'
import {
  formatNumberByLocalization,
  replacePriceSeparatorByLocalization,
} from 'utils/handler/rupiah'
import { FormLCState } from 'pages/kalkulator-kredit/[[...slug]]'
import {
  creditQualificationUrl,
  loanCalculatorDefaultUrl,
  waitingCreditQualificationUrl,
} from 'utils/helpers/routes'
import {
  CreditQualificationReviewParam,
  trackKualifikasiKreditCarDetailClick,
  trackKualifikasiKreditCarDetailClose,
  trackKualifikasiKreditReviewPageView,
} from 'helpers/amplitude/seva20Tracking'

import { isIsoDateFormat } from 'utils/handler/regex'
import { getToken } from 'utils/handler/auth'
import TooltipDaihatsu from 'components/molecules/tooltipDaihatsu'
import { Currency } from 'utils/handler/calculation'
import PopupCarDetail from 'components/organisms/popupCarDetail'
import PopupCreditDetail from 'components/organisms/popupCreditDetail'
import { useBadgePromo } from 'utils/hooks/usebadgePromo'
import { monthId } from 'utils/handler/date'
import HeaderCreditClasificationMobile from 'components/organisms/headerCreditClasificationMobile'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { navigateToKK } from 'utils/navigate'
import Image from 'next/image'
import { api } from 'services/api'
import {
  getCustomerInfoSeva,
  getCustomerKtpSeva,
  saveKtp,
  saveKtpSpouse,
} from 'utils/handler/customer'
import { getCarVariantDetailsById } from 'utils/handler/carRecommendation'
import { getNewFunnelRecommendations } from 'utils/handler/funnel'

const CreditQualificationReviewPage = () => {
  useProtectPage()
  const router = useRouter()
  const mainKtpDomicileOptionData: any = getSessionStorage(
    SessionStorageKey.MainKtpDomicileOptionData,
  )
  const selectablePromo = getLocalStorage<LoanCalculatorInsuranceAndPromoType>(
    LocalStorageKey.SelectablePromo,
  )
  const { BadgeList, promoList, selectedPromoList } = useBadgePromo()

  const sessionKTPUploaded = getSessionStorage(SessionStorageKey.KTPUploaded)
  const [ktpUploaded, setKtpUploaded]: any = useState(sessionKTPUploaded)
  const ktpData: any = getSessionStorage(SessionStorageKey.ReviewedKtpData)
  const mainKTP = getSessionStorage(SessionStorageKey.MainKtpType)
  const dataReview: any = getLocalStorage(LocalStorageKey.QualifcationCredit)
  const kkForm: FormLCState | null = getSessionStorage(
    SessionStorageKey.KalkulatorKreditForm,
  )
  const optionADDM: InstallmentTypeOptions | null = getLocalStorage(
    LocalStorageKey.SelectedAngsuranType,
  )
  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { financialQuery } = useFinancialQueryData()
  const [dataCar, setDataCar] = useState<NewFunnelCarVariantDetails>()
  const [promoCode] = useSessionStorageWithEncryption<string>(
    SessionStorageKey.PromoCodeGiiass,
    '',
  )
  const [carDimenssion, setCarDimenssion] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [isShowDetailCar, setIsShowDetailCar] = useState(false)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )
  const reviewedKtpData: any =
    getSessionStorage(SessionStorageKey.ReviewedKtpData) || []

  const [simpleCarVariantDetails] =
    useLocalStorage<SimpleCarVariantDetail | null>(
      LocalStorageKey.SimpleCarVariantDetails,
      null,
    )
  const [flag, setFlag] = useState<TrackerFlag>(TrackerFlag.Init)
  const [customerYearBorn, setCustomerYearBorn] = useState('')
  const creditQualificationLeadPayloadStorage =
    getLocalStorage<SendKualifikasiKreditRequest>(
      LocalStorageKey.CreditQualificationLeadPayload,
    )

  const formattedIncome = (income: string) => {
    return `Rp${formatNumberByLocalization(
      Number(income),
      LanguageCode.id,
      1000000,
      10,
    )} Juta`
  }

  const checkKTPUploaded = () => {
    getCustomerKtpSeva()
      .then((result) => {
        if (result.data[0]) {
          setKtpUploaded('uploaded')
        }
      })
      .catch((e: any) => {
        if (e?.response?.data?.code === 'NO_NIK_REGISTERED') {
          setKtpUploaded('not upload')
        }
      })
  }

  const onClickCtaNext = async () => {
    try {
      setIsLoading(true)
      const lead: any = getLocalStorage(
        LocalStorageKey.CreditQualificationResult,
      )
      const dataKTPSpouse = getSessionStorage(
        SessionStorageKey.DataUploadKTPSpouse,
      ) as any
      if (ktpUploaded === 'not upload') {
        const dataKTP = getSessionStorage(
          SessionStorageKey.DataUploadKTP,
        ) as any

        delete dataKTP.created
        if (dataKTPSpouse) delete dataKTPSpouse.created
        await saveKtp({
          ...dataKTP,
          isSpouse: dataKTPSpouse ? true : false,
          ...(dataKTPSpouse && { spouseKtpObj: { ...dataKTPSpouse } }),
        })
        sessionStorage.removeItem(SessionStorageKey.DataUploadKTP)
        sessionStorage.removeItem(SessionStorageKey.DataUploadKTPSpouse)
      } else {
        if (dataKTPSpouse) {
          delete dataKTPSpouse.created
          await saveKtpSpouse({ ...dataKTPSpouse })
          sessionStorage.removeItem(SessionStorageKey.DataUploadKTPSpouse)
        }
      }
      let tempLeadId = lead.leadId
      if (creditQualificationLeadPayloadStorage) {
        if (creditQualificationLeadPayloadStorage.leadId) {
          tempLeadId = creditQualificationLeadPayloadStorage.leadId
        }
      }
      const dataBodyIA = {
        leadId: tempLeadId,
        useKtpSpouseAsMain: mainKTP === 'spouse' ? true : false,
        leasing: kkForm?.leasingOption?.toUpperCase() || '',
        cityDom: mainKtpDomicileOptionData.lastChoosenDomicile,
        leadName: mainKTP === 'spouse' ? ktpData[1].name : ktpData[0].name,
      }
      const res = await api.postInstantApproval(dataBodyIA, {
        headers: { Authorization: getToken()?.idToken },
      })
      if (res) {
        setIsLoading(false)
        sessionStorage.removeItem(SessionStorageKey.KTPUploaded)
        localStorage.removeItem(LocalStorageKey.SelectablePromo)
        router.push(waitingCreditQualificationUrl)
      }
    } catch (error) {
      setIsLoading(false)
    }
  }

  const fetchNewFunnelRecommendation = async () => {
    const response = await getNewFunnelRecommendations({})
    const choosenModel = response.carRecommendations.find(
      (car: any) => car.id === dataCar?.modelDetail.id,
    )

    if (choosenModel) {
      setCarDimenssion(
        `${choosenModel.length} x ${choosenModel.width} x ${choosenModel.height} mm`,
      )
    }
  }

  const getCreditCualficationDataTracker = () => ({
    ...getDataForTracker(),
    Income: undefined,
    Total_Income: `Rp${formatNumberByLocalization(
      Number(dataReview?.monthlyIncome) + Number(dataReview?.spouseIncome || 0),
      LanguageCode.id,
      1000000,
      10,
    )} Juta`,
    Page_Origination: window.location.href,
  })

  const getFormattedDate = (dateData: string | Date) => {
    const date = new Date(dateData)
    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()

    return `${day} ${monthId(month)} ${year}`
  }

  const handleOpenDetail = () => {
    trackKualifikasiKreditCarDetailClick(getCreditCualficationDataTracker())
    setIsShowDetailCar(true)
  }
  const handleCloseDetail = () => {
    trackKualifikasiKreditCarDetailClose(getCreditCualficationDataTracker())
    setIsShowDetailCar(false)
  }

  const getDataForTracker = (): CreditQualificationReviewParam => {
    return {
      Car_Brand: dataCar?.modelDetail?.brand ?? '',
      Car_Model: dataCar?.modelDetail?.model ?? '',
      Car_Variant: dataCar?.variantDetail?.name ?? '',
      DP: `Rp${formatNumberByLocalization(
        simpleCarVariantDetails?.loanDownPayment ?? 0,
        LanguageCode.id,
        1000000,
        10,
      )} Juta`,
      Monthly_Installment: `Rp${formatNumberByLocalization(
        simpleCarVariantDetails?.loanMonthlyInstallment ?? 0,
        LanguageCode.id,
        1000000,
        10,
      )} jt/bln`,
      Tenure: `${simpleCarVariantDetails?.loanTenure ?? 0} Tahun`,
      Promo: !!promoCode ? promoCode : null,
      Year_Born: customerYearBorn,
      City: cityOtr?.cityName || 'Jakarta Pusat',
      Teman_SEVA_Ref_Code: !!dataReview?.temanSevaTrxCode
        ? dataReview?.temanSevaTrxCode
        : null,
      Occupation: dataReview?.occupation ?? '',
    }
  }

  const trackAmplitudeAndMoengagePageView = () => {
    trackKualifikasiKreditReviewPageView({
      ...getDataForTracker(),
      Income: formattedIncome(String(financialQuery.monthlyIncome)),
    })
    setTrackEventMoEngage(
      MoengageEventName.view_kualifikasi_kredit_review_page,
      {
        ...getDataForTracker(),
        Income: formattedIncome(String(financialQuery.monthlyIncome)),
      },
    )
  }

  const getCurrentUserInfo = () => {
    getCustomerInfoSeva()
      .then((response) => {
        // setLoadShimmer2(false)
        if (!!response[0].dob && isIsoDateFormat(response[0].dob)) {
          setCustomerYearBorn(response[0].dob.slice(0, 4))
        }
      })
      .catch((err) => {
        console.error(err)
        // setLoadShimmer2(false)
        // showToast()
      })
  }

  useEffect(() => {
    if (!!getToken()) {
      if (!simpleCarVariantDetails && !dataReview) {
        router.push(loanCalculatorDefaultUrl)
        return
      }
      if (simpleCarVariantDetails && !dataReview) {
        navigateToKK()
        return
      }
      if (simpleCarVariantDetails) {
        getCarVariantDetailsById(
          simpleCarVariantDetails.variantId, // get cheapest variant
        ).then((response) => {
          if (response) {
            setDataCar(response)
          }
        })

        getCurrentUserInfo()
      }
      checkKTPUploaded()
    }
  }, [])

  useEffect(() => {
    if (!!getToken()) {
      fetchNewFunnelRecommendation()
    }
  }, [dataCar?.modelDetail.id])

  useEffect(() => {
    if (
      !!dataCar &&
      !!simpleCarVariantDetails &&
      !!customerYearBorn &&
      !!dataReview &&
      flag === TrackerFlag.Init
    ) {
      trackAmplitudeAndMoengagePageView()
      setFlag(TrackerFlag.Sent)
    }
  }, [dataCar, customerYearBorn])

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <HeaderCreditClasificationMobile />
      <div className={styles.progressBar}>
        <Progress
          className={styles.antProgress}
          percent={90}
          showInfo={false}
          size="small"
          strokeColor={{ '0%': '#51A8DB', '100%': '#51A8DB' }}
          trailColor="#EBECEE"
        />
      </div>
      <div className={styles.container}>
        <div className={styles.titleText}>
          Kualifikasi Kredit: Instant Approval
        </div>
        <div className={styles.subTitleText}>Konfirmasi Data</div>
        <div className={styles.descTitle}>
          Periksa kembali informasi kamu sebelum mengecek Kualifikasi Kredit.
        </div>
        <div className={styles.paddingFormJob}>
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Nomor KTP Kamu</p>
              <p className={styles.openSansSemiblack}>
                {reviewedKtpData[0]?.nik}
              </p>
            </div>
            {reviewedKtpData.length > 1 && (
              <div className={styles.column}>
                <p className={styles.openSansLigtGrey}>Nomor KTP Pasanganmu</p>
                <p className={styles.openSansSemiblack}>
                  {reviewedKtpData[1].nik}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className={styles.paddingFormJob}>
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Tanggal Lahirmu</p>
              <p className={styles.openSansSemiblack}>
                {getFormattedDate(reviewedKtpData[0]?.birthdate)}
              </p>
            </div>
            {reviewedKtpData.length > 1 && (
              <div className={styles.column}>
                <p className={styles.openSansLigtGrey}>
                  Tanggal Lahir Pasanganmu
                </p>
                <p className={styles.openSansSemiblack}>
                  {' '}
                  {getFormattedDate(reviewedKtpData[1].birthdate)}
                </p>
              </div>
            )}
          </div>
        </div>
        {dataReview?.temanSevaTrxCode && (
          <div className={styles.paddingFormIncome}>
            <p className={styles.titleTextForm}>Kode Referral Teman SEVA</p>
            <p className={styles.textIncome}>{dataReview?.temanSevaTrxCode}</p>
          </div>
        )}
        <div
          className={styles.imageCar}
          style={{ paddingBottom: promoCode ? 15.56 : 31.56 }}
        >
          <Image
            src={dataCar?.variantDetail?.images[0] || ''}
            alt="car-images"
            width="188.39"
          />
        </div>
        <div className={styles.wrapperWithBorderBottom}>
          <div className={styles.titleSelectCar}>Mobil yang kamu pilih:</div>
          <div className={styles.titleTextCar}>
            {dataCar?.modelDetail.brand} {dataCar?.modelDetail.model}
          </div>
          <div className={styles.textType}>{dataCar?.variantDetail.name}</div>
          <div className={styles.textPrice}>
            Rp
            {replacePriceSeparatorByLocalization(
              Number(dataCar?.variantDetail.priceValue),
              LanguageCode.id,
            )}
          </div>
          <div className={styles.textCity}>
            <span className={styles.margin}>
              Harga OTR {cityOtr ? cityOtr?.cityName : 'Jakarta Pusat'}{' '}
            </span>
            <div
              className={`${styles.overlay} ${
                isTooltipOpen ? styles.showOverlay : ''
              }`}
              onClick={() => setIsTooltipOpen(false)}
            />
            {dataCar?.modelDetail.brand.includes('Daihatsu') && (
              <Tooltip
                title={<TooltipDaihatsu />}
                color="#246ED4"
                placement="top"
                trigger="click"
                // visible={isTooltipOpen}
              >
                <IconInfo
                  // onClick={() => setIsTooltipOpen(true)}
                  className={styles.margin}
                  width={18}
                  height={18}
                  color="#878D98"
                />
              </Tooltip>
            )}
          </div>
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Tenor</p>
              <p className={styles.openSansSemiblack}>
                {simpleCarVariantDetails?.loanTenure}
              </p>
            </div>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Bunga</p>
              <p className={styles.openSansSemiblack}>
                {simpleCarVariantDetails?.flatRate}%
              </p>
            </div>
          </div>
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Pembayaran Pertama</p>
              <p className={styles.openSansSemiblack}>
                Rp
                {replacePriceSeparatorByLocalization(
                  Number(dataReview?.totalFirstPayment),
                  LanguageCode.id,
                )}
              </p>
              {selectablePromo && selectablePromo.tdpAfterPromo > 0 && (
                <p className={styles.priceStrike}>
                  Rp
                  {Currency(selectablePromo.tdpBeforePromo)}
                </p>
              )}
              {dataReview && dataReview.multiKK && (
                <p className={styles.priceStrike}>
                  Rp
                  {Currency(dataReview.totalFirstPaymentVanilla)}
                </p>
              )}
            </div>
            <div className={styles.column}>
              <p className={styles.openSansLigtGrey}>Cicilan Bulanan</p>
              <p className={styles.openSansSemiblack}>
                Rp
                {replacePriceSeparatorByLocalization(
                  Number(dataReview?.loanMonthlyInstallment),
                  LanguageCode.id,
                )}
              </p>
              {selectablePromo &&
                typeof selectablePromo.installmentAfterPromo !== 'undefined' &&
                selectablePromo.installmentAfterPromo > 0 && (
                  <p className={styles.priceStrike}>
                    Rp
                    {Currency(selectablePromo.installmentBeforePromo)}
                  </p>
                )}
              {dataReview && dataReview.multiKK && (
                <p className={styles.priceStrike}>
                  Rp
                  {Currency(dataReview.loanMonthlyInstallmentVanilla)}
                </p>
              )}
            </div>
          </div>
          {(promoCode ||
            (selectedPromoList && selectedPromoList.length > 0) ||
            dataReview?.multiKK) && (
            <div className={styles.promoWrapper}>
              <div className={styles.textPromo}>Promo yang kamu pilih:</div>
              <div className={styles.textPromoWrapper}>
                {promoList &&
                  promoList.map((item, index) => (
                    <div key={index} className={styles.textPromoBold}>
                      • {item.promoTitle}
                    </div>
                  ))}
                {promoCode && (
                  <div className={styles.textPromoBold}>• {promoCode}</div>
                )}
                {dataReview.multiKK && (
                  <div className={styles.textPromoBold}>
                    • {dataReview.selectablePromo[0].title}
                  </div>
                )}
                <div className={styles.badgePromoWrapper}>
                  <BadgeList />
                </div>
              </div>
            </div>
          )}
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.columnFull}>
              <p className={styles.openSansLigtGrey}>
                Pembayaran Cicilan Pertama
              </p>
              <p className={styles.openSansSemiblack}>
                {optionADDM === 'ADDM' ? 'Bayar di Depan' : 'Bayar di Belakang'}
              </p>
            </div>
          </div>
          {selectablePromo && (
            <div className={styles.rowWithSpaceBottom}>
              <div className={styles.columnFull}>
                <p className={styles.openSansLigtGrey}>Tipe Asuransi</p>
                <p className={styles.openSansSemiblack}>
                  {selectablePromo.selectedInsurance.label}
                </p>
              </div>
            </div>
          )}
          <div className={styles.rowWithSpaceBottom}>
            <div className={styles.columnFull}>
              <p className={styles.openSansLigtGrey}>Perusahaan Pembiayaan</p>
              <p className={styles.openSansSemiblack}>
                {kkForm?.leasingOption === ''
                  ? 'Tidak Ada Preferensi'
                  : kkForm?.leasingOption?.toUpperCase()}
              </p>
            </div>
          </div>

          <div className={styles.rowWithSpaceBottom}>
            <p className={styles.textDetail} onClick={handleOpenDetail}>
              Lihat Detail Mobil
            </p>
          </div>
        </div>
        <div className={styles.paddingButton}>
          <Button
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            onClick={onClickCtaNext}
            loading={isLoading}
            disabled={isLoading}
          >
            Ajukan Instant Approval
          </Button>
        </div>
      </div>
      <PopupCarDetail
        isOpen={isShowDetailCar}
        dp={dataReview?.totalFirstPayment}
        installmentFee={dataReview?.loanMonthlyInstallment}
        price={dataCar?.variantDetail.priceValue || 0}
        tenure={dataReview?.loanTenure}
        onCancel={handleCloseDetail}
        carSeats={dataCar?.variantDetail.carSeats}
        engineCapacity={dataCar?.variantDetail.engineCapacity}
        fuelType={dataCar?.variantDetail.fuelType}
        transmission={dataCar?.variantDetail.transmission}
        rasioBahanBakar={dataCar?.variantDetail.rasioBahanBakar}
        dimenssion={carDimenssion}
      />

      <Modal
        open={openModal}
        onCancel={() => setOpenModal(false)}
        title=""
        footer={null}
        className="custom-modal-credit"
        width={343}
        style={{ borderRadius: '8px' }}
      >
        <PopupCreditDetail
          carVariant={dataCar}
          dataFinancial={financialQuery}
          city={cityOtr ? cityOtr?.cityName : 'Jakarta Pusat'}
          promoCode={promoCode}
          simpleCarVariantDetails={simpleCarVariantDetails}
          optionADDM={optionADDM}
        />
      </Modal>
    </>
  )
}

export default CreditQualificationReviewPage
