import PaymentRequestHistory from '_module/Payment/components/History'
import PaymentRequestCreate from '_module/Payment/components/Create'
import PaymentRequestEdit from '_module/Payment/components/Edit'

export default [
  {
    path: '/payment-requests',
    name: 'paymentRequest.list',
    exact: true,
    component: PaymentRequestHistory
  },
  {
    path: '/payment-requests/create',
    name: 'paymentRequest.create',
    exact: true,
    auth: false,
    component: PaymentRequestCreate
  },
  {
    path: '/payment-requests/:_id',
    name: 'paymentRequest.edit',
    exact: true,
    component: PaymentRequestEdit
  }
]
