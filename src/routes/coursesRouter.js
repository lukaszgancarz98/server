import express from 'express';
import { addToList, getByType } from '../controllers/fenixController.js';

const router = express.Router();

router.post('/apply', addToList);
router.get('/:type', getByType);

export default router;
