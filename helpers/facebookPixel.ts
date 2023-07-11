import ReactPixel from 'react-facebook-pixel'

export const initFacebookPixel = () => {
  const options = {
    autoConfig: true,
    debug: false,
  }
  ReactPixel.init('496731661654244', undefined, options)
  ReactPixel.track(FBPixelStandardEvent.PageView)
}
export enum FBPixelStandardEvent {
  PageView = 'PageView',
  Contact = 'Contact',
  Lead = 'Lead',
  SendContactDetail = 'Contact', // value set it the same as Contact on purpose for now, may change it later to distinguish with Contact
  LoanCalcView = 'LoanCalcView',
  PreApprovalView = 'PreApprovalView',
}
