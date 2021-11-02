import StoreDetail from '_module/Store/components/Detail'

export default [
  {
    path: '/store/:slug',
    name: 'store.detail',
    exact: true,
    auth: false,
    component: StoreDetail
  }
]
