import React, { HTMLAttributes } from 'react'
import { FinancialQueryContextProvider } from './finnancialQueryContext'
import { SearchWidgetProvider } from './searchWidgetContext'
import { FunnelQueryContextProvider } from './funnelQueryContext'
import { UtilsContextProvider } from './utilsContext'
import { ConfigProvider } from './configContext'
import { CarProvider } from './carContext'
import { AuthProvider } from './authContext'
import { type } from 'os'

const providers: Array<
  React.JSXElementConstructor<React.PropsWithChildren<any>>
> = [
  FinancialQueryContextProvider,
  SearchWidgetProvider,
  FunnelQueryContextProvider,
  UtilsContextProvider,
  ConfigProvider,
  AuthProvider,
  CarProvider,
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
