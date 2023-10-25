import React, { createContext, useContext } from 'react'
import {
  defaultContactFormValue,
  useContactFormData,
} from 'utils/hooks/useContactFormData/useContactFormData'
import { ContactFormKey } from 'utils/types/models'

type FormItem = { [k in ContactFormKey]?: string }

type PatchFunction = (value: FormItem) => void

const FormDataContext = createContext<FormItem>(defaultContactFormValue)
const defaultValue: PatchFunction = () => {
  return
}
const FormPatchContext = createContext(defaultValue)

export const ContactFormProvider = (props: HTMLElement) => {
  const { patchFormItemValue, formValue } = useContactFormData()
  const patchFormValue = (value: FormItem) => {
    patchFormItemValue(value)
  }

  return (
    <FormDataContext.Provider value={formValue}>
      <FormPatchContext.Provider value={patchFormValue}>
        <>{props.children}</>
      </FormPatchContext.Provider>
    </FormDataContext.Provider>
  )
}
export const useContextContactFormData = () => useContext(FormDataContext)
export const useContextContactFormPatch = () => useContext(FormPatchContext)
