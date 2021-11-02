import NotFound from '_module/Core/components/404'

import CoreRoutes from '_module/Core/route'
import AuthRoutes from '_module/Authentication/route'
import BalanceRoutes from '_module/Balance/route'
import PaymentRoutes from '_module/Payment/route'
import StoreRoutes from '_module/Store/route'
import TransferRoutes from '_module/Transfer/route'
import ReceiptRoutes from '_module/Receipt/route'

const routes = [
  ...CoreRoutes,
  ...AuthRoutes,
  ...BalanceRoutes,
  ...PaymentRoutes,
  ...StoreRoutes,
  ...TransferRoutes,
  ...ReceiptRoutes,

  // ... insert another routes here

  // last route handle 404 error
  {
    path: '*',
    auth: false,
    component: NotFound
  }
]

export default routes
