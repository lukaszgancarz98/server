import {
    createOrderService,
    getAllOrdersService,
    getOrderByIdService,
    updateOrderByIdService,
    deleteOrderByIdService,
    getOrderByEmailService,
    updateOrderDetailsService,
    updateOrderPaymentToken,
    getOrderPaymentToken,
    updateProductAmountService,
    getOrderPaymentTokenAndId,
    getOrdersByIdService
} from "../models/orderModels.js";
import dotenv from "dotenv";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({ status, message, data });
};

dotenv.config();

//https://secure.payu.com original
//https://secure.snd.payu.com sandbox
const url = process.env.PAYMENT_PROD === "true" ? 'https://secure.payu.com' : 'https://secure.snd.payu.com';

export const createOrder = async (req, res, next) => {
    const { price, products, email } = req.body;
    try {
        const newOrder = await createOrderService(price, products, email);
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
    const { id, email, products, price, paymentorder_id, payment_id, payment_date, email_send } = req.body;
    const dataReceived = { email, products, price, paymentorder_id, payment_id, payment_date, email_send };
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

export const updateProductAmount = async (req, res, next) => {
    const { amount } = req.body;
    try {
        const updateOrder = await updateProductAmountService(req.params.id, amount);
        handleResponse(res, 200, "Order updated successfully", updateOrder);
    } catch (err) {
        next(err);
    }
};

export const authPayment = async (req, res, next) => {
    const link = `${url}/pl/standard/user/oauth/authorize`;
    const id = req.params.id;
    const params = new URLSearchParams();
    params.append('grant_type', process.env.GRANT_TYPE);
    params.append('client_id', process.env.CLIENT_ID);
    params.append('client_secret', process.env.CLIENT_SECRET);

    const tokenExist = await getOrderPaymentToken(id);

    if (tokenExist.payment) {
        handleResponse(res, 200, "Order paid", {});

        return;
    }

    if (tokenExist.expire && tokenExist.token) {

        const now = new Date();
        if (now < new Date(tokenExist.expire)) {

            handleResponse(res, 200, "Payment authorized", tokenExist.token);

            return;
        }
    }

    try {
        const response = await fetch(link, {
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
    const link = `${url}/api/v2_1/orders`;
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
            const response = await fetch(link, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken.token}`,
                },
                redirect: 'manual',
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            await updateOrderByIdService(id, [ [ 'paymentorder_id', data.orderId ] ]);
            
            handleResponse(res, 200, "Payment authorized", data);
        } catch (err) {
            next(err);
        }
    }

    next('Token not found, please refresh page');
};

export const checkPayment = async (req, res, next) => {
    const id = req.params.id;

    const getData = await getOrderPaymentTokenAndId(id);
    if (getData.expire) {
        const now = new Date();

        if (!(now < new Date(getData.expire))) {
            next('Token expired, please refresh page');

            return;
        }

        const link = `${url}/api/v2_1/orders/${getData.paymentorder_id}`;

        try {
            const response = await fetch(link, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getData.token}`,
                },
                redirect: 'manual',
            });

            const data = await response.json();
            
            handleResponse(res, 200, "Payment authorized", data);
        } catch (err) {
            next(err);
        }
    }

    next('Token not found, please refresh page');
};

export const getOrdersById = async (req, res, next) => {
    try {
        const updateOrder = await getOrdersByIdService(req.params.id);
        handleResponse(res, 200, "Order updated successfully", updateOrder);
    } catch (err) {
        next(err);
    }
};
