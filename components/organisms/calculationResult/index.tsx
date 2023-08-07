import React, { useEffect, useRef } from 'react'
import styles from 'styles/components/organisms/calculationResult.module.scss'
import { FormLCState, SpecialRateListType } from 'utils/types/utils'
import { CalculationResultItem } from 'components/molecules'
import { Button, IconWhatsapp, Overlay } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import {
  InstallmentTypeOptions,
  LanguageCode,
  LoanRank,
} from 'utils/models/models'
import { Tooltip } from 'antd'
import TooltipContentQualifacation from 'components/molecules/tooltipContent'
import {
  trackLCKualifikasiKreditTooltipCTAClick,
  trackLCKualifikasiKreditTooltipCTACloseClick,
} from 'helpers/amplitude/seva20Tracking'
import { replacePriceSeparatorByLocalization } from 'utils/numberUtils/numberUtils'
import elementId from 'helpers/elementIds'

const LogoAcc = '/revamp/icon/logo-acc.webp'
const LogoTaf = '/revamp/icon/logo-taf.webp'

interface Props {
  data: SpecialRateListType[]
  selectedLoan: SpecialRateListType | null
  setSelectedLoan: (value: SpecialRateListType) => void
  angsuranType: InstallmentTypeOptions
  handleRedirectToWhatsapp: (loan: SpecialRateListType) => void
  isTooltipOpen: boolean
  isQualificationModalOpen: boolean
  closeTooltip: () => void
  handleClickButtonQualification: (loan: SpecialRateListType) => void
  formData: FormLCState
}

