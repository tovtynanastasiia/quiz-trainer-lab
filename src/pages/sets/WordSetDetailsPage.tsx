import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { SectionCard } from '../../components/common/SectionCard'
import styles from '../WordSetsPage.module.css'

const SAMPLE_SET_DESCRIPTIONS: Record<string, string> = {
  'travel-phrases': 'Essential expressions for navigating airports, hotels, and local transportation.',
  'business-negotiations':
    'Vocabulary tailored for negotiations, formal meetings, and stakeholder updates.',
  'academic-connectors': 'Linking phrases and discourse markers for academic writing.',
}

export function WordSetDetailsPage() {
  const navigate = useNavigate()
  const { setId = 'unknown' } = useParams()

  const description = useMemo(
    () =>
      SAMPLE_SET_DESCRIPTIONS[setId] ??
      'This is a placeholder description for a custom set. In future iterations the details will be fetched from Supabase.',
    [setId],
  )

  return (
    <>
      <PageHeader
        eyebrow="Word set"
        title={`Set: ${setId.replace(/-/g, ' ')}`}
        subtitle="Dynamic route example. The slug comes directly from the URL parameters."
      />

      <SectionCard title="Overview">
        <p className={styles.copy}>{description}</p>
      </SectionCard>

      <SectionCard title="Next steps">
        <p className={styles.copy}>
          In the fully featured version this area will display statistics, flashcard previews,
          and collaboration controls. For now it demonstrates how nested routes can present
          contextual content.
        </p>
        <div className={styles.actions}>
          <button type="button" onClick={() => navigate(-1)}>
            Go back
          </button>
          <button type="button" onClick={() => navigate('/sets')}>
            View all sets
          </button>
        </div>
      </SectionCard>
    </>
  )
}

