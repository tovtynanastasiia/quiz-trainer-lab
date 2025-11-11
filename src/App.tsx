import { Route, Routes } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { HomePage } from './pages/HomePage'
import { LearningModesPage } from './pages/LearningModesPage'
import { WordSetsPage } from './pages/WordSetsPage'
import { SignInPage } from './pages/auth/SignInPage'
import { SignUpPage } from './pages/auth/SignUpPage'
import { WordSetDetailsPage } from './pages/sets/WordSetDetailsPage'
import { AccountOverviewPage } from './pages/account/AccountOverviewPage'
import { ProtectedRoute } from './routes/ProtectedRoute'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="modes" element={<LearningModesPage />} />
        <Route path="sets" element={<WordSetsPage />}>
          <Route path=":setId" element={<WordSetDetailsPage />} />
        </Route>
        <Route path="auth">
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="register" element={<SignUpPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="account" element={<AccountOverviewPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
