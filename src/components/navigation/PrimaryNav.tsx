import type { PageDefinition, PageKey } from '../../types/navigation'
import { classNames } from '../../lib/classNames'
import styles from './PrimaryNav.module.css'

interface PrimaryNavProps {
  items: PageDefinition[]
  activePage: PageKey
  onNavigate: (page: PageKey) => void
}

export function PrimaryNav({ items, activePage, onNavigate }: PrimaryNavProps) {
  return (
    <nav aria-label="Main">
      <ul className={styles.navList}>
        {items.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              className={classNames(
                styles.navButton,
                item.key === activePage && styles.navButtonActive,
              )}
              onClick={() => onNavigate(item.key)}
            >
              <span className={styles.navLabel}>{item.label}</span>
              <span className={styles.navDescription}>{item.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

