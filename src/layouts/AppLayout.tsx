import type { PropsWithChildren } from 'react'
import type { PageDefinition, PageKey } from '../types/navigation'
import { PrimaryNav } from '../components/navigation/PrimaryNav'
import styles from './AppLayout.module.css'

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
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>QT</span>
          <span className={styles.brandText}>Quiz Trainer</span>
        </div>
        <PrimaryNav items={pages} activePage={activePage} onNavigate={onNavigate} />
      </aside>
      <div className={styles.content}>
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          <small>Lab 4 • Styled interface prototype (no business logic yet)</small>
        </footer>
      </div>
    </div>
  )
}

