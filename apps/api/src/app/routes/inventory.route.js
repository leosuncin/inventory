import { Router } from 'express';
import { CREATED, NOT_FOUND, getStatusText } from 'http-status-codes';

import { handleValidationError, verifyObjectID } from '../middleware';
import Inventory from '../models/inventory.model';

const router = Router();

router
  .route('/')
  .get(async (req, res) => {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);
    const offset = Number(req.query.skip);
    const inventories = await Inventory.paginate(
      {},
      {
        populate: ['category', 'product'],
        limit,
        ...(offset ? { offset } : { page }),
      },
    );

    res.json(inventories);
  })
  .post(async (req, res, next) => {
    try {
      const inventory = new Inventory(req.body);

      await inventory.save();

      res.status(CREATED).json(inventory);
    } catch (error) {
      next(error);
    }
  });
router.route('/:id([0-9a-f]{24}$)').get(verifyObjectID, async (req, res) => {
  const { id } = req.params;
  const inventory = await Inventory.findById(id);

  if (!inventory) {
    res.status(NOT_FOUND).json({
      name: 'NotFoundError',
      message: `There isn't any inventory with id: ${id}`,
      statusCode: NOT_FOUND,
      error: getStatusText(NOT_FOUND),
    });
  } else {
    res.json(inventory);
  }
});
router.use(handleValidationError);

export default router;
