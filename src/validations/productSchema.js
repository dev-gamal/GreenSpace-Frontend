import * as yup from 'yup';

const PRODUCT_TYPES = ['VEGETABLE', 'FRUIT', 'SEED', 'PLANT'];
const EXCHANGE_TYPES = ['SALE', 'BARTER'];

export const productSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),

  description: yup
    .string()
    .trim()
    .max(500, 'Description must be at most 500 characters'),

  quantityKgOrUnits: yup
    .number()
    .typeError('Quantity must be a number')
    .required('Quantity is required')
    .min(0, 'Quantity cannot be negative'),

  price: yup
    .number()
    .typeError('Price must be a number')
    .min(0, 'Price cannot be negative')
    .when('exchangeType', {
      is: 'SALE',
      then: (schema) => schema.required('Price is required for sale items'),
      otherwise: (schema) => schema.nullable().transform((value, original) => (original === '' ? null : value)),
    }),

  productType: yup
    .string()
    .required('Product type is required')
    .oneOf(PRODUCT_TYPES, 'Invalid product type'),

  exchangeType: yup
    .string()
    .required('Exchange type is required')
    .oneOf(EXCHANGE_TYPES, 'Invalid exchange type'),

  imageUrl: yup
    .string()
    .trim()
    .url('Must be a valid URL')
    .nullable()
    .transform((value, original) => (original === '' ? null : value)),
});
