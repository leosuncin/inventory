import { Router } from 'express';
import { NOT_FOUND, getStatusText } from 'http-status-codes';

import { handleValidationError, verifyObjectID } from '../middleware';
import {
  createCategory,
  getOneCategory,
  listCategory,
} from '../services/category.service';

const router = Router();

router
  .route('/')
  .get(async (req, res) => {
    const categories = await listCategory();

    res.json(categories);
  })
  .post(async (req, res, next) => {
    try {
      const category = await createCategory(req.body);

      res.json(category);
    } catch (error) {
      next(error);
    }
  });
router.route('/:id([0-9a-f]{24}$)').get(verifyObjectID, async (req, res) => {
  const { id } = req.params;
  const category = await getOneCategory(id);

  if (!category) {
    res.status(NOT_FOUND).json({
      name: 'NotFoundError',
      message: `There isn't any category with id: ${id}`,
      statusCode: NOT_FOUND,
      error: getStatusText(NOT_FOUND),
    });
  } else {
    res.json(category);
  }
});
router.use(handleValidationError);

export default router;
