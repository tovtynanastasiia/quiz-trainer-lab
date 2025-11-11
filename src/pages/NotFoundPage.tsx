import { useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>Lost in the vocabulary maze?</h1>
        <p className={styles.copy}>
          The page you were looking for does not exist. You can return to the dashboard or revisit
          the previous screen.
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={() => navigate('/')}>
            Go to home
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}

