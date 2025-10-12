import express from "express";
import { checkProducts, getOrdersById, checkPayment, updateProductAmount, payment, authPayment, updateOrderDetails, createOrder, getAllOrders, getOrderById, updateOrderById, deleteOrderById, getOrderByEmail } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create", createOrder);
router.get("/all/:page", getAllOrders);
router.get("/auth/:id", authPayment);
router.post("/payment/:id", payment);
router.get("/checkProducts/:id", checkProducts);
router.post("/payment/check/:id", checkPayment);
router.get("/email/:email", getOrderByEmail);
router.get("/all/:id", getOrdersById);
router.post("/product/:id", updateProductAmount);
router.get("/:id", getOrderById);
router.post("/:id", updateOrderById);
router.post("/:id/addressDetails", updateOrderDetails);
router.delete("/:id", deleteOrderById);

export default router;