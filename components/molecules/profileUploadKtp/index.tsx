import { IconChevronRight } from 'components/atoms'
import elementId from 'helpers/elementIds'
import { landingKtpUrl, previewKtpUrl } from 'utils/helpers/routes'
import styles from '/styles/pages/account-profile.module.scss'
import { useRouter } from 'next/router'

const PromotionBanner = '/revamp/images/profile/card_promotion-banner.webp'

type ProfileUploadKtpProps = {
  dirty: boolean
  onModalOpen: ({ status, action }: { status: boolean; action: string }) => void
  nik: boolean
}

export const ProfileUploadKtp = ({
  dirty,
  onModalOpen,
  nik,
}: ProfileUploadKtpProps) => {
  const router = useRouter()
  return (
    <section
      className={styles.banner}
      data-testid={elementId.Profil.PromoWidget.Box}
    >
      {nik ? (
        <div
          className={styles.banner__left}
          onClick={() => {
            if (dirty) {
              onModalOpen({ status: true, action: 'changeKtp' })
              return
            }
            router.push(previewKtpUrl)
          }}
        >
          <div className={styles.banner__img}>
            <img
              src={PromotionBanner}
              alt="Promotion Banner"
              data-testid={elementId.Profil.PromoWidget.Image}
            />
          </div>
          <div
            className={styles.banner__text}
            data-testid={elementId.Profil.PromoWidget.Text}
          >
            <span className={styles.body}>
              Kamu memenuhi syarat untuk promo
            </span>
            <span className={styles.small}>
              Perlu mengubah KTP? Foto ulang KTP-mu.
            </span>
          </div>
          <div
            className={styles.banner__icon}
            data-testid={elementId.Profil.PromoWidget.Arrow}
          >
            <IconChevronRight width={24} height={24} color={'#13131B'} />
          </div>
        </div>
      ) : (
        <div
          className={styles.banner__left}
          onClick={() => {
            if (dirty) {
              onModalOpen({ status: true, action: 'newKtp' })
              return
            }
            router.push(landingKtpUrl)
          }}
        >
          <div className={styles.banner__img}>
            <img src={PromotionBanner} alt="Promotion Banner" />
          </div>
          <div className={styles.banner__text}>
            <span className={styles.body}>
              Dapatkan Cashback Cicilan Hingga 4 juta!
            </span>
            <span className={styles.small}>
              Kirim foto KTP kamu dan dapatkan promo sekarang.
            </span>
          </div>
          <div className={styles.banner__icon}>
            <IconChevronRight width={24} height={24} color={'#13131B'} />
          </div>
        </div>
      )}
    </section>
  )
}
