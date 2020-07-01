import { Router } from 'express';
import { NOT_FOUND, getStatusText } from 'http-status-codes';

import { handleValidationError, verifyObjectID } from '../middleware';
import Product from '../models/product.model';

const router = Router();

router
  .route('/')
  .get(async (req, res) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const offset = Number(req.query.skip);
    const products = await Product.paginate(
      {},
      {
        populate: ['category'],
        limit,
        ...(offset ? { offset } : { page }),
      },
    );

    res.json(products);
  })
  .post(async (req, res, next) => {
    try {
      const product = new Product(req.body);
      await product.save();

      res.json(product);
    } catch (error) {
      next(error);
    }
  });
router.route('/:id([0-9a-f]{24}$)').get(verifyObjectID, async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate(['category']);

  if (!product) {
    res.status(NOT_FOUND).json({
      name: 'NotFoundError',
      message: `There isn't any product with id: ${id}`,
      statusCode: NOT_FOUND,
      error: getStatusText(NOT_FOUND),
    });
  } else {
    res.json(product);
  }
});
router.use(handleValidationError);

export default router;
