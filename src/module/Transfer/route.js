import TransferHistory from '_module/Transfer/components/History'
import TransferCreate from '_module/Transfer/components/Create'

export default [
  {
    path: '/transfer',
    name: 'transfer.list',
    exact: true,
    component: TransferHistory
  },
  {
    path: '/transfer/create',
    name: 'transfer.create',
    exact: true,
    component: TransferCreate
  }
]
