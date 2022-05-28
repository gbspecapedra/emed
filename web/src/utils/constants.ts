export const EMED_TOKEN = 'emed.token'

export const EMED_USER = 'emed.user'

export const REGEX: {
  [key: string]: RegExp
} = {
  NOT_A_NUMBER: /[^\d]+/g,
  IS_INTEGER: /^[1-9]+[0-9]*$/,
  WHITE_SPACE: /\s/g,
  IS_NUMERIC: /^\d+$/,
  EMAIL_FORMAT: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
  ALPHANUMERIC_WITHOUT_SPACES: /^[\w-]+$/,
  PASSWORD_STRENGTH:
    /* eslint-disable-next-line */
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\\#^\.()\-+_=,;:/<’'>”"~|`{}[\]])[A-Za-z\d@$!%*?&\\#\.^()\-+_=,;:/<’'>”"~|`{}[\]]{7,}$/,
  CLEAN_URL: /^[a-zA-Z0-9-_/.]+$/g,
  BEGINS_WITH_SLASH: /^[/]/g,
}

export const GENDER = [
  {
    value: 'Agender',
  },
  {
    value: 'Bigender',
  },
  {
    value: 'Cisgender',
  },
  {
    value: 'Gender Expression',
  },
  {
    value: 'Gender Fluid',
  },
  {
    value: 'Genderqueer',
  },
  {
    value: 'Gender Variant',
  },
  {
    value: 'Mx.',
  },
  {
    value: 'Non-Binary',
  },
  {
    value: 'Passing',
  },
  {
    value: 'Third Gender',
  },
  {
    value: 'Transgender',
  },
  {
    value: 'Transgender man',
  },
  {
    value: 'Transgender woman',
  },
  {
    value: 'Two-Spirit',
  },
  {
    value: 'Ze / Hir',
  },
  {
    value: 'Prefer not to say',
  },
]
