import express from "express";
import { updateOrderDetails, createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById, getOrderByEmail } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/all", getAllOrders);
router.get("/:id", getOrderById);
router.post("/:id", updateOrderById);
router.post("/:id/addressDetails", updateOrderDetails);
router.delete("/:id", deleteOrderById);
router.get("/email/:email", getOrderByEmail);

export default router;