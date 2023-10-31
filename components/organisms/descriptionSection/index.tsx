import React, { useContext } from 'react'
import styles from 'styles/components/organisms/description.module.scss'

const promoBannerTSO = '/revamp/illustration/PromoTSO.webp'
const promoBannerCumaDiSEVA = '/revamp/illustration/PromoCumaDiSEVA.webp'
const promoTradeIn = '/revamp/illustration/PromoTradeIn.webp'
const setirKanan = '/revamp/images/logo/setir-kanan.png'

import {
  IconChevronRight,
  IconEngine,
  IconFuel,
  IconPromo,
  IconSeat,
  IconTransmission,
  IconCar,
  IconBookInformation,
} from 'components/atoms'
import { CarVariantRecommendation, trackDataCarType } from 'utils/types/utils'
import { OTOVariantListUrl, variantListUrl } from 'utils/helpers/routes'
import elementId from 'helpers/elementIds'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { trackEventCountly } from 'helpers/countly/countly'
import { CountlyEventNames } from 'helpers/countly/eventNames'
import { getLocalStorage } from 'utils/handler/localStorage'
import { LocalStorageKey, SessionStorageKey } from 'utils/enum'
import { LoanRank } from 'utils/types/models'
import { getBrandAndModelValue } from 'utils/handler/getBrandAndModel'
import { getSessionStorage } from 'utils/handler/sessionStorage'
import { UsedPdpDataLocalContext } from 'pages/mobil-bekas/p/[[...slug]]'
import {
  IconCalendar,
  IconColor,
  IconDocumentSigned,
  IconDownPayment,
  IconLocation,
  IconNumberField,
  IconSpeed,
} from 'components/atoms/icon'
import { convertStringDateToMonthYear } from 'utils/handler/date'
import { addSeparator } from 'utils/handler/stringManipulation'
import { Button } from 'components/atoms'
import { ButtonSize, ButtonVersion } from 'components/atoms/button'

type DescriptionSectionProps = {
  scrollToLeads?: any
}

const DescriptionSection = ({ scrollToLeads }: DescriptionSectionProps) => {
  const router = useRouter()
  const { usedCarModelDetailsRes } = useContext(UsedPdpDataLocalContext)

  const item = usedCarModelDetailsRes

  const navigateToSpecificationTab = () => {
    // setSelectedTabValue && setSelectedTabValue('Spesifikasi')
    // window.location.href = (isOTO ? OTOVariantListUrl : variantListUrl)
    //   .replace(':brand', brand)
    //   .replace(':model', model)
    //   .replace(':tab?', 'spesifikasi')
  }

  return (
    <div>
      <div className={styles.cardInfoDetail} style={{ padding: '16px' }}>
        <div className={styles.row}>
          <div className={styles.rowWithGap}>
            <IconBookInformation
              width={24}
              height={24}
              color={'#B4231E'}
              alt="SEVA Car Icon"
            />
            <h3 className={styles.kanyonMedium}>Informasi Mobil</h3>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.setirKananSection}>
            <Image src={setirKanan} width={64} height={23} alt="Setir Kanan" />
            <p className={styles.openSansRegular}>
              Mobil bekas berkualitas ini disediakan oleh Setir Kanan.
            </p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.rowWithGap24}>
            <IconSpeed
              width={16}
              height={16}
              color="#878D98"
              alt="SEVA Speedometer"
            />
            <p className={styles.openSans} style={{ color: '#13131B' }}>
              {addSeparator(item.mileage.toString())}km
            </p>
          </div>
          <div className={styles.rowWithGap24}>
            <IconCalendar
              width={16}
              height={16}
              color={'#878D98'}
              alt="SEVA calendar Icon"
            />
            <p className={styles.openSans} style={{ color: '#13131B' }}>
              {item.nik}
            </p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.rowWithGap24}>
            <IconColor
              width={16}
              height={16}
              color={'#878D98'}
              alt="SEVA Color Icon"
            />
            <p className={styles.openSans} style={{ color: '#13131B' }}>
              {item.color}
            </p>
          </div>
          <div className={styles.rowWithGap24}>
            <IconTransmission
              width={16}
              height={16}
              color={'#878D98'}
              alt="SEVA Transmission icon"
            />
            <p className={styles.openSans} style={{ color: '#13131B' }}>
              {
                item.carSpecifications.find(
                  (item: any) => item.specCode === 'transmission',
                ).value
              }
            </p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.rowWithGap24}>
            <IconLocation
              width={16}
              height={16}
              color={'#878D98'}
              alt="SEVA Location Icon"
            />
            <p className={styles.openSans} style={{ color: '#13131B' }}>
              {item.cityName}
            </p>
          </div>
          <div className={styles.rowWithGap24}>
            <IconNumberField
              width={16}
              height={16}
              color={'#878D98'}
              alt="SEVA Plat Nomor icon"
            />
            <p className={styles.openSans} style={{ color: '#13131B' }}>
              Plat {item.plate}
            </p>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.rowWithGap24}>
            <IconDocumentSigned
              width={16}
              height={16}
              color={'#878D98'}
              alt="SEVA Pajak Kendaraan"
            />
            <p className={styles.openSans} style={{ color: '#13131B' }}>
              {convertStringDateToMonthYear(item.taxDate)}
            </p>
          </div>
          <div className={styles.rowWithGap24}>
            <IconFuel
              width={16}
              height={16}
              color={'#878D98'}
              alt="SEVA Fuel icon"
            />
            <p className={styles.openSans} style={{ color: '#13131B' }}>
              {
                item.carSpecifications.find(
                  (item: any) => item.specCode === 'fuel-type',
                ).value
              }
            </p>
          </div>
        </div>
        <div className={styles.row}>
          <Button
            secondaryClassName={styles.button}
            data-test-id={
              router.pathname === ''
                ? elementId.Homepage.Button.CariMobil
                : elementId.PDP.LeadsForm.btnSend
            }
            //   disabled={!isFilled}
            version={ButtonVersion.PrimaryDarkBlue}
            size={ButtonSize.Big}
            onClick={scrollToLeads}
          >
            Tanya Unit
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DescriptionSection
