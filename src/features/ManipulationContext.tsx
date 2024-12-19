import { createContext, PropsWithChildren, useEffect, useState } from 'react'

interface ManipulationContextObject {
  manipulation: string
  setManipulation: (value: string) => void
}

export const ManipulationContext = createContext({} as ManipulationContextObject)

export function ManipulationContextProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<string | null>(null)

  function setManipulation(value: string) {
    setState(value)
  }

  return (
    <ManipulationContext.Provider
      value={{
        manipulation: state,
        setManipulation,
      }}
    >
      {children}
    </ManipulationContext.Provider>
  )
}
