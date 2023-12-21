import React, { useState } from 'react'
import styles from 'styles/components/molecules/headerRefinancing.module.scss'
import { useRouter } from 'next/router'
import { useContextContactFormData } from 'services/context/contactFormContext'
import { LocalStorageKey } from 'utils/enum'
import { getToken } from 'utils/handler/auth'
import { encryptValue } from 'utils/handler/encryption'
import { saveLocalStorage } from 'utils/handler/localStorage'
import { refinancingFormUrl } from 'utils/helpers/routes'
import { sendRefiContact } from 'utils/httpUtils/customerUtils'
import ModelImageBg from '/public/revamp/images/refinancing/model.webp'
import Image from 'next/image'
import { Button } from 'components/atoms'
import elementId from 'helpers/elementIds'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

interface headerForm {
  onSubmitted?: (value: boolean) => void
  onButtonClick?: (value: boolean) => void
}
export const HeaderRefinancing = ({
  onSubmitted,
  onButtonClick,
}: headerForm) => {
  const router = useRouter()
  const contactFormData = useContextContactFormData()
  const [loading, setLoading] = useState<boolean>(false)
  const gotoFasilitasDana = async () => {
    onButtonClick && onButtonClick(true)
    if (getToken() !== null) {
      setLoading(true)
      sendRefiContact(
        contactFormData?.phoneNumber,
        contactFormData?.name,
        'SEVA_REFINANCING_LEADS',
        getToken() !== null ? true : false,
      ).then((result) => {
        saveLocalStorage(
          LocalStorageKey.IdCustomerRefi,
          encryptValue(result?.data.id),
        )
        setLoading(false)
        router.push(refinancingFormUrl)
      })
    } else {
      onSubmitted && onSubmitted(true)
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.circleBg} />
      <div className={styles.modelBg}>
        <Image
          width={230}
          height={206}
          className={styles.modelImage}
          src={ModelImageBg}
          alt="model-refinancing-header"
        />
      </div>
      <div className={styles.wrapper}>
        <div className={styles.contentWrapper}>
          <span className={styles.title}>Fasilitas Dana</span>
          <span className={styles.desc}>
            Solusi untuk kebutuhan dana langsung cair dengan jaminan BPKB mobil
          </span>
          <Button
            data-testid={elementId.Refinancing.ButtonApplyNow}
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            secondaryClassName={styles.styledButton}
            onClick={gotoFasilitasDana}
            loading={loading}
          >
            <span className={styles.buttonText}>Ajukan Sekarang</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
