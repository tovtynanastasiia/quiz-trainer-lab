import { NavLink } from 'react-router-dom'
import type { NavItem } from '../../types/navigation'
import { classNames } from '../../lib/classNames'
import styles from './PrimaryNav.module.css'

interface PrimaryNavProps {
  items: NavItem[]
}

export function PrimaryNav({ items }: PrimaryNavProps) {
  return (
    <nav aria-label="Main">
      <ul className={styles.navList}>
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                classNames(styles.link, isActive && styles.linkActive)
              }
            >
              <span className={styles.navLabel}>{item.label}</span>
              <span className={styles.navDescription}>{item.description}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

