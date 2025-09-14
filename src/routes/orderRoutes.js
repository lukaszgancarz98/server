import express from "express";
import { payment, authPayment, updateOrderDetails, createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById, getOrderByEmail } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/all", getAllOrders);
router.get("/auth/:id", authPayment);
router.post("/payment/:id", payment);
router.get("/email/:email", getOrderByEmail);
router.get("/:id", getOrderById);
router.post("/:id", updateOrderById);
router.post("/:id/addressDetails", updateOrderDetails);
router.delete("/:id", deleteOrderById);

export default router;