import { ArrowLeftOutlined } from 'components/atoms'
import React, { useEffect, useState } from 'react'
import styles from 'styles/components/molecules/refinancingFormHeader.module.scss'
import { LocalStorageKey } from 'utils/enum'
import { getCustomerInfoSeva } from 'utils/handler/customer'
import { decryptValue } from 'utils/handler/encryption'
import { getLocalStorage } from 'utils/handler/localStorage'
import { refinancingUrl } from 'utils/helpers/routes'
import { colors } from 'utils/helpers/style/colors'
const CircleImageBg = '/revamp/images/refinancing/circle-bg.webp'

type RefinancingFormHeaderProps = {
  checkSamePhonenumber: boolean
}

export const RefinancingFormHeader = ({
  checkSamePhonenumber,
}: RefinancingFormHeaderProps) => {
  const [fullName, setFullName] = useState('')

  const localFullName = getLocalStorage(LocalStorageKey.FullNameRefi)

  useEffect(() => {
    if (localFullName) {
      const decr = decryptValue(localFullName as string)
      if (checkSamePhonenumber) {
        setFullName(decr)
      } else {
        getCustomerInfoSeva().then((response) => {
          const customerName = response[0].fullName ?? ''
          setFullName(customerName)
        })
      }
    } else {
      getCustomerInfoSeva().then((response) => {
        const customerName = response[0].fullName ?? ''
        setFullName(customerName)
      })
    }
  }, [checkSamePhonenumber])

  return (
    <div className={styles.headerContainer}>
      <div className={styles.circleBg}>
        <img src={CircleImageBg} />
      </div>
      <div className={styles.headerWrapper}>
        <a className={styles.styledIcon} href={refinancingUrl}>
          <ArrowLeftOutlined color={colors.white} height={24} width={24} />
        </a>
        <span className={styles.greetingName}>Hi, {fullName}!</span>
        <span className={styles.formDesc}>
          Bantu kami melengkapi data di bawah ini, agar kamu mendapatkan
          informasi terbaik terkait Fasilitas Dana.
        </span>
      </div>
    </div>
  )
}
