import { act, renderHook } from '@testing-library/react-hooks'
import { useContactFormData } from './useContactFormData'
import { ContactFormKey, ContactTime, PurchaseTime } from '../../models/models'

describe('useContactFormData', () => {
  const initialPurchaseTime = PurchaseTime.Within2Months.toString()
  test('should get formItemValue by key and all formData successfully', () => {
    const initialData = {
      [ContactFormKey.PurchaseTime]: initialPurchaseTime,
    }
    jest
      .spyOn(localStorage, 'getItem')
      .mockReturnValue(JSON.stringify(initialData))

    const { result } = renderHook(() => {
      return useContactFormData(initialData)
    })

    const { formItemValue, formValue } = result.current
    console.log(formItemValue, formValue)
    expect(formItemValue(ContactFormKey.PurchaseTime)).toBe(initialPurchaseTime)
    expect(formValue).toEqual(initialData)
  })

  test(
    'should patchFormItemValue and get the updated formItemValue' +
      ' successfully',
    () => {
      const initialData = {
        [ContactFormKey.PurchaseTime]: initialPurchaseTime,
        [ContactFormKey.ContactTime]: ContactTime.Afternoon.toString(),
      }
      jest
        .spyOn(localStorage, 'getItem')
        .mockReturnValueOnce(JSON.stringify(initialData))

      const { result } = renderHook(() => {
        return useContactFormData(initialData)
      })

      const { formItemValue, patchFormItemValue, formValue } = result.current
      expect(formItemValue(ContactFormKey.PurchaseTime)).toBe(
        initialPurchaseTime,
      )
      expect(formValue).toEqual(initialData)

      const newValue = PurchaseTime.InOver2Months.toString()
      act(() => {
        patchFormItemValue({
          [ContactFormKey.PurchaseTime]: newValue,
        })
      })
      expect(result.current.formItemValue(ContactFormKey.PurchaseTime)).toEqual(
        newValue,
      )
      expect(result.current.formValue).toEqual({
        [ContactFormKey.PurchaseTime]: newValue,
        [ContactFormKey.ContactTime]: ContactTime.Afternoon.toString(),
      })
    },
  )
})
