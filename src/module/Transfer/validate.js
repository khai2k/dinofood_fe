import * as yup from 'yup'

const create = yup.object().shape({
  email: yup.string().email('Email invalid.').required('Email is required.'),
  amount: yup.number().integer('Amount must be integer.').min(1, 'Amount must be larger than 1.').required('Amount is required.'),
  description: yup.string().required('Description is required.')
})

export default {
  create
}
