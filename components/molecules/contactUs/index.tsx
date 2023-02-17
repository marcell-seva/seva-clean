import React, { useContext, useEffect, useState } from 'react'
import styles from '../../../styles/ContactUs.module.css'
import FlagIndonesia from '../../../assets/images/flagIndonesia.png'
import Image from 'next/image'
import amplitude from 'amplitude-js'
import { api } from '../../../services/api'
import { setTrackEventMoEngageWithoutValue } from '../../../services/moengage'
import {
  AuthContext,
  AuthContextType,
} from '../../../services/context/authContext'
import {
  ConfigContext,
  ConfigContextType,
} from '../../../services/context/configContext'
import TagManager from 'react-gtm-module'

interface Form {
  name: string | undefined
  phone: any
  whatsapp: boolean
}

interface Props {
  openThankyouModal: any
  openLoginModal: any
}
export default function ContactUs({
  openThankyouModal,
  openLoginModal,
}: Props) {
  const { isLoggedIn, userData, filter } = useContext(
    AuthContext,
  ) as AuthContextType
  const { utm } = useContext(ConfigContext) as ConfigContextType
  const [active, setActive] = useState<boolean>(false)
  const [form, setForm] = useState<Form>({
    name: '',
    phone: '',
    whatsapp: false,
  })

  useEffect(() => {
    if (userData !== null) {
      const parsedPhone = userData.phoneNumber.toString().replace('+62', '')
      setForm((prevState: any) => ({ ...prevState, name: userData.fullName }))
      setForm((prevState: any) => ({
        ...prevState,
        phone: parseInt(parsedPhone),
      }))
    }
  }, [userData])

  const handleChange = (indexKey: string, payload: string | boolean) => {
    setForm((prevState: any) => ({ ...prevState, [indexKey]: payload }))
  }

  const sendForm = () => {
    if (form.whatsapp)
      amplitude.getInstance().logEvent('SELECT_HOME_SEND_DETAILS')
    sendUnverifiedLeads(form)
  }

  const generateLeadsData = (payload: any) => {
    const data: any = {
      contactType: payload.whatsapp ? 'whatsapp' : 'phone',
      name: payload.name,
      phoneNumber: `+62${payload.phone}`,
      origination: 'Homepage - Hubungi Kami',
      adSet: utm?.adset,
      utmCampaign: utm?.utm_campaign,
      utmContent: utm?.utm_content,
      utmId: utm?.utm_id,
      utmMedium: utm?.utm_medium,
      utmSource: utm?.utm_source,
      utmTerm: utm?.utm_term,
    }
    if (filter !== null) data.maxDp = parseInt(filter.downPaymentAmount)
    return data
  }
  const sendUnverifiedLeads = (payload: any) => {
    const data = generateLeadsData(payload)
    try {
      api.postUnverfiedLeads(data)
      openThankyouModal()
      setTrackEventMoEngageWithoutValue('leads-created')
      amplitude.getInstance().logEvent('WEB_LANDING_PAGE_LEADS_FORM_SUBMIT')
      pushDataLayer()
    } catch (error) {
      throw error
    }
  }

  const pushDataLayer = () => {
    TagManager.dataLayer({
      dataLayer: {
        event: 'interaction',
        eventCategory: 'Leads Generator',
        eventAction: 'Homepage - Leads Form - Control',
        eventLabel: 'Kirim Rincian',
      },
    })
  }

  useEffect(() => {
    if (isLoggedIn) setActive(true)
    else setActive(form.name !== '' && form.phone.length > 3)
  }, [form])

  const validateForm = () => {
    if (active && !isLoggedIn) sendForm()
    else if (active && !isLoggedIn) openLoginModal()
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <h2 className={styles.titleText}>Ngobrol langsung dengan agen kami</h2>
        <p className={styles.descText}>
          Tulis rincian kontakmu supaya agen kami bisa segera menghubungi kamu.
        </p>
        <div className={styles.form}>
          <div className={styles.wrapperInput}>
            <input
              type="text"
              className={styles.input}
              value={form.name}
              placeholder="Nama Lengkap"
              onChange={(e) => handleChange('name', e.target.value)}
            ></input>
          </div>
          <div className={styles.wrapperInputPhone}>
            <div className={styles.phoneDetail}>
              <Image
                src={FlagIndonesia}
                width={16}
                height={16}
                alt="indonesia-flag"
              />
              <p className={styles.labelRegion}>+62</p>
              <div className={styles.separator} />
            </div>
            <input
              className={`inputNumber ${styles.input}`}
              value={form.phone}
              type="number"
              placeholder="Contoh : 81212345678"
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </div>
          <label className={styles.agreementMobile}>
            <input
              type="checkbox"
              name="checkbox"
              checked={form.whatsapp}
              onChange={() => handleChange('whatsapp', !form.whatsapp)}
            />
            <p className={styles.agreementText}>
              Saya memilih untuk dihubungi via WhatsApp
            </p>
          </label>
          <button
            className={active ? styles.buttonActive : styles.buttonInActive}
            onClick={() => validateForm()}
          >
            Kirim Rincian
          </button>
        </div>
        <label className={styles.agreementDesktop}>
          <input
            type="checkbox"
            name="checkbox"
            checked={form.whatsapp}
            onChange={() => handleChange('whatsapp', !form.whatsapp)}
          />
          <p className={styles.agreementText}>
            Saya memilih untuk dihubungi via WhatsApp
          </p>
        </label>
      </div>
    </div>
  )
}
