export const FB_PIXEL_ID = '496731661654244'

export enum FBPixelStandardEvent {
  PageView = 'PageView',
  Contact = 'Contact',
  Lead = 'Lead',
  SendContactDetail = 'Contact', // value set it the same as Contact on purpose for now, may change it later to distinguish with Contact
  LoanCalcView = 'LoanCalcView',
  PreApprovalView = 'PreApprovalView',
}
