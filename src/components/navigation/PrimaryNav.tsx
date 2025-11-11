import type { PageDefinition, PageKey } from '../../types/navigation'

interface PrimaryNavProps {
  items: PageDefinition[]
  activePage: PageKey
  onNavigate: (page: PageKey) => void
}

export function PrimaryNav({ items, activePage, onNavigate }: PrimaryNavProps) {
  return (
    <nav aria-label="Main">
      <ul className="nav-list">
        {items.map((item) => (
          <li key={item.key}>
            <button
              type="button"
              className={item.key === activePage ? 'nav-link active' : 'nav-link'}
              onClick={() => onNavigate(item.key)}
            >
              <span className="nav-label">{item.label}</span>
              <span className="nav-description">{item.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

