import { PageHeader } from '../components/common/PageHeader'
import { SectionCard } from '../components/common/SectionCard'
import styles from './HomePage.module.css'

export function HomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Quiz Trainer workspace"
        subtitle="A hub that collects your current learning goals, progress and planned training sessions."
      />

      <div className={styles.grid}>
        <SectionCard
          title="Learning streak"
          description="Track how consistently you return to your flashcards."
        >
          <ul className={styles.descriptionList}>
            <li>
              <strong>Current streak:</strong> 4 days
            </li>
            <li>
              <strong>Longest streak:</strong> 12 days
            </li>
            <li>
              <strong>Next milestone:</strong> Maintain momentum for 3 more days
            </li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Upcoming sessions"
          description="Preview of scheduled training modes for the week."
        >
          <ol className={styles.verticalList}>
            <li>Monday — Accuracy mode (focus on irregular verbs)</li>
            <li>Wednesday — Learning mode (new travel vocabulary)</li>
            <li>Friday — Speed mode (rapid recall drill)</li>
          </ol>
        </SectionCard>

        <SectionCard
          title="Recently added word sets"
          description="The last groups of terms you imported or created manually."
        >
          <ul className={styles.verticalList}>
            <li>Essential travel phrases — 24 terms</li>
            <li>Business negotiations — 18 terms</li>
            <li>Academic connectors — 12 terms</li>
          </ul>
        </SectionCard>
      </div>
    </>
  )
}

