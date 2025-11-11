import { createContext, useState, useMemo, type PropsWithChildren } from 'react'

export interface AuthPreviewContextValue {
  isAuthenticated: boolean
  redirectPath: string | null
  signIn: () => void
  signOut: () => void
  setRedirectPath: (path: string | null) => void
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthPreviewContext = createContext<AuthPreviewContextValue | undefined>(undefined)

export function AuthPreviewProvider({ children }: PropsWithChildren) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [redirectPath, setRedirectPath] = useState<string | null>(null)

  const value = useMemo<AuthPreviewContextValue>(
    () => ({
      isAuthenticated,
      redirectPath,
      signIn: () => setIsAuthenticated(true),
      signOut: () => setIsAuthenticated(false),
      setRedirectPath,
    }),
    [isAuthenticated, redirectPath],
  )

  return (
    <AuthPreviewContext.Provider value={value}>{children}</AuthPreviewContext.Provider>
  )
}

