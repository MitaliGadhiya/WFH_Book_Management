import * as yup from 'yup'

export const userSchema = yup.object().shape({
    name: yup.string().required('name is required'),
    email: yup
      .string()
      .email('invalid email-id')
      .required('email id is required'),
    password: yup.string().required('password must be required'),
    role: yup.string().required('role is required')
  })

export const categorySchema = yup.object().shape({
    name: yup.string().required('Name is required')
  })

export const bookSchema = yup.object().shape({
    title: yup.string().required('title is required'),
    author: yup.string().required('Author name is required'),
    category: yup.string().required('category is required'),
    ISBN: yup.string().required('ISBN number is required'),
    description: yup.string().required('description is required'),
    price: yup.number().required('price should be mention')
  })

export const authorSchema = yup.object().shape({
    name: yup.string().required('name is required'),
    biography: yup.string().required('biography is required'),
    nationality: yup.string().required('nationality is required')
  })