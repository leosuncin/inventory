export const environment = {
  production: false,
};

/**
 * @type import('cors').CorsOptions
 */
export const corsOptions = {
  credentials: true,
  origin: 'http://localhost:4200',
};

export const morganFormat = 'dev';

export const paginationLimit = 10;
export const paginationMaxLimit = 100;
