import * as yup from 'yup';

export const gardenSchema = yup.object().shape({
  title: yup
    .string()
    .trim()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must be at most 100 characters'),

  description: yup
    .string()
    .trim()
    .max(1000, 'Description must be at most 1000 characters'),

  areaSize: yup
    .number()
    .typeError('Area size must be a number')
    .required('Area size is required')
    .positive('Area size must be a positive number')
    .max(100000, 'Area size seems too large'),

  address: yup
    .string()
    .trim()
    .max(200, 'Address must be at most 200 characters'),

  city: yup
    .string()
    .trim()
    .required('City is required')
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be at most 100 characters'),

  postalCode: yup
    .string()
    .trim()
    .matches(/^[0-9]{0,10}$/, 'Postal code must be numeric (up to 10 digits)'),

  rules: yup
    .string()
    .trim()
    .max(500, 'Rules must be at most 500 characters'),

  hasTools: yup.boolean(),

  photoUrls: yup
    .string()
    .trim()
    .test(
      'valid-urls',
      'Each photo URL must be a valid URL',
      (value) => {
        if (!value) return true;
        const urls = value.split(',').map((u) => u.trim()).filter((u) => u.length > 0);
        const urlRegex = /^https?:\/\/.+/i;
        return urls.every((url) => urlRegex.test(url));
      }
    ),

  latitude: yup
    .number()
    .nullable()
    .transform((value, original) => (original === '' ? null : value))
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90'),

  longitude: yup
    .number()
    .nullable()
    .transform((value, original) => (original === '' ? null : value))
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180'),
});
