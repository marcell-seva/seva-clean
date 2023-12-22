import React, { useState } from 'react'
import styles from 'styles/pages/account-profile.module.scss'
import elementId from 'helpers/elementIds'
import { useMediaQuery } from 'react-responsive'
import { useRouter } from 'next/router'
import { cameraKtpUrl, rootUrl } from 'utils/helpers/routes'
import { PageLayout } from 'components/templates'
import { CheckedSquareOutlined } from 'components/atoms/icon/CheckedSquareOutlined'
import { Button, Toast, UncheckedSquareOutlined } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'
import PopupError from 'components/organisms/popupError'
import Image from 'next/image'

const CheckedIcon = '/revamp/icon/checked.webp'
const PromotionBanner = '/revamp/images/profile/ktp_promotion-banner.webp'

const Ktp = () => {
  const router = useRouter()
  const [toast, setToast] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBoxChecked, setIsBoxChecked] = useState(false)
  const isMobile = useMediaQuery({ query: '(max-width: 480px)' })

  const onCheckBoxToggle = () => {
    setIsBoxChecked(!isBoxChecked)
  }
  const getCheckboxSize = () => {
    if (!isMobile) return 24
    else return 16
  }
  const navigateToCamera = () => {
    router.push(cameraKtpUrl)
  }
  return (
    <>
      <PageLayout footer={false}>
        {() => (
          <main className={styles.wrapper}>
            <section className={styles.wrapper__form}>
              <section className={styles.info}>
                <h2 className={`medium ${styles.info} ${styles.titleText}`}>
                  1 Promo yang tersedia
                </h2>
              </section>
              <Image
                src={PromotionBanner}
                className={styles.banner__promo}
                onClick={() =>
                  window.open(
                    'https://www.seva.id/info/promo/toyota-spektakuler',
                    '_blank',
                  )
                }
                alt="Promotion Banner"
                data-testid={elementId.Profil.PromoTersedia}
              />
              <section className={styles.ktp__wrapper}>
                <h2 className={`medium ${styles.info} ${styles.titleText}`}>
                  Hal yang perlu diketahui
                </h2>
                <section className={styles.ktp__wrapper__form}>
                  <span className={styles.light__text}>
                    Sebelum kamu dapat menggunakan promo untuk cicilan mobilmu,
                    berikut adalah beberapa hal yang perlu disetujui & siapkan.
                  </span>
                  <ul className={styles.ktp__wrapper__form}>
                    <li className={styles.ktp__info}>
                      <Image src={CheckedIcon} alt="Checked" />
                      <span>Siapkan KTP kamu untuk proses ini.</span>
                    </li>
                    <li className={styles.ktp__info}>
                      <Image src={CheckedIcon} alt="Checked" />
                      <span>
                        Pastikan menggunakan KTP yang akan digunakan untuk Surat
                        Pemesanan Kendaraan.
                      </span>
                    </li>
                    <li className={styles.ktp__info}>
                      <Image src={CheckedIcon} alt="Checked" />
                      <span>
                        Pastikan foto KTP kamu terlihat jelas dan bisa dibaca.
                      </span>
                    </li>
                  </ul>
                  <div className={styles.checkbox__wrapper}>
                    <div
                      className={styles.checkbox__list}
                      data-testid={elementId.Profil.CheckboxKTP}
                      onClick={onCheckBoxToggle}
                    >
                      <div className={styles.box__icon__wrapper}>
                        {isBoxChecked ? (
                          <CheckedSquareOutlined
                            width={getCheckboxSize()}
                            height={getCheckboxSize()}
                          />
                        ) : (
                          <UncheckedSquareOutlined
                            width={getCheckboxSize()}
                            height={getCheckboxSize()}
                          />
                        )}
                      </div>
                    </div>
                    <div className={styles.agreement__text}>
                      Saya menyetujui{' '}
                      <span
                        className={styles.link}
                        onClick={() =>
                          window.open(
                            'https://ext.seva.id/syarat-ketentuan',
                            '_blank',
                          )
                        }
                        data-testid={elementId.Text + 'syarat-ketentuan'}
                      >
                        Syarat & Ketentuan
                      </span>{' '}
                      dan
                      <span
                        className={styles.link}
                        onClick={() =>
                          window.open(
                            'https://ext.seva.id/kebijakan-privasi',
                            '_blank',
                          )
                        }
                        data-testid={elementId.Text + 'kebijakan-privasi'}
                      >
                        {' '}
                        Kebijakan Privasi SEVA
                      </span>
                      . KTP yang akan dilampirkan dapat digunakan oleh SEVA
                      untuk proses pengajuan cicilan mobil.
                    </div>
                  </div>
                </section>
              </section>
              <Button
                onClick={() => {
                  navigateToCamera()
                }}
                version={ButtonVersion.PrimaryDarkBlue}
                size={ButtonSize.Big}
                disabled={!isBoxChecked}
                data-testid={elementId.Profil.Button.Lanjutkan}
              >
                Lanjutkan
              </Button>
            </section>
          </main>
        )}
      </PageLayout>
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
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        cancelText="Kembali"
        title="Perubahan data belum disimpan."
        subTitle="Simpan perubahan datamu sebelum melakukan tahap lainnya."
        width={346}
        discardButton={{
          action: () => {
            router.push(rootUrl)
          },
          text: 'Batalkan perubahan dan lanjutkan',
        }}
      />
    </>
  )
}

export default Ktp
