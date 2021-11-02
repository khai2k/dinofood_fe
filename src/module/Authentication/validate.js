import * as yup from 'yup'

export const loginValid = yup.object().shape({
  email: yup.string().email('Email invalid.').required('Email is required.'),
  password: yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.')
})

export const registerValid = yup.object().shape({
  email: yup.string().email('Email invalid.').required('Email is required.'),
  password: yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
  passwordConfirm: yup.string().min(6, 'Password confirm must be at least 6 characters.').oneOf([ yup.ref('password'), null ], 'Passwords must match.')
})

export const forgotPasswordValid = yup.object().shape({
  email: yup.string().email('Email invalid.').required('Email is required.')
})

export const resetPasswordValid = yup.object().shape({
  token: yup.string().required('Reset token is required.'),
  password: yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
  passwordConfirm: yup.string().min(6, 'Password confirm must be at least 6 characters.').oneOf([ yup.ref('password'), null ], 'Passwords must match.')
})

export const changePasswordValid = yup.object().shape({
  currentPassword: yup.string().min(6, 'Password must be at least 6 characters.').required('Current password is required.'),
  password: yup.string().min(6, 'Password must be at least 6 characters.').required('Password is required.'),
  passwordConfirm: yup.string().min(6, 'Password confirm must be at least 6 characters.').oneOf([ yup.ref('password'), null ], 'Passwords must match.')
})
