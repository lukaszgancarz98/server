import {
    createOrderService,
    getAllOrdersService,
    getOrderByIdService,
    updateOrderByIdService,
    deleteOrderByIdService,
    getOrderByEmailService,
    updateOrderDetailsService,
    updateOrderPaymentToken,
    getOrderPaymentToken
} from "../models/orderModels.js";
import dotenv from "dotenv";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({ status, message, data });
};

dotenv.config();

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
};

export const updateOrderDetails = async (req, res, next) => {
    try {
        const updateOrder = await updateOrderDetailsService(req.params.id, req.body);
        handleResponse(res, 200, "Order updated successfully", updateOrder);
    } catch (err) {
        next(err);
    }
};

export const authPayment = async (req, res, next) => {
    //https://secure.payu.com/pl/standard/user/oauth/authorize original
    //https://secure.snd.payu.com/pl/standard/user/oauth/authorize sandbox
    const url = 'https://secure.snd.payu.com/pl/standard/user/oauth/authorize';
    const id = req.params.id;
    const params = new URLSearchParams();
    params.append('grant_type', process.env.GRANT_TYPE);
    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);

    const tokenExist = await getOrderPaymentToken(id);
    if (tokenExist.expire) {
        const now = new Date();
        if (now < new Date(tokenExist.expire)) {
            handleResponse(res, 200, "Payment authorized", tokenExist.token);

            return;
        }
    }

    try {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params.toString()
        });

        const data = await response.json();

        await updateOrderPaymentToken(data, id);
        
        handleResponse(res, 200, "Payment authorized", data.access_token);
    } catch (err) {
        next(err);
    }
};

export const payment = async (req, res, next) => {
    //https://secure.payu.com/api/v2_1/orders original
    //https://secure.snd.payu.com/api/v2_1/orders sandbox
    const url = 'https://secure.snd.payu.com/api/v2_1/orders';
    const id = req.params.id;
    const data = req.body;

    const getToken = await getOrderPaymentToken(id);
    if (getToken.expire) {
        const now = new Date();

        if (!(now < new Date(getToken.expire))) {
            next('Token expired, please refresh page');

            return;
        }

        const payload = {...data, merchantPosId: process.env.CLIENT_ID};

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken.token}`,
                },
                redirect: 'manual',
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            handleResponse(res, 200, "Payment authorized", data);
        } catch (err) {
            next(err);
        }
    }

    next('Token not found, please refresh page');
};
