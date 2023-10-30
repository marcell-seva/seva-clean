import { createContext, useState } from 'react'
import { FunnelWidget, UsedCarFunnelWidget } from 'utils/types/props'

const initEmptyDataWidget = {
  brand: [],
  minYear: '',
  maxYear: '',
  transmission: [],
}

export type SearchUsedCarWidgetContextType = {
  funnelWidget: UsedCarFunnelWidget
  saveFunnelWidget: (data: UsedCarFunnelWidget) => void
}

export const SearchUsedCarWidgetContext =
  createContext<SearchUsedCarWidgetContextType | null>(null)

export const SearchUsedCarWidgetProvider = ({ children }: any) => {
  const [funnelWidget, setFunnelWidget] =
    useState<UsedCarFunnelWidget>(initEmptyDataWidget)

  const saveFunnelWidget = (funnelData: UsedCarFunnelWidget) => {
    setFunnelWidget(funnelData)
  }

  return (
    <SearchUsedCarWidgetContext.Provider
      value={{ funnelWidget, saveFunnelWidget }}
    >
      {children}
    </SearchUsedCarWidgetContext.Provider>
  )
}
