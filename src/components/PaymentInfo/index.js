import React from 'react'

const PaymentInfo = props => {
  return (
    <pre>
      {
        [
          'Accept cash',
          'E-Wallet: MOMO, MOCA, VINID, VNPAY, ZALOPAY, SHOPEEPAY, VIETTELPAY | 0971407794',
          '-------------------SCB ebanking-------------------',
          'STK: 14396880001',
          'Name: LE THANH DANH',
          'Branch: Cống Quỳnh',
          '-------------------MB-Bank-------------------',
          'STK: 0971407794',
          'Name: LE THANH DANH',
          '-------------------Techcombank-------------------',
          'STK: 0971407794',
          'Name: LE THANH DANH',
          '-------------------Techcombank-------------------',
          'STK: 19035877910015',
          'Name: LE THANH DANH'
        ].join('\n')
      }
    </pre>
  )
}

export default PaymentInfo
