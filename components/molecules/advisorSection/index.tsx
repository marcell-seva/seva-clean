import { Input } from 'components/atoms/OldInput/Input'
import { ToastType, useToast } from 'components/atoms/OldToast/Toast'
import { UncheckedSquareOutlined } from 'components/atoms'
import {
  useContextContactFormData,
  useContextContactFormPatch,
} from 'context/contactFormContext/contactFormContext'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import { trackSelectHomeSendDetails } from 'helpers/amplitude/newHomePageEventTracking'
import { FBPixelStandardEvent } from 'helpers/facebookPixel'
import { trackGASubmitContactInfo } from 'services/googleAds'
import { useEnableNewLogin } from 'utils/hooks/useEnableNewLogin'
import {
  ContactFormKey,
  ContactType,
  LocalStorageKey,
} from 'utils/models/models'
import React, { ChangeEvent, useEffect, useState } from 'react'
// import ReactPixel from 'react-facebook-pixel'
import { useTranslation } from 'react-i18next'
import { LoginSevaUrl } from 'routes/routes'
import { getCustomerInfoSeva } from 'services/customer'
import {
  createUnverifiedLeadNew,
  UnverifiedLeadSubCategory,
} from 'services/lead'
import styled from 'styled-components'
import { getToken } from 'utils/api'
import { savePageBeforeLogin } from 'utils/loginUtils'
import { Button, ButtonType } from 'components/atoms/ButtonOld/Button'
import { colors } from 'styles/colors'
import { createProbeTrack } from 'services/probe'
import { getLocalStorage, saveLocalStorage } from 'utils/localstorageUtils'
import { CityOtrOption, UTMTagsData } from 'utils/types/utils'
import elementId from 'helpers/elementIds'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import { TextLargeRegular } from 'components/atoms/typography/TextLargeRegular'
import { CheckedSquareOutlined } from 'components/atoms/icon/CheckedSquareOutlined'
import { TextMediumRegular } from 'components/atoms/typography/TextMediumRegular'
import { useRouter } from 'next/router'
import { FormPhoneNumber } from '../formPhoneNumber/FormPhoneNumber'
import { isValidPhoneNumber } from 'utils/numberUtils/numberUtils'
import { client } from 'const/const'

interface AdvisorSectionProps {
  onSubmitSuccess: (whatsappChecked?: boolean) => void
  onCheckLogin?: () => void
}

