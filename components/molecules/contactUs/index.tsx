import React, { useContext, useEffect, useState } from 'react'
import styles from '../../../styles/ContactUs.module.css'
import FlagIndonesia from '../../../assets/images/flagIndonesia.png'
import Image from 'next/image'
import TagManager from 'react-gtm-module'
import amplitude from 'amplitude-js'
import { api } from '../../../services/api'
import { setTrackEventMoEngageWithoutValue } from '../../../services/moengage'
import {
  AuthContext,
  AuthContextType,
} from '../../../services/context/authContext'

interface Form {
  name: string
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
  const { isLoggedIn, userData } = useContext(AuthContext) as AuthContextType
  const [active, setActive] = useState<boolean>(false)
  const [form, setForm] = useState<Form>({
    name: userData === null ? '' : userData.fullName,
    phone: userData === null ? '' : userData.phoneNumber,
    whatsapp: false,
  })

  const handleChange = (indexKey: string, payload: string | boolean) => {
    setForm((prevState: any) => ({ ...prevState, [indexKey]: payload }))
  }

  const sendForm = () => {
    if (form.whatsapp)
      amplitude.getInstance().logEvent('SELECT_HOME_SEND_DETAILS')
    sendUnverifiedLeads(form)
  }

  const sendUnverifiedLeads = (payload: any) => {
    const data = {
      contactType: payload.whatsapp ? 'whatsapp' : 'phone',
      maxDp: 30000000, // uniq masalah dp, utm , dan token
      name: payload.name,
      phoneNumber: `+62${payload.phone}`,
      origination: 'Homepage - Hubungi Kami',
      adSet: null,
      utmCampaign: null,
      utmContent: null,
      utmId: null,
      utmMedium: null,
      utmSource: null,
      utmTerm: null,
    }
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
    setActive(form.name !== '' && form.phone.length > 3)
  }, [form])

  const validateForm = () => {
    if (active && isLoggedIn) sendForm()
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
              <p className={styles.separator}>|</p>
            </div>
            <input
              className={`inputNumber ${styles.input}`}
              placeholder="Contoh : 81212345678"
              type="number"
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
