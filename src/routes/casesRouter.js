import express from 'express';
import {
    createCase,
    updateCase,
    getByEmail,
    getById,
    getByType,
} from '../controllers/fenixController.js';

const router = express.Router();

router.post('/apply', createCase);
router.post('/update/:id', updateCase);
router.get('/email/:email', getByEmail);
router.get('/id/:id', getById);
router.get('/:type', getByType);

export default router;
