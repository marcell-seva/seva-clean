import firebase from 'firebase/app'
import 'firebase/auth'
import getCurrentEnvironment from 'helpers/environments'

if (!firebase.apps.length) {
  firebase.initializeApp(getCurrentEnvironment.firebaseConfigs)
}
firebase.auth().useDeviceLanguage()

export const auth = firebase.auth()

export const getRecaptchaToken = async (
  currentLanguage: string,
  buttonId: string,
) => {
  firebase.auth().settings.appVerificationDisabledForTesting = false
  auth.languageCode = currentLanguage
  return await new firebase.auth.RecaptchaVerifier(buttonId, {
    size: 'invisible',
  }).verify()
}

export const getRecaptchaTokenBypass = async (
  currentLanguage: string,
  buttonId: string,
) => {
  firebase.auth().settings.appVerificationDisabledForTesting = true
  auth.languageCode = currentLanguage
  return await new firebase.auth.RecaptchaVerifier(buttonId, {
    size: 'invisible',
  }).verify()
}
