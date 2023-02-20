declare global {
  interface Window {
    gtag: any
  }
}

const conversionLabelMap = {
  contact: '5_dGCIqC6uICEPHfrp4B',
  lead: 'ndhDCJXLweICEPHfrp4B',
  sendContactDetail: 'RIlyCP7Jvf8CEPHfrp4B',
  loanCalcView: 'T0IwCNuywv8CEPHfrp4B',
  preApprovalView: 'WmNWCPS0lf8CEPHfrp4B',
}

const sendGAData = (conversionLabel: string) => {
  if (process.env.REACT_APP_ENVIRONMENT === 'production') {
    window.gtag('event', 'conversion', {
      send_to: `AW-332115953/${conversionLabel}`,
    })
  }
}
export const trackGAContact = (): void => {
  sendGAData(conversionLabelMap.contact)
}
export const trackGALead = (): void => {
  sendGAData(conversionLabelMap.lead)
}
export const trackGASubmitContactInfo = (): void => {
  sendGAData(conversionLabelMap.sendContactDetail)
}
export const trackGALoanCalcPageView = (): void => {
  sendGAData(conversionLabelMap.loanCalcView)
}
export const trackGAPreApprovalPageView = (): void => {
  sendGAData(conversionLabelMap.preApprovalView)
}
