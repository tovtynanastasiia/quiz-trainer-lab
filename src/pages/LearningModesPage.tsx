import { PageHeader } from '../components/common/PageHeader'
import { SectionCard } from '../components/common/SectionCard'
import styles from './LearningModesPage.module.css'

export function LearningModesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Modes"
        title="Learning experiences"
        subtitle="Each training mode focuses on a different learning skill. Configure the details before launching a session."
      />

      <div className={styles.grid}>
        <SectionCard
          title="Learning mode"
          description="Guided walkthrough with hints and immediate feedback."
        >
          <p className={styles.copy}>
            Choose a primary word set and optionally mix in review terms from
            previous sessions. Ideal for introducing a new topic with contextual hints.
          </p>
        </SectionCard>

        <SectionCard
          title="Accuracy mode"
          description="Time-boxed drill that checks precision under gentle pressure."
        >
          <p className={styles.copy}>
            Configure the number of terms and a timer limit. The goal is to answer
            with exact spelling and accents. A detailed review is generated afterwards.
          </p>
        </SectionCard>

        <SectionCard
          title="Speed mode"
          description="Rapid-fire practice to improve recall and typing speed."
        >
          <p className={styles.copy}>
            Pick multiple sets to combine into a quick sprint. Words cycle automatically
            until the timer ends, recording your throughput per minute.
          </p>
        </SectionCard>

        <SectionCard
          title="Flashcards"
          description="Classic front/back cards with spaced repetition intervals."
        >
          <p className={styles.copy}>
            Ideal for mobile-friendly review sessions. Swipe through cards, mark how
            well you remembered the term, and let the algorithm schedule the next review.
          </p>
        </SectionCard>
      </div>
    </>
  )
}

