interface PageHeaderProps {
  title: string
  subtitle?: string
  eyebrow?: string
}

export function PageHeader({ title, subtitle, eyebrow }: PageHeaderProps) {
  return (
    <header className="page-header">
      {eyebrow ? <p className="page-header__eyebrow">{eyebrow}</p> : null}
      <h1 className="page-header__title">{title}</h1>
      {subtitle ? <p className="page-header__subtitle">{subtitle}</p> : null}
    </header>
  )
}

