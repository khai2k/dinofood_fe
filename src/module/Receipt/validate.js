import * as yup from 'yup'

const numberFromStrOrZero = str => Number(str) || 0

export const memberSchema = yup.object().shape({
  // mail: yup.string().required(),
  // domain: yup.string().required(),
  email: yup.string().email().required(),
  price: yup.number().transform(numberFromStrOrZero).integer().min(1).required()
})

export const membersSchema = yup.array().of(memberSchema)

export const receiptSchema = yup.object().shape({
  title: yup.string().required(),
  shippingFee: yup.number().transform(numberFromStrOrZero).integer().min(0).default(0),
  discount: yup.number().transform(numberFromStrOrZero).integer().min(0).default(0),
  members: membersSchema
})

export default {
  memberSchema,
  membersSchema,
  receiptSchema
}
