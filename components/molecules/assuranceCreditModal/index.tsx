import React, { useEffect } from 'react'
import styles from 'styles/components/molecules/assuranceModal.module.scss'
import { Button } from 'components/atoms'
import { ButtonVersion } from 'components/atoms/button'
import { ButtonSize } from 'components/atoms/button'
import { getToken } from 'utils/handler/auth'
import { LoginSevaUrl, creditQualificationUrl } from 'utils/helpers/routes'
import { savePageBeforeLogin } from 'utils/loginUtils'
import { IconClose } from 'components/atoms'
import { FormLCState, SpecialRateList } from 'utils/types/utils'
import elementId from 'helpers/elementIds'
import { SessionStorageKey } from 'utils/enum'
import { LoanRank } from 'utils/types/models'
import { saveSessionStorage } from 'utils/handler/sessionStorage'
import { navigateToKK } from 'utils/navigate'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { Divider } from 'antd'
const Modal = dynamic(() => import('antd/lib/modal'), { ssr: false })

const MainImage = '/revamp/illustration/loan-calculator.webp'

interface AssuranceCreditModalProps {
  onClickCloseButton: () => void
  isOpen: boolean
  formData: FormLCState
  selectedLoan: SpecialRateList | null
  onClickCta?: () => void
}

export const AssuranceCreditModal: React.FC<AssuranceCreditModalProps> = ({
  onClickCloseButton,
  isOpen,
  formData,
  selectedLoan,
  onClickCta,
}) => {
  const [isLogin] = React.useState(!!getToken())

  const text = [
    {
      title: 'Asuransi Comprehensive',
      content:
        'Comprehensive menjamin Partial Loss + Total Loss, yaitu memberikan jaminan kerugian/kerusakan sebagian dan keseluruhan yang diakibatkan oleh semua risiko yang dijamin dalam polis asuransi kendaraan bermotor termasuk kehilangan akibat pencurian dengan tambahan fitur dan layanan yang lebih lengkap.',
    },
    {
      title: 'Asuransi Total Loss Only (TLO)',
      content:
        'Total Loss Only menjamin Total Loss Accident + Total Loss Stolen yaitu memberikan jaminan atas kerugian/kerusakan di mana biaya perbaikan ≥ 75% dari harga kendaraan sesaat sebelum kerugian dan kehilangan mobil akibat pencurian.',
    },
  ]

  const getLoanRank = (rank: string) => {
    if (rank === LoanRank.Green) {
      return 'Mudah'
    } else if (rank === LoanRank.Red) {
      return 'Sulit'
    }

    return ''
  }

  const handleClickCredit = () => {
    saveSessionStorage(
      SessionStorageKey.KalkulatorKreditForm,
      JSON.stringify(formData),
    )
    saveSessionStorage(SessionStorageKey.PreviousSourceSectionLogin, 'Null')
    onClickCta && onClickCta()
    if (isLogin) {
      navigateToKK(true)
    } else {
      saveSessionStorage(
        SessionStorageKey.PageReferrerLoginPage,
        'PDP - Kredit',
      )
      savePageBeforeLogin(creditQualificationUrl)
      window.location.href = LoginSevaUrl
    }
  }

  useEffect(() => {
    // Cek jika pengguna sudah login dan ada URL halaman instantApproval
    if (isLogin && window.location.href === LoginSevaUrl) {
      // Arahkan pengguna ke halaman instantApproval setelah login
      savePageBeforeLogin(creditQualificationUrl)
    }
  }, [isLogin])

  return (
    <Modal
      centered
      className={'qualification-custom-modal'}
      open={isOpen}
      footer={null}
      onCancel={onClickCloseButton}
      closeIcon={<div></div>}
      data-testid={elementId.LoanCalculator.Popup.KualifikasiKredit}
      maskStyle={{
        background: 'rgba(19, 19, 27, 0.5)',
        maxWidth: '570px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <p className={styles.modalTitle}>Asuransi</p>
      <div className={styles.modalContent}>
        <div>
          <h3 className={styles.textTitle}>{text[0].title}</h3>
          <p className={styles.textContent}>{text[0].content}</p>
        </div>
        <Divider className={styles.divider} />
        <div>
          <h3 className={styles.textTitle}>{text[1].title}</h3>
          <p className={styles.textContent}>{text[1].content}</p>
        </div>
      </div>
      <Button
        version={ButtonVersion.PrimaryDarkBlue}
        size={ButtonSize.Big}
        onClick={onClickCloseButton}
        data-testid={elementId.LoanCalculator.Button.PopupKualifikasiKredit}
      >
        Oke, Saya Mengerti
      </Button>
    </Modal>
  )
}
