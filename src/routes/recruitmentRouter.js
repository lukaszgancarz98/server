import express from 'express';
import { addToListRecruitment } from '../controllers/fenixController.js';

const router = express.Router();

router.post('/apply', addToListRecruitment);

export default router;
