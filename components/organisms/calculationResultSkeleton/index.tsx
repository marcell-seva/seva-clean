import React from 'react'
import styles from '../../../styles/components/organisms/calculationResultSkeleton.module.scss'
import { Button, IconWhatsapp } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import Image from 'next/image'
import { LogoAcc, LogoTaf } from '../calculationResult'
import SkeletonLC from 'components/atoms/skeletonLC'

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
        <span className={styles.dataHeaderText} style={{ marginRight: '14%' }}>
          Total DP<span className={styles.dataHeaderTextSmall}>*</span>
        </span>
        <span className={styles.dataHeaderText} style={{ marginRight: '7%' }}>
          Cicilan per bulan
          <span className={styles.dataHeaderTextSmall}>**</span>
        </span>
      </div>
      <div className={styles.skeletonCard}>
        <SkeletonLC isHeader={true}>
          <div className={styles.wrapperInside} />
        </SkeletonLC>
        <div className={styles.wrapperContent}>
          <div className={styles.wrapperSkeleton}>
            <SkeletonLC width={52} height={12} />
            <SkeletonLC width={60} height={9} />
          </div>
          <div className={styles.wrapperSkeleton}>
            <SkeletonLC width={93} height={12} />
            <SkeletonLC width={60} height={9} />
          </div>
          <div className={styles.wrapperSkeleton}>
            <SkeletonLC width={93} height={12} />
            <SkeletonLC width={60} height={9} />
          </div>
        </div>

        <div className={styles.wrapperBottom}>
          <div className={styles.wrapperSkeleton}>
            <SkeletonLC width={127} height={9} />
          </div>
        </div>
      </div>
      <div className={styles.wrapperContentUnselect}>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={48}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={93}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={93}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
      </div>
      <div className={styles.wrapperContentUnselect}>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={48}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={93}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={93}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
      </div>
      <div className={styles.wrapperContentUnselect}>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={48}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={93}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={93}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
      </div>
      <div className={styles.wrapperContentUnselect}>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={48}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={93}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
        </div>
        <div className={styles.wrapperSkeleton}>
          <SkeletonLC
            width={93}
            height={12}
            style={{ background: '#EBECEE' }}
          />
          <SkeletonLC width={60} height={9} style={{ background: '#EBECEE' }} />
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
