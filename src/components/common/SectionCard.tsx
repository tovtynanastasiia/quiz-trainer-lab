import type { PropsWithChildren, ReactNode } from 'react'

interface SectionCardProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function SectionCard({
  title,
  description,
  icon,
  action,
  children,
}: PropsWithChildren<SectionCardProps>) {
  return (
    <article className="section-card">
      <div className="section-card__header">
        {icon ? <div className="section-card__icon">{icon}</div> : null}
        <div>
          <h2 className="section-card__title">{title}</h2>
          {description ? (
            <p className="section-card__description">{description}</p>
          ) : null}
        </div>
        {action ? <div className="section-card__action">{action}</div> : null}
      </div>
      {children ? (
        <div className="section-card__content">{children}</div>
      ) : null}
    </article>
  )
}

