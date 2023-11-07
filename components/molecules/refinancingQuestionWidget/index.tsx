import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import {
  useContextContactFormData,
  useContextContactFormPatch,
} from 'services/context/contactFormContext'
import styles from 'styles/components/molecules/refinancingQuestionWidget.module.scss'
import { LocalStorageKey } from 'utils/enum'
import { getToken } from 'utils/handler/auth'
import { encryptValue } from 'utils/handler/encryption'
import { getLocalStorage, saveLocalStorage } from 'utils/handler/localStorage'
import { sendRefiContact } from 'utils/httpUtils/customerUtils'
import QuestionWidgetImage from 'public/revamp/images/refinancing/QuestionWidgetImage.webp'
import dynamic from 'next/dynamic'
import { getCustomerInfoWrapperSeva } from 'utils/handler/customer'
import { ContactFormKey } from 'utils/types/models'

const FormModal = dynamic(
  () => import('components/molecules/formModal').then((mod) => mod.FormModal),
  { ssr: false },
)

export const RefinancingQuestionWidget = () => {
  const [isShowModalForm, setIsShowModalForm] = useState(false)
  const isModalFormOpen = getLocalStorage<string>(
    LocalStorageKey.refinancingOpenForm,
  )

  const contactFormData = useContextContactFormData()
  const patchContactFormValue = useContextContactFormPatch()

  useEffect(() => {
    if (isModalFormOpen) {
      setIsShowModalForm(true)
    }

    const token = getToken()
    if (token) {
      getCustomerInfoWrapperSeva().then((response: any) => {
        if (Array.isArray(response)) {
          const customer = response[0]
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
    }
  }, [])
  const onClickWidget = () => {
    if (!getToken()) {
      setIsShowModalForm(true)
    } else {
      sendRefiContact(
        contactFormData.phoneNumber,
        contactFormData.name,
        'SEVA_REFINANCING_QUESTION',
        true,
      ).then((result) => {
        saveLocalStorage(
          LocalStorageKey.IdCustomerRefi,
          encryptValue(JSON.stringify(result?.data.id)),
        )
      })
      setIsShowModalForm(true)
      saveLocalStorage(LocalStorageKey.refinancingOpenForm, 'true')
    }
  }

  return (
    <div className={styles.container}>
      <Image
        width={328}
        height={103}
        className={styles.styledImg}
        alt="Fasilitas Dana Question Widget"
        src={QuestionWidgetImage}
        onClick={onClickWidget}
      />
      <FormModal
        isOpen={isShowModalForm}
        onClose={() => setIsShowModalForm(false)}
        title={'Kami akan segera menjawab pertanyaanmu melalui telepon'}
      />
    </div>
  )
}
