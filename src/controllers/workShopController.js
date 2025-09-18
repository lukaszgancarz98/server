import {
    createWorkShopReceiverService,
    getAllWorkShopReceiversService,
    deleteWorkShopReceiverService,
} from "../models/workShopModel.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({ status, message, data });
};

export const createWorkShopReceiver = async (req, res, next) => {
    const { email, id } = req.body;

    try {
        const newReciver = await createWorkShopReceiverService(email, id);
        if (!newReciver) {
            return handleResponse(res, 400, "Reciver not created");
        }
        handleResponse(res, 201, "Reciver created successfully", newReciver);
    } catch (err) {
        next(err);
    }
};

export const getAllWorkShopReceivers = async (req, res, next) => {
    try {
        const users = await getAllWorkShopReceiversService();

        handleResponse(res, 200, "Recivers fetched successfully", users);
    } catch (err) {
        next(err);
    }
};

export const deleteWorkShopReceiver = async (req, res, next) => {
    try {
        const user = await deleteWorkShopReceiverService(req.params.id);
        if (!user) {
            return handleResponse(res, 404, "Reciver not found");
        }
        handleResponse(res, 200, "Reciver deleted successfully", user);
    } catch (err) {
        next(err);
    }
};
