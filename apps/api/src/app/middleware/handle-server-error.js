import { INTERNAL_SERVER_ERROR, getStatusText } from 'http-status-codes';

import { environment } from '../../environments/environment';

/**
 * Handle Mongoose validation errors
 *
 * @param {Error} err
 * @param {Object} req
 * @param {Object} res
 */
export function handleServerError(err, req, res, next) {
  if (!err) return next();

  console.error(`[${req.method}] ${req.url}`, err.stack);

  res.status(INTERNAL_SERVER_ERROR).json({
    name: 'ServerError',
    statusCode: INTERNAL_SERVER_ERROR,
    message: environment.production ? 'Algo falló en el servidor' : err.message,
    error: getStatusText(INTERNAL_SERVER_ERROR),
  });
}
