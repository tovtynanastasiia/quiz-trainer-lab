import { PageHeader } from '../../components/common/PageHeader'
import { SectionCard } from '../../components/common/SectionCard'
import styles from './AccountOverviewPage.module.css'
import { useAuthPreview } from '../../modules/auth/useAuthPreview'

export function AccountOverviewPage() {
  const { signOut } = useAuthPreview()

  return (
    <>
      <PageHeader
        eyebrow="Account"
        title="Welcome back, learner!"
        subtitle="Protected route example. This page is only available after triggering the quick sign-in toggle."
      />

      <div className={styles.grid}>
        <SectionCard title="Profile snapshot">
          <dl className={styles.infoList}>
            <div>
              <dt>Learning focus</dt>
              <dd>Advanced grammar for academic writing</dd>
            </div>
            <div>
              <dt>Weekly goal</dt>
              <dd>Complete 3 accuracy sessions and 2 speed sprints</dd>
            </div>
            <div>
              <dt>Active streak</dt>
              <dd>4 days (preview data)</dd>
            </div>
          </dl>
        </SectionCard>

        <SectionCard title="Manage access">
          <p className={styles.copy}>
            In future iterations this area will show security settings, connected providers, and
            session history.
          </p>
          <button type="button" className={styles.signOut} onClick={signOut}>
            Sign out preview
          </button>
        </SectionCard>
      </div>
    </>
  )
}

