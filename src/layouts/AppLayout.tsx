import { Outlet } from 'react-router-dom'
import { PrimaryNav } from '../components/navigation/PrimaryNav'
import styles from './AppLayout.module.css'
import { primaryNavItems } from '../routes/navItems'
import { AuthPreviewIndicator } from '../modules/auth/AuthPreviewIndicator'

export function AppLayout() {
  return (
    <div className={styles.appShell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.brandMark}>QT</span>
          <span className={styles.brandText}>Quiz Trainer</span>
        </div>
        <PrimaryNav items={primaryNavItems} />
        <AuthPreviewIndicator />
      </aside>
      <div className={styles.content}>
        <main className={styles.main}>
          <Outlet />
        </main>
        <footer className={styles.footer}>
          <small>Lab 5 • Router-focused iteration</small>
        </footer>
      </div>
    </div>
  )
}

