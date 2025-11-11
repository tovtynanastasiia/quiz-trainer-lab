import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuthPreview } from './useAuthPreview'
import styles from './AuthPreviewIndicator.module.css'

export function AuthPreviewIndicator() {
  const { isAuthenticated, signIn, signOut } = useAuthPreview()

  const statusLabel = useMemo(
    () => (isAuthenticated ? 'Authenticated preview' : 'Guest preview'),
    [isAuthenticated],
  )

  return (
    <div className={styles.panel} aria-live="polite">
      <span className={styles.statusDot} data-state={isAuthenticated ? 'on' : 'off'} />
      <div className={styles.textBlock}>
        <p className={styles.heading}>{statusLabel}</p>
        <p className={styles.copy}>
          This control simulates a guard without a real backend. Try visiting the{' '}
          <Link to="/account">account</Link> section.
        </p>
      </div>
      {isAuthenticated ? (
        <button type="button" onClick={signOut} className={styles.action}>
          Sign out
        </button>
      ) : (
        <button type="button" onClick={signIn} className={styles.action}>
          Quick sign in
        </button>
      )}
    </div>
  )
}

