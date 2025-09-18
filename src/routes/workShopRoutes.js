import express from "express";
import { createWorkShopReceiver, getAllWorkShopReceivers, deleteWorkShopReceiver } from "../controllers/workShopController.js";

const router = express.Router();

router.post('/create', createWorkShopReceiver);
router.get('/all', getAllWorkShopReceivers);
router.delete('/delete/:id', deleteWorkShopReceiver);

export default router;