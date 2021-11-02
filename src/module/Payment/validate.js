import * as yup from 'yup'
import options from './options'

const create = yup.object().shape({
  email: yup.string().email('Email invalid.').required('Email is required.'),
  type: yup.string().oneOf(options.requestTypes.map(({ value }) => value), 'Transaction type invalid.').required('Transaction type is required.'),
  amount: yup.number().integer('Amount must be integer.').min(1, 'Amount must be larger than 1.').required('Amount is required.'),
  paymentMethod: yup.string().oneOf(options.paymentMethods.map(({ value }) => value), 'Payment method invalid.').required('Payment method is required.'),
  description: yup.string()
})

const edit = yup.object().shape({
  type: yup.string().oneOf(options.requestTypes.map(({ value }) => value), 'Transaction type invalid.').required('Transaction type is required.'),
  amount: yup.number().integer('Amount must be integer.').min(1, 'Amount must be larger than 1.').required('Amount is required.'),
  paymentMethod: yup.string().oneOf(options.paymentMethods.map(({ value }) => value), 'Payment method invalid.').required('Payment method is required.'),
  description: yup.string()
})

export default {
  edit,
  create
}
