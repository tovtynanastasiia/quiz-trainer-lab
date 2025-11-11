import { PageHeader } from '../../components/common/PageHeader'
import { SectionCard } from '../../components/common/SectionCard'

export function SignUpPage() {
  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Create your Quiz Trainer account"
        subtitle="Set up a profile to track vocabulary progress and organise personalised word sets."
      />

      <SectionCard title="Account details">
        <form className="form-grid" aria-label="Sign up form">
          <label className="form-field">
            <span>Full name</span>
            <input type="text" name="fullName" placeholder="Olena Example" required />
          </label>
          <label className="form-field">
            <span>Email address</span>
            <input type="email" name="email" placeholder="you@example.com" required />
          </label>
          <label className="form-field">
            <span>Password</span>
            <input type="password" name="password" placeholder="Create a password" required />
          </label>
          <label className="form-field">
            <span>Confirm password</span>
            <input
              type="password"
              name="passwordConfirm"
              placeholder="Repeat your password"
              required
            />
          </label>
          <div className="form-actions">
            <button type="button" disabled>
              Register (coming soon)
            </button>
            <button type="button" className="text-button">
              Back to sign in
            </button>
          </div>
        </form>
      </SectionCard>
    </>
  )
}

