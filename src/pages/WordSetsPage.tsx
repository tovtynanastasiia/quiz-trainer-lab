import { Link, Outlet } from 'react-router-dom'
import { PageHeader } from '../components/common/PageHeader'
import { SectionCard } from '../components/common/SectionCard'
import styles from './WordSetsPage.module.css'

export function WordSetsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Manage word collections"
        subtitle="Organise vocabulary by theme, difficulty, or upcoming exam module."
      />

      <div className={styles.grid}>
        <SectionCard title="Create a new set">
          <p className={styles.copy}>
            Start from a blank template or import a CSV file with existing terms. You can
            attach tags, choose a default learning mode, and invite collaborators.
          </p>
        </SectionCard>

        <SectionCard title="Bulk editing">
          <p className={styles.copy}>
            Need to rename or re-categorise many words at once? The bulk editor provides
            spreadsheet-style controls, quick filters, and inline validations.
          </p>
        </SectionCard>

        <SectionCard title="Sharing and collaboration">
          <p className={styles.copy}>
            Share specific sets with classmates or tutors. Collaborators can suggest new
            terms or comment on tricky phrases without altering your original content.
          </p>
        </SectionCard>

        <SectionCard title="Progress snapshots">
          <p className={styles.copy}>
            Each set tracks accuracy, speed and streak insights. Review the snapshot before
            planning the next study session to focus on weaker areas.
          </p>
        </SectionCard>

        <SectionCard title="Featured sets">
          <ul className={styles.list}>
            <li>
              <Link to="/sets/travel-phrases">Travel phrases</Link>
            </li>
            <li>
              <Link to="/sets/business-negotiations">Business negotiations</Link>
            </li>
            <li>
              <Link to="/sets/academic-connectors">Academic connectors</Link>
            </li>
          </ul>
        </SectionCard>
      </div>

      <Outlet />
    </>
  )
}

