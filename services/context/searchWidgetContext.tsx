import { createContext, useState } from 'react'
import { FunnelWidget } from 'utils/types/props'

const initEmptyDataWidget = {
  downPaymentAmount: '',
  brand: [],
  bodyType: [],
  priceRangeGroup: '',
  tenure: '',
  age: '',
  monthlyIncome: '',
  city: '',
}

export type SearchWidgetContextType = {
  funnelWidget: FunnelWidget
  saveFunnelWidget: (data: FunnelWidget) => void
}

export const SearchWidgetContext =
  createContext<SearchWidgetContextType | null>(null)

export const SearchWidgetProvider = ({ children }: any) => {
  const [funnelWidget, setFunnelWidget] =
    useState<FunnelWidget>(initEmptyDataWidget)

  const saveFunnelWidget = (funnelData: FunnelWidget) => {
    setFunnelWidget(funnelData)
  }

  return (
    <SearchWidgetContext.Provider value={{ funnelWidget, saveFunnelWidget }}>
      {children}
    </SearchWidgetContext.Provider>
  )
}
