import React from 'react'
import styles from '../../../styles/components/organisms/calculationResultSkeleton.module.scss'
import { Button, IconWhatsapp, Skeleton } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Image from 'next/image'

const LogoAcc = '/revamp/icon/logo-acc.webp'
const LogoTaf = '/revamp/icon/logo-taf.webp'

const Shimmer = '/revamp/illustration/placeholder.gif'

const renderDisclaimer = () => {
  return (
    <div className={styles.disclaimerWrapper}>
      <span className={styles.disclaimerText}>
        *Total DP: DP + Administrasi + Cicilan Pertama + Polis.
        <br />
        **Cicilan per bulan: Sudah termasuk cicilan dan premi asuransi mobil.
        <br />
        Perhitungan kredit ini disediakan oleh ACC dan TAF, serta dapat berubah
        sewaktu-waktu.
      </span>
    </div>
  )
}

const renderLogoFinco = () => {
  return (
    <div className={styles.logoFincoWrapper}>
      <Image
        src={LogoAcc}
        width={24.24}
        height={32}
        className={styles.logoAcc}
        alt="logo acc"
      />
      <Image
        src={LogoTaf}
        width={37}
        height={19}
        className={styles.logoTaf}
        alt="logo taf"
      />
    </div>
  )
}
export const CalculationResultSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.dataHeaderWrapper}>
        <span className={`${styles.dataHeaderText} ${styles.tenorHeader}`}>
          Tenor
        </span>
        <span className={styles.dataHeaderText}>Total DP*</span>
        <span className={styles.dataHeaderText}>Cicilan per bulan**</span>
      </div>
      <div className={styles.skeletonCard}>
        <div
          className={styles.skeletonHead}
          style={{ backgroundImage: `url(${Shimmer})` }}
        >
          <div className={styles.wrapperInside} />
        </div>
        <div className={styles.wrapperContent}>
          <div className={styles.wrapperSkeleton}>
            <Skeleton width={52} height={20} />
            <Skeleton width={77} height={12} />
          </div>
          <div className={styles.wrapperSkeleton}>
            <Skeleton width={81} height={20} />
            <Skeleton width={47} height={12} />
          </div>
          <div className={styles.wrapperSkeleton}>
            <Skeleton width={81} height={20} />
            <Skeleton width={47} height={12} />
          </div>
        </div>

        <div className={styles.wrapperBottom}>
          <div className={styles.wrapperSkeleton}>
            <Skeleton width={127} height={15} />
          </div>
        </div>
      </div>
      <div className={styles.wrapperContentUnselect}>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={62} height={20} />
          <Skeleton width={87} height={15} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={101} height={20} />
          <Skeleton width={67} height={15} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={101} height={20} />
          <Skeleton width={67} height={15} />
        </div>
      </div>
      <div className={styles.wrapperContentUnselect}>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={62} height={20} />
          <Skeleton width={87} height={15} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={101} height={20} />
          <Skeleton width={67} height={15} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={101} height={20} />
          <Skeleton width={67} height={15} />
        </div>
      </div>
      <div className={styles.wrapperContentUnselect}>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={62} height={20} />
          <Skeleton width={87} height={15} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={101} height={20} />
          <Skeleton width={67} height={15} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={101} height={20} />
          <Skeleton width={67} height={15} />
        </div>
      </div>
      <div className={styles.wrapperContentUnselect}>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={62} height={20} />
          <Skeleton width={87} height={15} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={101} height={20} />
          <Skeleton width={67} height={15} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <Skeleton width={101} height={20} />
          <Skeleton width={67} height={15} />
        </div>
      </div>
      <div className={styles.wrapperButton}>
        <Button version={ButtonVersion.PrimaryDarkBlue} size={ButtonSize.Big}>
          {'Cek Kualifikasi Kredit'}
        </Button>
        <Button version={ButtonVersion.Secondary} size={ButtonSize.Big}>
          <div className={styles.whatsappCtaTextWrapper}>
            <IconWhatsapp width={16} height={16} />
            Hubungi Agen SEVA
          </div>
        </Button>
      </div>
      {renderDisclaimer()}
      {renderLogoFinco()}
    </div>
  )
}
