import React, { useEffect, useState } from 'react'
import styles from 'styles/pages/ktp-verifikasi.module.scss'
import elementId from 'helpers/elementIds'
import { colors } from 'styles/colors'
import { useRouter } from 'next/router'
import { useQuery } from 'utils/hooks/useQuery'
import { useGalleryContext } from 'services/context/galleryContext'
import {
  cameraKtpUrl,
  formKtpUrl,
  uploadKtpSpouseQueryParam,
} from 'utils/helpers/routes'
import { Button, IconChevronLeft, Toast } from 'components/atoms'
import { ProgressBar } from 'components/atoms/progressBar'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import { IconLockFill } from 'components/atoms/icon/LockFill'
import PopupError from 'components/organisms/popupError'
import { DocumentType, UploadDataKey } from 'utils/enum'
import Seo from 'components/atoms/seo'
import { defaultSeoImage } from 'utils/helpers/const'
import Image from 'next/image'

import { getToken } from 'utils/handler/auth'
import { postUploadKTPFile } from 'services/api'

const LogoPrimary = '/revamp/icon/logo-primary.webp'

const VerifyKtp = () => {
  const router = useRouter()
  const { ktpType }: { ktpType: string } = useQuery(['ktpType'])
  const [toast, setToast] = useState('')
  const [isModalOpen, setIsModalOpen] = useState({
    status: false,
    action: '',
  })
  const { galleryFile, photoFile } = useGalleryContext()

  const file = photoFile

  useEffect(() => {
    galleryFile ?? router.push(cameraKtpUrl)
  }, [])

  const getTitleText = () => {
    if (ktpType && ktpType.toLowerCase() === 'spouse') {
      return 'Foto KTP Pasangan'
    } else {
      return 'Foto KTP'
    }
  }

  const getSubtitleText = () => {
    if (ktpType && ktpType.toLowerCase() === 'spouse') {
      return 'Pastikan foto KTP pasanganmu terlihat jelas dan bisa dibaca.'
    } else {
      return 'Pastikan foto KTP terlihat jelas dan bisa dibaca.'
    }
  }

  const buildFileKTPData = (file: File, fileType: DocumentType) => {
    const formData = new FormData()
    formData.append(UploadDataKey.File, file)
    formData.append(UploadDataKey.FileType, fileType)
    return formData
  }

  const detectText = () => {
    if (file) {
      postUploadKTPFile(buildFileKTPData(file, DocumentType.KTP), {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: getToken()?.idToken,
        },
      })
        .then((response) => {
          localStorage.setItem('formKtp', JSON.stringify(response.data))
          if (ktpType && ktpType.toLowerCase() === 'spouse') {
            router.push(formKtpUrl + uploadKtpSpouseQueryParam)
          } else {
            router.push(formKtpUrl)
          }
        })
        .catch((e) => {
          if (
            e.response.data.message &&
            e.response.data.message.includes('OCR check failed')
          ) {
            setIsModalOpen({ status: true, action: 'cant_read' })
          } else {
            setIsModalOpen({ status: true, action: 'double_nik' })
          }
        })
    }
  }

  return (
    <>
      <Seo
        title="SEVA - Beli Mobil Terbaru Dengan Cicilan Kredit Terbaik"
        description="Beli mobil terbaru dari Toyota, Daihatsu, BMW dengan Instant Approval*. Proses Aman & Mudah✅ Terintegrasi dengan ACC & TAF✅ SEVA member of ASTRA"
        image={defaultSeoImage}
      />
      <div className={styles.form_header}>
        <div className={styles.back__button} onClick={() => router.back()}>
          <IconChevronLeft width={24} height={24} color="#13131B" />
        </div>
        <div className={styles.logo}>
          <Image
            src={LogoPrimary}
            alt="back"
            style={{ width: '58px', height: '34px', objectFit: 'contain' }}
          />
        </div>
        <main className={styles.wrapper}>
          <section className={styles.wrapper__form}>
            <ProgressBar percentage={50} colorPrecentage="#51A8DB" />
            <div className={styles.ktp__page__title}>
              <h2 className={`medium ${styles.info} ${styles.titleText}`}>
                {getTitleText()}
              </h2>
              <span className={styles.light__text}>{getSubtitleText()}</span>
            </div>
            <Image
              src={galleryFile || ''}
              alt="KTP Image"
              className={styles.ktp__preview__image}
            />
            <div className={styles.wrapper__button}>
              <Button
                version={ButtonVersion.Outline}
                size={ButtonSize.Big}
                onClick={() => router.back()}
                data-testid={elementId.Profil.Button.FotoUlang}
              >
                Foto Ulang
              </Button>
              <Button
                version={ButtonVersion.SecondaryDark}
                size={ButtonSize.Big}
                onClick={() => detectText()}
                data-testid={elementId.Profil.Button.GunakanFotoIni}
              >
                Gunakan Foto Ini
              </Button>
            </div>
          </section>
        </main>
        <div className={styles.bottomIso}>
          <div className={styles.isoWrapper}>
            <IconLockFill width={14} height={14} color={colors.shadesGrey50} />
            <span className={styles.info}>
              Kami menjamin datamu aman dan terlindungi
            </span>
          </div>
        </div>
      </div>
      {toast ? (
        <Toast
          text={toast}
          maskClosable
          closeOnToastClick
          onCancel={() => {
            setToast('')
          }}
        />
      ) : null}
      <PopupError
        open={isModalOpen.status}
        onCancel={() => setIsModalOpen({ status: false, action: '' })}
        onCancelText={() => {
          setIsModalOpen({ status: false, action: '' })
          router.back()
        }}
        cancelText={
          isModalOpen.action === 'cant_read' ? 'Coba Lagi' : 'Foto Ulang'
        }
        title={
          isModalOpen.action === 'cant_read'
            ? 'KTP Tidak Bisa Dibaca'
            : 'KTP Sudah Terdaftar'
        }
        subTitle={
          isModalOpen.action === 'cant_read'
            ? 'Pastikan KTP terlihat jelas, semua sudut terlihat, dan hindari objek di atas KTP-mu.'
            : 'Kamu hanya dapat menggunakan 1(satu) KTP/NIK.'
        }
        width={346}
      />
    </>
  )
}

export default VerifyKtp
