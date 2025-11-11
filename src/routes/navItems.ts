import type { NavItem } from '../types/navigation'

export const primaryNavItems: NavItem[] = [
  {
    to: '/',
    label: 'Home',
    description: 'Dashboard overview of current activity',
    end: true,
  },
  {
    to: '/modes',
    label: 'Learning modes',
    description: 'Explore available training experiences',
  },
  {
    to: '/sets',
    label: 'Word sets',
    description: 'Organise and maintain your vocabulary collections',
  },
  {
    to: '/auth/sign-in',
    label: 'Sign in',
    description: 'Authenticate to sync your data',
  },
  {
    to: '/auth/register',
    label: 'Register',
    description: 'Create a new learning account',
  },
  {
    to: '/account',
    label: 'Account',
    description: 'Preview of protected dashboard',
  },
]

