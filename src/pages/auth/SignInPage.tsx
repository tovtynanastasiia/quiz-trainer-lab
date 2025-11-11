import { PageHeader } from '../../components/common/PageHeader'
import { SectionCard } from '../../components/common/SectionCard'

export function SignInPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Access your learning space"
        subtitle="Sign in to sync progress across devices and resume your current streak."
      />

      <SectionCard title="Credentials">
        <form className="form-grid" aria-label="Sign in form">
          <label className="form-field">
            <span>Email address</span>
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input type="password" name="password" placeholder="••••••••" required />
          </label>
          <div className="form-actions">
            <button type="button" disabled>
              Sign in (coming soon)
            </button>
            <button type="button" className="text-button">
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

