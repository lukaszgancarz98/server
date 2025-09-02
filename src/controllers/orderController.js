import {
    createOrderService,
    getAllOrdersService,
    getOrderByIdService,
    updateOrderByIdService,
    deleteOrderByIdService,
    getOrderByEmailService,
} from "../models/orderModels.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({ status, message, data });
};

export const createOrder = async (req, res, next) => {
    const { price, products, email, status } = req.body;
    try {
        const newOrder = await createOrderService(price, products, email, status);
        if (!newOrder) {
            return handleResponse(res, 400, "Order not created");
        }
        handleResponse(res, 201, "Order created successfully", newOrder);
    } catch (err) {
        next(err);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const users = await getAllOrdersService();
        handleResponse(res, 200, "Orders fetched successfully", users);
    } catch (err) {
        next(err);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const order = await getOrderByIdService(req.params.id);
        if (!order) {
            return handleResponse(res, 404, "Order not found");
        }
        handleResponse(res, 200, "Order fetched successfully", order);
    } catch (err) {
        next(err);
    }
};

export const updateOrderById = async (req, res, next) => {
    const { id, email, status, products, price } = req.body;
    const dataReceived = { email, status, products, price };
    const data = Object.entries(dataReceived).filter(([key, value]) => value !== undefined);
    try {
        const updateOrder = await updateOrderByIdService(id, data);
        handleResponse(res, 200, "Order updated successfully", updateOrder);
    } catch (err) {
        next(err);
    }
};

export const deleteOrderById = async (req, res, next) => {
    try {
        const request = await deleteOrderByIdService(req.params.id);
        handleResponse(res, 200, "Order deleted successfully", request);
    } catch (err) {
        next(err);
    }
};

export const getOrderByEmail = async (req, res, next) => {
    try {
        const order = await getOrderByEmailService(req.params.email);
        if (!order) {
            return handleResponse(res, 404, "Order not found");
        }
        handleResponse(res, 200, "Order fetched successfully", order);
    } catch (err) {
        next(err);
    }
}