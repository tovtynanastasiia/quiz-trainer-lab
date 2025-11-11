import { PageHeader } from '../../components/common/PageHeader'
import { SectionCard } from '../../components/common/SectionCard'
import styles from './AuthPage.module.css'

export function SignInPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Access your learning space"
        subtitle="Sign in to sync progress across devices and resume your current streak."
      />

      <SectionCard title="Credentials">
        <form className={styles.form} aria-label="Sign in form">
          <label className={styles.field}>
            <span className={styles.label}>Email address</span>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="you@example.com"
              required
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Password</span>
            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </label>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} disabled>
              Sign in (coming soon)
            </button>
            <button type="button" className={styles.ghost}>
              Forgot password?
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard title="New to Quiz Trainer?">
        <p>
          Create an account to unlock personalised recommendations, synchronised progress,
          and collaborative study sets. Registration will be available in the next iteration.
        </p>
      </SectionCard>
    </>
  )
}