export const AdvisorSection = ({
  onSubmitSuccess,
  onCheckLogin,
}: AdvisorSectionProps) => {
  const contactFormData = useContextContactFormData()
  const router = useRouter()

  const [fullName, setFullName] = useState<string>('')
  const [confirmEnabled, setConfirmEnabled] = useState(false)
  const [isWhatsAppChecked, setIsWhatsAppChecked] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { showToast, RenderToast } = useToast()
  const { funnelQuery } = useFunnelQueryData()
  const { t } = useTranslation()
  const enableNewLogin = useEnableNewLogin()
  const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  const [cityOtr] = useLocalStorage<CityOtrOption | null>(
    LocalStorageKey.CityOtr,
    null,
  )

  const autofillName = () => {
    if (contactFormData.nameTmp) {
      return contactFormData.nameTmp ?? ''
    } else {
      return contactFormData.name ?? ''
    }
  }

  const setCustomerDetail = (payload: any) => {
    const encryptedData = encryptValue(JSON.stringify(payload))
    saveLocalStorage(LocalStorageKey.sevaCust, encryptedData)
  }

  const checkDataCustomer = async () => {
    const data: string | null = getLocalStorage(LocalStorageKey.sevaCust)
    if (data === null) {
      getCustomerInfoSeva().then((response) => {
        if (Array.isArray(response.data)) {
          const customerData = response.data[0]
          setFullName(customerData.fullName)
          setCustomerDetail(customerData)
        }
      })
    } else {
      const decryptedData = JSON.parse(decryptValue(data))
      setFullName(decryptedData.fullName)
    }
  }

  const getCustomerFullName = () => {
    const token = getToken()
    if (token) {
      checkDataCustomer()
    } else {
      setFullName(autofillName())
    }
  }

  useEffect(() => {
    if (
      contactFormData.phoneNumber &&
      contactFormData.phoneNumber != 'undefined' &&
      contactFormData.phoneNumber?.toString().length > 3
    ) {
      const phoneNumber = String(contactFormData.phoneNumber)
      patchContactFormValue({
        [ContactFormKey.PhoneNumber]: phoneNumber,
      })
    } else {
      patchContactFormValue({
        [ContactFormKey.PhoneNumber]: ``,
      })
    }

    getCustomerFullName()
  }, [])
  const patchContactFormValue = useContextContactFormPatch()

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value[0] != ' ') {
      setFullName(event.target.value)
    }
  }
  const onCheckboxToggle = () => setIsWhatsAppChecked(!isWhatsAppChecked)

  useEffect(() => {
    setConfirmEnabled(
      fullName.trim().length > 0 &&
        isValidPhoneNumber(contactFormData.phoneNumberValid?.toString() ?? ''),
    )
  }, [fullName, contactFormData.phoneNumberValid])

  const onClickOK = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    setLoading(true)

    const phoneNumber = String(contactFormData.phoneNumberValid)
    patchContactFormValue({
      [ContactFormKey.PhoneNumber]: phoneNumber,
      [ContactFormKey.Name]: fullName,
    })

    if (enableNewLogin && !getToken()) {
      savePageBeforeLogin(window.location.pathname)
      if (onCheckLogin) {
        onCheckLogin()
      } else {
        router.push(LoginSevaUrl)
      }
      setLoading(false)
      return
    }

    createProbeTrack({
      utmCampaign: UTMTags?.utm_campaign || '',
      utmContent: UTMTags?.utm_content || '',
      adsetId: UTMTags?.adset || '',
      utmTerm: UTMTags?.utm_term || '',
      fullName: fullName,
      phoneNumber: phoneNumber,
      loanDownPayment: parseInt(funnelQuery.downPaymentAmount as string),
      utmSource: UTMTags?.utm_source || '',
    })
    createUnverifiedLeadNew({
      phoneNumber: phoneNumber,
      ...(funnelQuery.downPaymentAmount && {
        dp: parseInt(funnelQuery.downPaymentAmount as string),
      }),
      ...(funnelQuery.monthlyInstallment && {
        monthlyInstallment: parseInt(funnelQuery.monthlyInstallment as string),
      }),
      name: fullName,
      contactType: isWhatsAppChecked ? ContactType.whatsApp : ContactType.phone,
      origination: UnverifiedLeadSubCategory.SEVA_NEW_CAR_LP_LEADS_FORM,
      ...(cityOtr?.id && { cityId: cityOtr.id }),
    })
      .then(() => {
        setLoading(false)
        onSubmitSuccess(isWhatsAppChecked)
      })
      .catch(() => {
        setLoading(false)
        showToast()
      })

    trackSelectHomeSendDetails()
    trackGASubmitContactInfo()
    client && window.fbq('track', FBPixelStandardEvent.SendContactDetail)
  }

  return (
    <div className="wrapper-as">
      <div className="content-wrapper-as">
        <h3 className="title-as">Ngobrol langsung dengan agen kami</h3>
        <TextLargeRegular className="subtitle-as">
          Tulis rincian kontakmu supaya agen kami bisa segera menghubungi kamu.
        </TextLargeRegular>
        <div className="input-wrapper-as">
          <div className="tablet-as">
            <div className="input-container-as">
              <StyledInput
                data-testid={elementId.Homepage.ContactAgent.FullName}
                type={'text'}
                maxLength={100}
                placeholder={'Nama Lengkap'}
                value={fullName}
                onChange={onNameChange}
              />
            </div>
            <div className="form-phonenumber-wrapper-as">
              <FormPhoneNumber
                name={elementId.Homepage.ContactAgent.PhoneNumber}
                showDefaultLabel={false}
                disableAfterAutofillLoggedInUser={true}
              />
            </div>
          </div>
          <div className="mobile-checkbox-as">
            <div className="checkbox-as" onClick={onCheckboxToggle}>
              {isWhatsAppChecked ? (
                <CheckedSquareOutlined />
              ) : (
                <UncheckedSquareOutlined />
              )}
              <span className="checkbox-text-as">
                Saya memilih untuk dihubungi via WhatsApp
              </span>
            </div>
          </div>
          <div className="tablet-wa-as">
            <StyledButton
              disabled={!confirmEnabled}
              buttonType={ButtonType.primary1}
              onClick={onClickOK}
              loading={loading}
              height={'40px'}
              id="advisor-section-submit-button-element"
              data-testId={elementId.Homepage.ContactAgent.ButtonSend}
              className={'advisor-section-submit-button-element'}
            >
              <StyledButtonText>Kirim Rincian</StyledButtonText>
            </StyledButton>
          </div>
        </div>
        <div className="desktop-checkbox-as">
          <div className="checkbox-as" onClick={onCheckboxToggle}>
            {isWhatsAppChecked ? (
              <CheckedSquareOutlined />
            ) : (
              <UncheckedSquareOutlined />
            )}
            <span className="checkbox-text-as">
              Saya memilih untuk dihubungi via WhatsApp
            </span>
          </div>
        </div>
      </div>
      <RenderToast type={ToastType.Error} message={t('common.errorMessage')} />
    </div>
  )
}

const StyledButton = styled(Button)`
  height: 50px;
  background: ${colors.primary1};
  margin-left: auto;
  width: 100%;

  @media (min-width: 1025px) {
    width: 200px;
  }
`

const StyledButtonText = styled(TextMediumRegular)`
  color: ${colors.white};
  font-family: 'KanyonBold';

  @media (min-width: 1025px) {
    line-height: 20px;
  }
`
const StyledInput = styled(Input)`
  width: 103%;

  @media (min-width: 1025px) {
    width: 416px;
  }
`
