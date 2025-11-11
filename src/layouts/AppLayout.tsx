import type { PropsWithChildren } from 'react'
import type { PageDefinition, PageKey } from '../types/navigation'
import { PrimaryNav } from '../components/navigation/PrimaryNav'

interface AppLayoutProps extends PropsWithChildren {
  pages: PageDefinition[]
  activePage: PageKey
  onNavigate: (page: PageKey) => void
}

export function AppLayout({
  pages,
  activePage,
  onNavigate,
  children,
}: AppLayoutProps) {
  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <div className="app-shell__brand">
          <span className="app-shell__brand-mark">QT</span>
          <span className="app-shell__brand-text">Quiz Trainer</span>
        </div>
        <PrimaryNav items={pages} activePage={activePage} onNavigate={onNavigate} />
      </aside>
      <div className="app-shell__content">
        <main className="app-shell__main">{children}</main>
        <footer className="app-shell__footer">
          <small>Lab 3 • Project structure preview (no business logic yet)</small>
        </footer>
      </div>
    </div>
  )
}

