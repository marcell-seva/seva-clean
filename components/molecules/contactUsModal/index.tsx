import { IconClose, UncheckedSquareOutlined } from 'components/atoms'
import { ButtonType, Button } from 'components/atoms/ButtonOld/Button'
import { CheckedSquareOutlined } from 'components/atoms/icon/CheckedSquareOutlined'
import { Contact } from 'components/atoms/icon/Contact'
import { useModal } from 'components/atoms/ModalOld/Modal'
import { LinkLabelLargeSemiBold } from 'components/atoms/typography/LinkLabelLargeSemiBold'
import { useToast, ToastType } from 'components/organism/Toast'
import {
  useContextContactFormData,
  useContextContactFormPatch,
} from 'context/contactFormContext/contactFormContext'
import { useFunnelQueryData } from 'context/funnelQueryContext/funnelQueryContext'
import { useModalContext } from 'context/modalContext/modalContext'
import elementId from 'helpers/elementIds'
import { FBPixelStandardEvent } from 'helpers/facebookPixel'
import { useRouter } from 'next/router'
import { ChangeEvent, HTMLAttributes, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive'
import { LoginSevaUrl } from 'routes/routes'
import { getCustomerInfoWrapperSeva } from 'services/customer'
import { trackGASubmitContactInfo } from 'services/googleAds'
import { createUnverifiedLeadNew } from 'services/lead'
import { createProbeTrack } from 'services/probe'
import styled from 'styled-components'
import { colors } from 'styles/colors'
import {
  maxPageWidth,
  maxPageWidthNumber,
  screenWidth,
} from 'styles/globalStyle'
import { getToken } from 'utils/api'
import { decryptValue, encryptValue } from 'utils/encryptionUtils'
import {
  ContactType,
  LocalStorageKey,
  UnverifiedLeadSubCategory,
} from 'utils/enum'
import { useEnableNewLogin } from 'utils/hooks/useEnableNewLogin'
import { useLocalStorage } from 'utils/hooks/useLocalStorage/useLocalStorage'
import { getLocalStorage, saveLocalStorage } from 'utils/localstorageUtils'
import { savePageBeforeLogin } from 'utils/loginUtils'
import { ContactFormKey } from 'utils/models/models'
import { isValidPhoneNumber } from 'utils/numberUtils/numberUtils'
import { CityOtrOption, UTMTagsData } from 'utils/types/utils'
import { TextSmallRegular } from 'utils/typography/TextSmallRegular'
import { useDialogModal } from '../dialogModal'
import { FormPhoneNumber } from '../formPhoneNumber/FormPhoneNumber'
// import ReactPixel from 'react-facebook-pixel'
import { ZIndex } from 'styles/zIndex'
import { Input } from 'components/atoms/OldInput/Input'

interface ContactUsFloatingComponentProps
  extends HTMLAttributes<HTMLDivElement> {
  title: string
}

export enum OriginationLeads {
  CarOfMonth = 'Car Of Month',
  CarVariantList = 'Car Variant List',
}
interface ContactUsModalProps {
  title: string
  onSubmitSuccess: () => void
  onCheckLogin?: () => void
  originationLeads?: OriginationLeads
  carVariantData?: {
    brand: string
    model: string
    dp: number
    monthlyInstallment?: number
    tenure?: number
  }
}

export const ContactUsFloatingComponent = ({
  title,
  ...restProps
}: ContactUsFloatingComponentProps) => {
  const { ContactUsModal, showModal } = useContactUsModal()
  const { DialogModal, showModal: showDialogModal } = useDialogModal()
  const { t } = useTranslation()

  return (
    <StyledContactUsContainer {...restProps} onClick={showModal}>
      <Contact />
      <ContactUsModal title={title} onSubmitSuccess={showDialogModal} />
      <DialogModal
        title={t('homePageSearch.advisor.thanksTitle')}
        desc={t('homePageSearch.advisor.thanksDesc')}
        confirmButtonText={t('homePageSearch.advisor.alertButton')}
      />
    </StyledContactUsContainer>
  )
}

export const useContactUsModal = () => {
  const { showModal, hideModal, RenderModal } = useModal()
  const router = useRouter()
  const patchContactFormValue = useContextContactFormPatch()
  const contactFormData = useContextContactFormData()
  const token = getToken()
  const UTMTags = getLocalStorage<UTMTagsData>(LocalStorageKey.UtmTags)
  const [phoneNumberInitialValue, setPhoneNumberInitialValue] = useState(
    contactFormData.phoneNumberValid,
  )

  useEffect(() => {
    const checkDataCustomer = async () => {
      const data: string | null = getLocalStorage(LocalStorageKey.sevaCust)
      if (data === null) {
        getCustomerInfoWrapperSeva().then((response: any) => {
          if (Array.isArray(response.data)) {
            const customer = response.data[0]
            setPhoneNumberInitialValue(customer.phoneNumber)
            setCustomerDetail(customer)
            patchContactFormValue({
              [ContactFormKey.Name]: customer.fullName,
              [ContactFormKey.NameTmp]: customer.fullName,
            })
            if (
              !contactFormData.phoneNumber ||
              contactFormData.phoneNumber.length < 4
            ) {
              patchContactFormValue({
                [ContactFormKey.PhoneNumber]: customer.phoneNumber,
              })
            }
          }
        })
      } else {
        const decryptedData = JSON.parse(decryptValue(data))
        setCustomerDetail(decryptedData)
        patchContactFormValue({
          [ContactFormKey.Name]: decryptedData.fullName,
          [ContactFormKey.NameTmp]: decryptedData.fullName,
        })
        if (
          !contactFormData.phoneNumber ||
          contactFormData.phoneNumber.length < 4
        ) {
          patchContactFormValue({
            [ContactFormKey.PhoneNumber]: decryptedData.phoneNumber,
          })
        }
      }
    }

    if (token) {
      checkDataCustomer()
    }
  }, [])

  const setCustomerDetail = (payload: any) => {
    const encryptedData = encryptValue(JSON.stringify(payload))
    saveLocalStorage(LocalStorageKey.sevaCust, encryptedData)
  }

  const ContactUsModal = ({
    title,
    onSubmitSuccess,
    onCheckLogin,
    originationLeads,
    carVariantData,
  }: ContactUsModalProps) => {
    const fitLandscapeHeight = useMediaQuery({ query: '(max-height: 450px)' })
    const customerName = getLocalStorage(LocalStorageKey.CustomerName)
    const currentCOMCar = getLocalStorage<{
      Car_Brand: string
      Car_Model: string
    }>(LocalStorageKey.CurrentCarOfTheMonthItem)
    const autofillName = () => {
      if (contactFormData.nameTmp) {
        return contactFormData.nameTmp ?? ''
      } else {
        return contactFormData.name ?? ''
      }
    }
    const [fullName, setFullName] = useState<string>(autofillName())
    const [phoneNumber, setPhoneNumber] = useState(
      contactFormData.phoneNumberValid,
    )
    const [confirmEnabled, setConfirmEnabled] = useState(false)
    const [isWhatsAppChecked, setIsWhatsAppChecked] = useState(false)

    const [loading, setLoading] = useState<boolean>(false)
    const { showToast, RenderToast } = useToast()
    const { funnelQuery } = useFunnelQueryData()
    const { t } = useTranslation()
    const { patchModal } = useModalContext()
    const enableNewLogin = useEnableNewLogin()
    const [cityOtr] = useLocalStorage<CityOtrOption | null>(
      LocalStorageKey.CityOtr,
      null,
    )

    const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.value[0] != ' ') {
        setFullName(event.target.value)
      }
    }

    const onCheckboxToggle = () => setIsWhatsAppChecked(!isWhatsAppChecked)

    useEffect(() => {
      if (token && customerName) {
        const decryptCustomerName = decryptValue(customerName as string)
        setFullName(decryptCustomerName)
      } else {
        setFullName(autofillName())
      }
    }, [])

    useEffect(() => {
      if (!fullName || fullName[0] === ' ') return setConfirmEnabled(false)
      setConfirmEnabled(
        fullName.trim().length > 0 &&
          isValidPhoneNumber(phoneNumber?.toString() ?? ''),
      )
    }, [fullName, phoneNumber])

    const originationKey = () => {
      if (originationLeads === OriginationLeads.CarVariantList) {
        return UnverifiedLeadSubCategory.SEVA_NEW_CAR_PDP_LEADS_FORM
      }

      if (originationLeads === OriginationLeads.CarOfMonth) {
        return UnverifiedLeadSubCategory.SEVA_NEW_CAR_CAR_OF_THE_MONTH
      }

      return UnverifiedLeadSubCategory.SEVA_NEW_CAR_LP_LEADS_FORM
    }

    const onClickOK = (e: React.MouseEvent | React.KeyboardEvent) => {
      e.stopPropagation()
      setLoading(true)

      patchContactFormValue({
        [ContactFormKey.PhoneNumber]: phoneNumber,
        [ContactFormKey.PhoneNumberValid]: phoneNumber,
        [ContactFormKey.Name]: fullName,
      })
      if (enableNewLogin && !getToken()) {
        savePageBeforeLogin(window.location.pathname)
        if (onCheckLogin) {
          patchModal({ isOpenContactUsModal: true })
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
        phoneNumber: phoneNumber as string,
        origination: originationKey(),
        ...(funnelQuery.downPaymentAmount && {
          dp: parseInt(funnelQuery.downPaymentAmount as string),
        }),
        ...(funnelQuery.monthlyInstallment && {
          monthlyInstallment: parseInt(
            funnelQuery.monthlyInstallment as string,
          ),
        }),
        name: fullName,
        contactType: isWhatsAppChecked
          ? ContactType.whatsApp
          : ContactType.phone,
        ...(originationLeads === OriginationLeads.CarOfMonth &&
          currentCOMCar !== undefined && {
            carBrand: currentCOMCar?.Car_Brand || '',
            carModelText: currentCOMCar?.Car_Model || '',
          }),
        ...(originationLeads === OriginationLeads.CarVariantList && {
          carBrand: carVariantData?.brand,
          carModelText: carVariantData?.model,
          dp: carVariantData?.dp,
          monthlyInstallment: carVariantData?.monthlyInstallment,
          tenure: carVariantData?.tenure,
        }),
        ...(cityOtr?.id && { cityId: cityOtr.id }),
      })
        .then(() => {
          setLoading(false)
          hideModal()
          patchModal({ isOpenContactUsModal: false })
          onSubmitSuccess()
        })
        .catch(() => {
          setLoading(false)
          showToast()
        })

      trackGASubmitContactInfo()
      // TODO
      // ReactPixel.track(FBPixelStandardEvent.SendContactDetail)
    }

    const onClickCancel = (e: React.MouseEvent) => {
      e.stopPropagation()
      hideModal()
      patchModal({ isOpenContactUsModal: false })
    }

    return (
      <>
        <RenderModal blur={'0px'} transparent={false}>
          <StyledWrapper>
            <StyledContent>
              <StyledCloseIcon onClick={onClickCancel}>
                {/* TODO width height */}
                <IconClose
                  color={colors.primary1}
                  width={fitLandscapeHeight ? 15 : 24}
                  height={fitLandscapeHeight ? 15 : 24}
                />
              </StyledCloseIcon>
              <StyledTitle>{title}</StyledTitle>
              <StyledDesc>{t('contactUs.shareContactDetails')}</StyledDesc>
              <StyledSpacing />
              <Input
                data-testid={elementId.InstantApproval.PopupName}
                type={'text'}
                maxLength={100}
                placeholder={t('homePageSearch.advisor.fullName')}
                value={fullName}
                onChange={onNameChange}
              />
              <StyledSpacing />
              <FormPhoneNumber
                name={elementId.InstantApproval.PopupPn}
                showDefaultLabel={false}
                global={false}
                initialValue={phoneNumberInitialValue}
                onChange={(value) => {
                  setPhoneNumber(value)
                }}
                disabled={
                  token !== null &&
                  phoneNumberInitialValue !== undefined &&
                  phoneNumberInitialValue.length > 0
                }
              />
              <StyledSpacing />
              <StyledCheckbox
                data-testid={elementId.InstantApproval.CheckboxWA}
                onClick={onCheckboxToggle}
              >
                {isWhatsAppChecked ? (
                  <CheckedSquareOutlined />
                ) : (
                  <UncheckedSquareOutlined />
                )}
                <StyledCheckboxText>
                  {t('contactUs.contactOnWhatsApp')}
                </StyledCheckboxText>
              </StyledCheckbox>
              <StyledButton
                data-testid={elementId.InstantApproval.ButtonSendDetails}
                id="contact-us-modal-submit-button-element"
                className="contact-us-modal-submit-button-element"
                disabled={!confirmEnabled}
                buttonType={ButtonType.primary1}
                onClick={onClickOK}
                loading={loading}
              >
                {t('contactUs.confirmBtn')}
              </StyledButton>
            </StyledContent>
            <RenderToast
              type={ToastType.Error}
              message={t('common.errorMessage')}
            />
          </StyledWrapper>
        </RenderModal>
      </>
    )
  }
  return { ContactUsModal, hideModal, showModal }
}

