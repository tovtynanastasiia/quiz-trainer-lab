import { PageHeader } from '../components/common/PageHeader'
import { SectionCard } from '../components/common/SectionCard'

export function HomePage() {
  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Quiz Trainer workspace"
        subtitle="A hub that collects your current learning goals, progress and planned training sessions."
      />

      <div className="page-grid">
        <SectionCard
          title="Learning streak"
          description="Track how consistently you return to your flashcards."
        >
          <ul className="description-list">
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
          <ol className="vertical-list">
            <li>Monday — Accuracy mode (focus on irregular verbs)</li>
            <li>Wednesday — Learning mode (new travel vocabulary)</li>
            <li>Friday — Speed mode (rapid recall drill)</li>
          </ol>
        </SectionCard>

        <SectionCard
          title="Recently added word sets"
          description="The last groups of terms you imported or created manually."
        >
          <ul className="vertical-list">
            <li>Essential travel phrases — 24 terms</li>
            <li>Business negotiations — 18 terms</li>
            <li>Academic connectors — 12 terms</li>
          </ul>
        </SectionCard>
      </div>
    </>
  )
}

