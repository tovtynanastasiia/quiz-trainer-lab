import { useState } from 'react'
import type { JSX } from 'react'

import { AppLayout } from './layouts/AppLayout'
import type { PageDefinition, PageKey } from './types/navigation'
import { HomePage } from './pages/HomePage'
import { LearningModesPage } from './pages/LearningModesPage'
import { WordSetsPage } from './pages/WordSetsPage'
import { SignInPage } from './pages/auth/SignInPage'
import { SignUpPage } from './pages/auth/SignUpPage'

const pages: PageDefinition[] = [
  {
    key: 'home',
    label: 'Home',
    description: 'Dashboard overview of current activity',
  },
  {
    key: 'learning-modes',
    label: 'Learning modes',
    description: 'Explore available training experiences',
  },
  {
    key: 'word-sets',
    label: 'Word sets',
    description: 'Organise and maintain your vocabulary collections',
  },
  {
    key: 'sign-in',
    label: 'Sign in',
    description: 'Authenticate to sync your data',
  },
  {
    key: 'sign-up',
    label: 'Register',
    description: 'Create a new learning account',
  },
]

const pageComponents: Record<PageKey, JSX.Element> = {
  home: <HomePage />,
  'learning-modes': <LearningModesPage />,
  'word-sets': <WordSetsPage />,
  'sign-in': <SignInPage />,
  'sign-up': <SignUpPage />,
}

export default function App() {
  const [activePage, setActivePage] = useState<PageKey>('home')

  return (
    <AppLayout pages={pages} activePage={activePage} onNavigate={setActivePage}>
      {pageComponents[activePage]}
    </AppLayout>
  )
}