const rightPadding = Math.max((screenWidth - maxPageWidthNumber) / 2, 0) + 16
const StyledContactUsContainer = styled.div`
  position: fixed;
  right: ${rightPadding}px;
  bottom: 16px;
  z-index: ${ZIndex.Modal};
`

const StyledWrapper = styled.div`
  width: ${maxPageWidth};
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
  padding: 0 16px;
  margin: auto;
  @media (max-height: 450px) {
    width: 500px;
    height: 50%;
  }
`

const StyledContent = styled.div`
  border-radius: 16px;
  text-align: center;
  flex: 1;
  padding: 20px 24px 10px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: ${colors.white};
  @media (max-height: 450px) {
    padding: 10px 14px;
  }
`

const StyledTitle = styled(LinkLabelLargeSemiBold)`
  color: ${colors.title};
  margin-top: 12px;
  @media (max-height: 450px) {
    font-size: 16px;
    line-height: 20px;
  }
`

const StyledDesc = styled(TextSmallRegular)`
  color: ${colors.label};
  margin-top: 10px;
  @media (max-height: 450px) {
    font-size: 12px;
    line-height: 16px;
  }
`

const StyledSpacing = styled.div`
  height: 16px;
  @media (max-height: 450px) {
    height: 8px;
  }
`

const StyledButton = styled(Button)`
  width: 100%;
  margin-top: 22px;
  margin-bottom: 12px;
  @media (max-height: 450px) {
    height: 40px;
    margin-top: 16px;
  }
`

const StyledCloseIcon = styled.div`
  display: flex;
  align-self: flex-end;
`

const StyledCheckbox = styled.div`
  margin-top: 10px;
  border-radius: 4px;
  display: flex;
  align-items: center;
`

const StyledCheckboxText = styled(TextSmallRegular)`
  color: ${colors.label};
  margin-left: 8px;
  text-align: left;
  @media (max-height: 450px) {
    font-size: 12px;
  }
`
