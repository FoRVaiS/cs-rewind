const keys = [
  'APP_NAME',

  // Domain-specific
  'LANDING_PAGE_SLOGAN',
  'LANDING_PAGE_DESCRIPTION',

  // General Text
  'LOGIN',
  'REGISTER',
] as const;

export type Locale = Record<typeof keys[number], string>;
