import { Types } from 'mongoose';

/**
 * Validate `id` parameter
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */
export const verifyObjectID = (req, res, next) => {
  const { id } = req.params;

  if (Types.ObjectId.isValid(id)) {
    next();
  } else {
    res.status(400).json({
      name: 'TypeError',
      message: 'Parámetro «id» no es un identificador valido',
      statusCode: 400,
      error: 'Bad Request',
    });
  }
};
