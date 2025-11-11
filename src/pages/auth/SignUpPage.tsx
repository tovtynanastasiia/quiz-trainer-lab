import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { SectionCard } from '../../components/common/SectionCard'
import styles from './AuthPage.module.css'
import { useAuthPreview } from '../../modules/auth/useAuthPreview'

export function SignUpPage() {
  const navigate = useNavigate()
  const { signIn, setRedirectPath } = useAuthPreview()

  const handleRegister = () => {
    signIn()
    setRedirectPath(null)
    navigate('/account', { replace: true })
  }

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Create your Quiz Trainer account"
        subtitle="Set up a profile to track vocabulary progress and organise personalised word sets."
      />

      <SectionCard title="Account details">
        <form className={styles.form} aria-label="Sign up form">
          <label className={styles.field}>
            <span className={styles.label}>Full name</span>
            <input
              className={styles.input}
              type="text"
              name="fullName"
              placeholder="Olena Example"
              required
            />
          </label>
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
              placeholder="Create a password"
              required
            />
          </label>
          <label className={styles.field}>
            <span className={styles.label}>Confirm password</span>
            <input
              className={styles.input}
              type="password"
              name="passwordConfirm"
              placeholder="Repeat your password"
              required
            />
          </label>
          <div className={styles.actions}>
            <button type="button" className={styles.primary} onClick={handleRegister}>
              Register preview
            </button>
            <button
              type="button"
              className={styles.ghost}
              onClick={() => navigate('/auth/sign-in')}
            >
              Back to sign in
            </button>
          </div>
        </form>
      </SectionCard>
    </>
  )
}

