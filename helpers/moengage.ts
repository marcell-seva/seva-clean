import { client } from 'utils/helpers/const'

export const MoengageEventName = {
  view_homepage: 'view_homepage',
  view_car_search: 'view_car_search',
  view_regular_calculator_page: 'view_regular_calculator_page',
  view_variant_list_credit_tab: 'view_variant_list_credit_tab',
  view_profile_page: 'view_profile_page',
  view_kualifikasi_kredit_form_page: 'view_kualifikasi_kredit_form_page',
  view_kualifikasi_kredit_review_page: 'view_kualifikasi_kredit_review_page',
  view_kualifikasi_kredit_waiting_result_page:
    'view_kualifikasi_kredit_waiting_result_page',
  view_kualifikasi_kredit_success_result_page:
    'view_kualifikasi_kredit_success_result_page',
  view_kualifikasi_kredit_reject_result_page:
    'view_kualifikasi_kredit_reject_result_page',
  view_loan_calculator_result: 'view_loan_calculator_result',
  submit_leads_form: 'submit_leads_form',
}

export const setTrackEventMoEngage = (param1: any, param2: any): void => {
  const moengage = client && window.Moengage
  if (moengage && moengage.track_event) {
    moengage.track_event(param1, param2)
  }
}

export const destroySessionMoEngage = (): void => {
  const moengage = client && window.Moengage
  if (moengage && moengage.destroy_session) {
    moengage.destroy_session()
  }
}

export const addUserIdMoEngage = (value: any): void => {
  const moengage: any = window.Moengage
  if (moengage && moengage.add_unique_user_id) {
    moengage.add_unique_user_id(value)
  }
}

export const setTrackEventMoEngageWithoutValue = (value: any): void => {
  const moengage = client && window.Moengage
  if (moengage && moengage.track_event) {
    moengage.track_event(value)
  }
}

export const addAttributeMoEngage = (
  valueFirstName: any,
  valueLastName: any,
  valueEmail: any,
  valueGender: any,
  valuePhoneNumber: any,
  valueDob: any,
): void => {
  const moengage: any = window.Moengage
  moengage.add_first_name(valueFirstName)
  moengage.add_last_name(valueLastName)
  moengage.add_email(valueEmail)
  moengage.add_mobile(valuePhoneNumber)
  moengage.add_gender(valueGender)
  moengage.add_birthday(valueDob)
}

export const addAttributeMoEngageAfterLogin = (
  valueFirstName: any,
  valueLastName: any,
  valueEmail: any,
  valuePhoneNumber: any,
): void => {
  const moengage: any = window.Moengage
  moengage.add_first_name(valueFirstName)
  moengage.add_last_name(valueLastName)
  moengage.add_email(valueEmail)
  moengage.add_mobile(valuePhoneNumber)
}
