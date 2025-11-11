import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthPreview } from '../modules/auth/useAuthPreview'

export function ProtectedRoute() {
  const location = useLocation()
  const { isAuthenticated, setRedirectPath, redirectPath } = useAuthPreview()

  if (!isAuthenticated) {
    const pathWithSearch = location.pathname + location.search
    if (redirectPath !== pathWithSearch) {
      setRedirectPath(pathWithSearch)
    }
    return <Navigate to="/auth/sign-in" replace state={{ from: location }} />
  }

  return <Outlet />
}

