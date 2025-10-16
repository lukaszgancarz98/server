import {
    createUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserByIdService,
    loginUserService,
    authGoogleUserService,
    loginAdminUserService,
} from '../models/userModel.js';

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({ status, message, data });
};

export const createUser = async (req, res, next) => {
    const { name, email, surname, password, type } = req.body;

    try {
        const newUser = await createUserService(
            name,
            email,
            surname,
            password,
            type,
        );
        if (!newUser) {
            return handleResponse(res, 400, 'User not created');
        }
        handleResponse(res, 201, 'User created successfully', newUser);
    } catch (err) {
        next(err);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await getAllUsersService();
        handleResponse(res, 200, 'Users fetched successfully', users);
    } catch (err) {
        next(err);
    }
};

export const getUserById = async (req, res, next) => {
    try {
        const user = await getUserByIdService(req.params.id);
        if (!user) {
            return handleResponse(res, 404, 'User not found');
        }
        handleResponse(res, 200, 'User fetched successfully', user);
    } catch (err) {
        next(err);
    }
};

export const updateUserById = async (req, res, next) => {
    const { name, email } = req.body;
    try {
        const updatedUser = await updateUserByIdService(
            req.params.id,
            name,
            email,
        );
        handleResponse(res, 200, 'User updated successfully', updatedUser);
    } catch (err) {
        next(err);
    }
};

export const loginUser = async (req, res, next) => {
    const { email, password, type } = req.body;

    try {
        const login = await loginUserService(email, password, type);
        if (!login) {
            return handleResponse(res, 401, 'Invalid login credentials');
        }
        handleResponse(res, 200, 'User logged in successfully', login);
    } catch (err) {
        next(err);
    }
};

export const authGoogleUser = async (req, res, next) => {
    try {
        const login = await authGoogleUserService(req.body);
        if (!login) {
            return handleResponse(res, 401, 'Invalid login credentials');
        }
        handleResponse(res, 200, 'User logged in successfully', login);
    } catch (err) {
        next(err);
    }
};

export const loginAdminUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const login = await loginAdminUserService(email, password);
        if (!login) {
            return handleResponse(res, 401, 'Invalid login credentials');
        }
        handleResponse(res, 200, 'User logged in successfully', login);
    } catch (err) {
        next(err);
    }
};
