/* eslint-disable react/no-children-prop */
import React, { useEffect, useMemo, useState } from 'react'
import styles from 'styles/pages/perusahaan-pembiayaan.module.scss'
import {
  getSessionStorage,
  saveSessionStorage,
} from 'utils/handler/sessionStorage'
import { useProtectPage } from 'utils/hooks/useProtectPage/useProtectPage'
import { FormLCState } from 'pages/kalkulator-kredit/[[...slug]]'
import { SessionStorageKey } from 'utils/enum'
import { IconCheckedBox, IconChevronLeft } from 'components/atoms/icon'
import { instantApprovalReviewPage } from 'utils/helpers/routes'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import { ProgressBar } from 'components/atoms/progressBar'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { api } from 'services/api'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'

const LogoPrimary = '/revamp/icon/logo-primary.webp'
const LogoACC = '/revamp/icon/logo-acc.webp'
const LogoQuestionMark = '/revamp/icon/logo-question-mark.png'
const LogoTAF = '/revamp/icon/logo-taf.webp'

export interface Params {
  brand: string
  model: string
  tab: string
}

interface OptionProps {
  title: string
  desc?: string
  logo: any
  isActive?: boolean
  isDisabled?: boolean
  onClick: any
}
const LeasingCompanyOptionPage = ({
  meta: dataHead,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useProtectPage()
  const router = useRouter()
  const [descDisabledCard, setDescDisabledCard] = useState<string>()

  const head = useMemo(() => {
    const title =
      dataHead && dataHead.length > 0
        ? dataHead[0].attributes.meta_title
        : 'SEVA'
    const description =
      dataHead && dataHead.length > 0
        ? dataHead[0].attributes.meta_description
        : ''

    return { title, description }
  }, [dataHead])

  const [option, setOption] = useState<'none' | '' | 'acc' | 'taf'>('none')

  const [agreement, setAgreement] = useState<boolean>(false)
  const [isDisableTAF, setIsDisableTAF] = useState<boolean>(false)
  const [isFilled, setIsFilled] = useState<boolean>(false)
  const kkForm: FormLCState | null = getSessionStorage(
    SessionStorageKey.KalkulatorKreditForm,
  )

  const termsAndConditionsUrl = 'https://www.seva.id/info/syarat-dan-ketentuan/'
  const privacyPolicyUrl = 'https://www.seva.id/info/kebijakan-privasi/'
  const AgreementTerms: React.FC = (): JSX.Element => (
    <div className={styles.agreementTerms}>
      <div
        onMouseDown={() => setAgreement(!agreement)}
        className={styles.checkBox}
      >
        <IconCheckedBox isActive={agreement} width={16} height={16} />
      </div>
      <p className={styles.textOption}>
        Saya menyetujui{' '}
        <a
          className={styles.textRedirect}
          target="_blank"
          href={termsAndConditionsUrl}
          rel="noreferrer"
        >
          Syarat & Ketentuan
        </a>{' '}
        dan{' '}
        <a
          className={styles.textRedirect}
          target="_blank"
          href={privacyPolicyUrl}
          rel="noreferrer"
        >
          Kebijakan Privasi
        </a>{' '}
        SEVA serta data saya digunakan untuk pengajuan kredit.
      </p>
    </div>
  )

  const Option: React.FC<OptionProps> = ({
    title,
    desc,
    logo,
    isActive,
    isDisabled = false,
    onClick,
  }) => (
    <button
      className={`${styles.card} ${isActive && styles.active} ${
        isDisabled && styles.disabled
      }`}
      disabled={isDisabled}
      onClick={onClick}
    >
      <div className={styles.bundleLogo}>
        <Image
          src={logo}
          alt="acc-logo"
          width={40}
          height={40}
          className={styles.logo}
        />
      </div>
      <div className={styles.content}>
        <p className={styles.titleText}>{title}</p>
        {desc !== '' && <p className={styles.descText}>{desc}</p>}
      </div>
    </button>
  )

  const handleSetOption = (type: 'none' | '' | 'acc' | 'taf') => {
    if (option === type) {
      setOption('none')
    } else {
      setOption(type)
    }
  }

  const proceedFinancing = () => {
    const data = {
      ...kkForm,
      leasingOption: option,
    }
    saveSessionStorage(
      SessionStorageKey.KalkulatorKreditForm,
      JSON.stringify(data),
    )
    router.push(instantApprovalReviewPage)
  }

  useEffect(() => {
    if (kkForm !== null) {
      const brand = kkForm.model?.brandName
      if (brand === 'Isuzu' || brand === 'Peugeot' || brand === 'BMW') {
        setIsDisableTAF(true)
        setDescDisabledCard(
          'Perusahaan ini belum bisa digunakan untuk mobil yang kamu pilih.',
        )
      }
    }
  }, [])

  useEffect(() => {
    if (agreement && option !== 'none') setIsFilled(true)
    else setIsFilled(false)
  }, [agreement, option])

  return (
    <>
      <Seo
        title={head.title}
        description={head.description}
        image={defaultSeoImage}
      />

      <div className={styles.container}>
        <div>
          <div className={styles.formHeader}>
            <div className={styles.backButton} onClick={() => router.back()}>
              <IconChevronLeft width={24} height={24} color="#13131B" />
            </div>
            <Image className={styles.logoHeader} src={LogoPrimary} alt="back" />
          </div>
          <ProgressBar percentage={87} colorPrecentage="#51A8DB" />
        </div>
        <h2 className={styles.headerText}>Pilih Perusahaan Pembiayaan</h2>
        <Option
          isActive={option === ''}
          onClick={() => handleSetOption('')}
          logo={LogoQuestionMark}
          title="Saya tidak memiliki preferensi"
        />
        <Option
          isActive={option === 'acc'}
          onClick={() => handleSetOption('acc')}
          logo={LogoACC}
          title="ACC (Astra Credit Companies)"
        />
        <Option
          isDisabled={isDisableTAF}
          isActive={option === 'taf'}
          onClick={() => handleSetOption('taf')}
          logo={LogoTAF}
          title="TAF (Toyota Astra Finance)"
          desc={descDisabledCard}
        />
        <AgreementTerms />
        <div className={styles.button}>
          <Button
            disabled={!isFilled}
            version={
              isFilled ? ButtonVersion.PrimaryDarkBlue : ButtonVersion.Disable
            }
            size={ButtonSize.Big}
            onClick={() => proceedFinancing()}
          >
            Lanjutkan
          </Button>
        </div>
      </div>
    </>
  )
}
export default LeasingCompanyOptionPage

export const getServerSideProps = async (ctx: any) => {
  const model = (ctx.query.model as string)?.replaceAll('-', '')

  try {
    const [meta]: any = await Promise.all([api.getMetaTagData(model as string)])
    return { props: { meta: meta.data } }
  } catch (e) {
    return { props: { meta: {} } }
  }
}
