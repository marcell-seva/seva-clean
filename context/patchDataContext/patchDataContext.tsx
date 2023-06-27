/* eslint-disable import/no-anonymous-default-export */
import React, {
  createContext,
  Dispatch,
  ReactElement,
  SetStateAction,
  useMemo,
  useState,
} from 'react'

export type Store<S> = {
  state: S
  setState: Dispatch<SetStateAction<S>>
  patchState: (value: Partial<S>) => void
  clearState: () => void
}

export default <S,>(
  initialState: S,
): {
  Context: React.Context<Store<S>>
  Provider: (props: HTMLElement) => ReactElement
} => {
  const Context = createContext<Store<S>>({
    state: initialState,
    setState: () => {
      // do nothing
    },
    patchState: () => {
      return
    },
    clearState: () => {
      return
    },
  })

  const Provider = ({ children }: HTMLElement): ReactElement => {
    const [state, setState] = useState<S>(initialState)

    const patchState = (valueParam: Partial<S>) => {
      setState((preValue) => {
        return { ...preValue, ...valueParam }
      })
    }
    const clearState = () => {
      setState(() => {
        return { ...initialState }
      })
    }
    const value = useMemo(
      () => ({ state, setState, patchState, clearState }),
      [state],
    )

    return (
      <Context.Provider value={value}>
        <>{children}</>
      </Context.Provider>
    )
  }

  return {
    Context,
    Provider,
  }
}
