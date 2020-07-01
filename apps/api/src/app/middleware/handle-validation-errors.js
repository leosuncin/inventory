import { UNPROCESSABLE_ENTITY, getStatusText } from 'http-status-codes';
import ValidationError from 'mongoose/lib/error/validation';

function transformValidationError(error) {
  const errors = Object.entries(error.errors).reduce(
    (prev, [key, value]) => ({ ...prev, [key]: value.message }),
    {},
  );

  return {
    name: 'ValidationError',
    statusCode: UNPROCESSABLE_ENTITY,
    message: 'Validation errors',
    error: getStatusText(UNPROCESSABLE_ENTITY),
    errors,
  };
}

/**
 * Handle Mongoose validation errors
 *
 * @param {Error} err
 * @param {Express.Request} req
 * @param {Object} res
 * @param {Function} next
 */
export function handleValidationError(err, req, res, next) {
  if (err instanceof ValidationError) {
    res.status(UNPROCESSABLE_ENTITY).json(transformValidationError(err));
  } else {
    next(err);
  }
}
