import { useContext } from 'react'
import { AuthPreviewContext } from './AuthPreviewContext'

export function useAuthPreview() {
  const context = useContext(AuthPreviewContext)
  if (!context) {
    throw new Error('useAuthPreview must be used within an AuthPreviewProvider')
  }
  return context
}

