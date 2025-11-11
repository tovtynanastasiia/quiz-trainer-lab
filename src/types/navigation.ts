export type PageKey =
  | 'home'
  | 'learning-modes'
  | 'word-sets'
  | 'sign-in'
  | 'sign-up'

export interface PageDefinition {
  key: PageKey
  label: string
  description: string
}

