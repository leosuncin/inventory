export const environment = {
  production: true,
};

/**
 * @type import('cors').CorsOptions
 */
export const corsOptions = {
  credentials: true,
  origin: process.env.ALLOWED_ORIGINS?.split(/\s*,\s*/),
};

export const morganFormat = 'combined';

export const paginationLimit = 10;
export const paginationMaxLimit = 100;
