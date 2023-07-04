import * as useLocalStorage from '../useLocalStorage/useLocalStorage'
import { useCurrentLanguage } from './useCurrentLanguage'
import { renderHook } from '@testing-library/react-hooks'

describe('#useCurrentLanguage', () => {
  test('should get current language as what stored in localstorage', () => {
    jest
      .spyOn(useLocalStorage, 'useLocalStorage')
      .mockImplementation(() => ['id'])
    const { result } = renderHook(() => {
      return useCurrentLanguage()
    })
    expect(result.current[0]).toBe('id')
  })

  test('should get current language as English when browser language is English and no language stored in localstorage', () => {
    jest
      .spyOn(useLocalStorage, 'useLocalStorage')
      .mockImplementation(() => [null])
    jest.spyOn(window.navigator, 'language', 'get').mockReturnValueOnce('en-US')
    const { result } = renderHook(() => {
      return useCurrentLanguage()
    })
    expect(result.current[0]).toBe('id')
  })

  test('should get current language as Indonesian when browser language is not English and no language stored in localstorage', () => {
    jest
      .spyOn(useLocalStorage, 'useLocalStorage')
      .mockImplementation(() => [null])
    jest.spyOn(window.navigator, 'language', 'get').mockReturnValueOnce('id')
    const { result } = renderHook(() => {
      return useCurrentLanguage()
    })
    expect(result.current[0]).toBe('id')
  })
})
