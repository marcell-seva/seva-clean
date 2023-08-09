import React, { HTMLAttributes } from 'react'
import { FinancialQueryContextProvider } from './finnancialQueryContext'
import { FunnelQueryContextProvider } from './funnelQueryContext'
import { SearchWidgetProvider } from './searchWidgetContext'
import { UtilsContextProvider } from './utilsContext'
import { ConfigProvider } from './configContext'
import { CarProvider } from './carContext'
import { AuthProvider } from './authContext'
import { ContactFormProvider } from 'context/contactFormContext/contactFormContext'
import { CurrentLanguageContextProvider } from 'context/currentLanguageContext/currentLanguageContext'
import { FunnelFormContextProvider } from 'context/funnelFormContext/funnelFormContext'
import { LastOtpSentTimeContextProviderRevamp } from 'context/lastOtpSentTimeContext'
import { MobileWebTopMenusContextProvider } from 'context/mobileWebTopMenuContext/mobileWebTopMenuContext'
import { ModalContextProvider } from 'context/modalContext/modalContext'
import { SpecialRateListResultsContextProvider } from 'context/specialRateResultsContext/specialRateResultsContext'
import { SurveyFormProvider } from 'context/surveyFormContext/surveyFormContext'

const providers: Array<
  React.JSXElementConstructor<React.PropsWithChildren<any>>
> = [
  // FinancialQueryContextProvider,
  SearchWidgetProvider,
  UtilsContextProvider,
  ConfigProvider,
  AuthProvider,
  CarProvider,
  FunnelQueryContextProvider,
  FunnelFormContextProvider,
  MobileWebTopMenusContextProvider,
  LastOtpSentTimeContextProviderRevamp,
  ModalContextProvider,
  SurveyFormProvider,
  SpecialRateListResultsContextProvider,
  CurrentLanguageContextProvider,
  ContactFormProvider,
]

export const GlobalContextProvider = (props: HTMLAttributes<HTMLElement>) => {
  return (
    <>
      {providers.reduceRight((accumulator, Component) => {
        return <Component>{accumulator}</Component>
      }, props.children)}
    </>
  )
}
