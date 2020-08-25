import { lazy } from 'react'
import LazySuspenseComponent from '@/components/LazySuspenseComponent'

const Home = lazy(() => import('../views/Home'))
const Table = lazy(() => import('../views/Table'))

export default [
  {
    path: '/',
    exact: true,
    component: LazySuspenseComponent(Table),
  },
  {
    path: '/home',
    exact: true,
    component: LazySuspenseComponent(Home),
  },
]
