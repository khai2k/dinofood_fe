import React from 'react'
import generate from '_route/generate'
import PaymentIcon from '@material-ui/icons/Payment'
import TransferIcon from '@material-ui/icons/SettingsEthernet'
import ReceiptIcon from '@material-ui/icons/Receipt'
import MoneyIcon from '@material-ui/icons/Money'
import VpnKey from '@material-ui/icons/VpnKey'

export const loggedInDropdown = [
  {
    icon: <MoneyIcon/>,
    label: 'Balance history',
    path: generate('balance')
  },
  {
    icon: <ReceiptIcon/>,
    label: 'Receipt history',
    path: generate('receipt.list')
  },
  {
    icon: <PaymentIcon/>,
    label: 'Payment history',
    path: generate('paymentRequest.list')
  },
  {
    icon: <TransferIcon/>,
    label: 'Transfer history',
    path: generate('transfer.list')
  },
  {
    icon: <VpnKey/>,
    label: 'Change password',
    path: generate('changePassword')
  }
]

export const headerMenuList = [
  {
    id: 0,
    label: 'Đồ ăn'
  },
  {
    id: 1,
    label: 'Đặt bàn'
  },
  {
    id: 2,
    label: 'Thực phẩm'
  },
  {
    id: 3,
    label: 'Sản phẩm'
  },
  {
    id: 4,
    label: 'Giặt ủi'
  },
  {
    id: 5,
    label: 'Làm đẹp'
  }
]
