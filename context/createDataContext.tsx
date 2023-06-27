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
  })

  const Provider = ({ children }: HTMLElement): ReactElement => {
    const [state, setState] = useState<S>(initialState)

    const value = useMemo(() => ({ state, setState }), [state])

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
