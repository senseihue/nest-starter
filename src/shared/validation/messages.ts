export const VALIDATION_MESSAGES = {
  page: {
    isInt: 'page must be an integer',
    min: 'page must be greater than or equal to 1',
  },
  limit: {
    isInt: 'limit must be an integer',
    min: 'limit must be greater than or equal to 1',
    max: 'limit must be less than or equal to 100',
  },
  sort: {
    isString: 'sort must be a string',
  },
  order: {
    isIn: 'order must be one of: asc, desc',
  },
} as const;
