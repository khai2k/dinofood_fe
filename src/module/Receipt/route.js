import ReceiptRequestHistory from '_module/Receipt/components/History'
import ReceiptRequestCreate from '_module/Receipt/components/Create'
import ReceiptRequestEdit from '_module/Receipt/components/Edit'

export default [
  {
    path: '/receipts',
    name: 'receipt.list',
    exact: true,
    component: ReceiptRequestHistory
  },
  {
    path: '/receipts/create',
    name: 'receipt.create',
    exact: true,
    component: ReceiptRequestCreate
  },
  {
    path: '/receipts/:_id',
    name: 'receipt.edit',
    exact: true,
    component: ReceiptRequestEdit
  }
]