export const CalculationResult = ({
  data,
  selectedLoan,
  setSelectedLoan,
  angsuranType,
  handleRedirectToWhatsapp,
  isTooltipOpen = false,
  isQualificationModalOpen = false,
  closeTooltip,
  handleClickButtonQualification,
  formData,
}: Props) => {
  const handleOnClickResultItem = (value: SpecialRateListType) => {
    setSelectedLoan(value)
  }

  const getLoanRank = (rank: string) => {
    if (rank === LoanRank.Green) {
      return 'Mudah'
    } else if (rank === LoanRank.Red) {
      return 'Sulit'
    }

    return ''
  }

  useEffect(() => {
    if (isTooltipOpen) {
      scrollToSection()
    }
  }, [isTooltipOpen])

  const goToButton = useRef<null | HTMLDivElement>(null)
  const scrollToSection = () => {
    goToButton.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'end',
    })
  }

  const handleUnderstandTooltip = () => {
    if (selectedLoan) {
      trackLCKualifikasiKreditTooltipCTAClick({
        Age: `${formData.age} Tahun`,
        Angsuran_Type: formData.paymentOption,
        Car_Brand: formData?.model?.brandName || '',
        Car_Model: formData?.model?.modelName || '',
        Car_Variant: formData.variant?.variantName || '',
        City: formData.city.cityName,
        DP: `Rp${replacePriceSeparatorByLocalization(
          formData.downPaymentAmount,
          LanguageCode.id,
        )}`,
        Page_Origination: window.location.href,
        Promo: formData.promoCode,
        Monthly_Installment: `Rp${replacePriceSeparatorByLocalization(
          selectedLoan.installment,
          LanguageCode.id,
        )}`,
        Peluang_Kredit: getLoanRank(selectedLoan.loanRank),
        Tenure: `${selectedLoan.tenure} Tahun`,
        Total_DP: `Rp${replacePriceSeparatorByLocalization(
          selectedLoan.dpAmount,
          LanguageCode.id,
        )}`,
      })
    }

    closeTooltip()
  }

  const handleCloseTooltip = () => {
    if (selectedLoan) {
      trackLCKualifikasiKreditTooltipCTACloseClick({
        Age: `${formData.age} Tahun`,
        Angsuran_Type: formData.paymentOption,
        Car_Brand: formData?.model?.brandName || '',
        Car_Model: formData?.model?.modelName || '',
        Car_Variant: formData.variant?.variantName || '',
        City: formData.city.cityName,
        DP: `Rp${replacePriceSeparatorByLocalization(
          formData.downPaymentAmount,
          LanguageCode.id,
        )}`,
        Page_Origination: window.location.href,
        Promo: formData.promoCode,
        Monthly_Installment: `Rp${replacePriceSeparatorByLocalization(
          selectedLoan.installment,
          LanguageCode.id,
        )}`,
        Peluang_Kredit: getLoanRank(selectedLoan.loanRank),
        Tenure: `${selectedLoan.tenure} Tahun`,
        Total_DP: `Rp${replacePriceSeparatorByLocalization(
          selectedLoan.dpAmount,
          LanguageCode.id,
        )}`,
      })
    }

    closeTooltip()
  }

  const renderLogoFinco = () => {
    return (
      <div className={styles.logoFincoWrapper}>
        <img
          src={LogoAcc}
          width={24.24}
          height={32}
          className={styles.logoAcc}
        />
        <img src={LogoTaf} width={37} height={19} className={styles.logoTaf} />
      </div>
    )
  }

  const renderDisclaimer = () => {
    return (
      <div className={styles.disclaimerWrapper}>
        {angsuranType === InstallmentTypeOptions.ADDM ? (
          <span className={styles.disclaimerText}>
            *Total DP: DP + Administrasi + Cicilan Pertama + Polis + TJH
            <br />
            **Cicilan per bulan: Sudah termasuk cicilan dan premi asuransi mobil
            <br />
            Perhitungan kredit ini disediakan oleh ACC dan TAF.
          </span>
        ) : (
          <span className={styles.disclaimerText}>
            *Total DP: DP + Administrasi + Polis + TJH
            <br />
            **Cicilan per bulan: Sudah termasuk cicilan dan premi asuransi mobil
            <br />
            Perhitungan kredit ini disediakan oleh ACC dan TAF.
          </span>
        )}
      </div>
    )
  }

  const renderCtaAndDisclaimer = () => {
    if (selectedLoan?.loanRank === LoanRank.Green) {
      return (
        <>
          <div className={styles.ctaGroup}>
            {!isTooltipOpen && !isQualificationModalOpen && (
              <Button
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                onClick={() => handleClickButtonQualification(selectedLoan)}
                data-testid={elementId.LoanCalculator.Info.KualifikasiKredit}
              >
                Cek Kualifikasi Kredit
              </Button>
            )}

            {isTooltipOpen && (
              <>
                <Overlay
                  isShow={isTooltipOpen}
                  onClick={handleCloseTooltip}
                  zIndex={998}
                />
                <div style={{ width: '100%' }}>
                  <Tooltip
                    title={
                      <TooltipContentQualifacation
                        onClick={handleUnderstandTooltip}
                      />
                    }
                    color="#246ED4"
                    placement="top"
                    className="calculation-result"
                    visible={isTooltipOpen}
                    overlayClassName="calculation-result"
                  >
                    <div
                      ref={goToButton}
                      className={isTooltipOpen ? styles.bordered : ''}
                    >
                      <Button
                        version={ButtonVersion.PrimaryDarkBlue}
                        size={ButtonSize.Big}
                        onClick={closeTooltip}
                      >
                        Cek Kualifikasi Kredit
                      </Button>
                    </div>
                  </Tooltip>
                </div>
              </>
            )}

            <Button
              version={ButtonVersion.Secondary}
              size={ButtonSize.Big}
              onClick={() => handleRedirectToWhatsapp(selectedLoan)}
              data-testid={elementId.LoanCalculator.Button.HubungiAgenSeva}
            >
              <div className={styles.whatsappCtaTextWrapper}>
                <IconWhatsapp width={16} height={16} />
                Hubungi Agen SEVA
              </div>
            </Button>
          </div>
          {renderDisclaimer()}
          {renderLogoFinco()}
        </>
      )
    } else if (selectedLoan?.loanRank === LoanRank.Red) {
      return (
        <>
          <div className={styles.ctaGroup}>
            <Button
              version={ButtonVersion.PrimaryDarkBlue}
              size={ButtonSize.Big}
              onClick={() => handleRedirectToWhatsapp(selectedLoan)}
              disabled={!selectedLoan}
            >
              <div
                className={`${styles.whatsappCtaTextWrapper} ${styles.whiteColor}`}
              >
                <IconWhatsapp width={16} height={16} />
                Hubungi Agen SEVA
              </div>
            </Button>
          </div>
          {renderDisclaimer()}
          {renderLogoFinco()}
        </>
      )
    }
  }

  return (
    <div
      className={styles.container}
      data-testid={elementId.LoanCalculator.Result.LoanCalculator}
    >
      <h3 className={styles.title}>Kemampuan Finansialmu</h3>
      <span className={styles.subtitle}>
        Perhitungan final akan diberikan oleh partner SEVA.
      </span>
      <div className={styles.dataHeaderWrapper}>
        <span className={`${styles.dataHeaderText} ${styles.tenorHeader}`}>
          Tenor
        </span>
        <span className={styles.dataHeaderText}>Total DP*</span>
        <span className={styles.dataHeaderText}>Cicilan per bulan**</span>
      </div>

      <div className={styles.listWrapper}>
        {data.map((item, index) => {
          return (
            <CalculationResultItem
              data={item}
              key={index}
              emitOnClick={handleOnClickResultItem}
              isActive={item.tenure === selectedLoan?.tenure}
            />
          )
        })}
      </div>

      {renderCtaAndDisclaimer()}
    </div>
  )
}
