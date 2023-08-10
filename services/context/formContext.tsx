import React, { createContext, useContext } from 'react'

import { ContactFormKey } from 'utils/models/models'
import {
  defaultContactFormValue,
  useContactFormData,
} from 'utils/hooks/useContactFormData/useContactFormData'
import {
  defaultFormValue,
  useSurveyFormData,
} from 'utils/hooks/useSurveyFormData/useSurveyFormData'
import { FormControlValue } from 'utils/types/props'
import { SurveyFormKey } from 'utils/types/models'

export interface FormControl<T extends FormControlValue> {
  value: T
  isDataValid: boolean
}

type FormItem = {
  formContactValue: {
    [k in ContactFormKey]?: string
  }
  patchFormContactValue: (value: FormItem['formContactValue']) => void
  formSurveyValue: {
    [k in SurveyFormKey]?: FormControl<FormControlValue>
  }
  patchFormSurveyValue: (value: FormItem['formSurveyValue']) => void
}

const FormContext = createContext<FormItem>({
  formContactValue: defaultContactFormValue,
  patchFormContactValue: (value: FormItem['formContactValue']) => {
    console.log(value)
  },
  formSurveyValue: defaultFormValue,
  patchFormSurveyValue: (value: FormItem['formSurveyValue']) => {
    console.log(value)
  },
})

export const FormContextProvider = (props: HTMLElement) => {
  const {
    patchFormItemValue: patchFormItemContactValue,
    formValue: formContactValue,
  } = useContactFormData()

  const {
    patchFormItemValue: patchFormItemSurveyValue,
    formValue: formSurveyValue,
  } = useSurveyFormData()

  const patchFormContactValue = (value: FormItem['formContactValue']) => {
    patchFormItemContactValue(value)
  }

  const patchFormSurveyValue = (value: FormItem['formSurveyValue']) => {
    patchFormItemSurveyValue(value)
  }

  return (
    <FormContext.Provider
      value={{
        formContactValue,
        patchFormContactValue,
        formSurveyValue,
        patchFormSurveyValue,
      }}
    >
      <>{props.children}</>
    </FormContext.Provider>
  )
}

export const useContextForm = () => useContext(FormContext)
