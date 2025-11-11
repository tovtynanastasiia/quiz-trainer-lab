import type { PropsWithChildren, ReactNode } from 'react'
import { classNames } from '../../lib/classNames'
import styles from './SectionCard.module.css'

interface SectionCardProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function SectionCard({
  title,
  description,
  icon,
  action,
  className,
  children,
}: PropsWithChildren<SectionCardProps>) {
  return (
    <article className={classNames(styles.root, className)}>
      <div className={styles.header}>
        {icon ? <div className={styles.icon}>{icon}</div> : null}
        <div>
          <h2 className={styles.title}>{title}</h2>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>
        {action ? <div className={styles.action}>{action}</div> : null}
      </div>
      {children ? <div className={styles.content}>{children}</div> : null}
    </article>
  )
}

