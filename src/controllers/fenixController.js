import {
    createCaseService,
    addToListRecruitmentService,
    getByTypeService,
    getByEmailService,
    getByIdService,
    updateCaseService,
    addToListService,
} from '../models/fenixModel.js';

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({ status, message, data });
};

export const createCase = async (req, res, next) => {
    const { name, email, description } = req.body;

    try {
        const newCase = await createCaseService(
            name,
            email,
            description,
            'case',
        );
        if (!newCase) {
            return handleResponse(res, 400, 'Case not created');
        }
        handleResponse(res, 201, 'Case created successfully', newCase);
    } catch (err) {
        next(err);
    }
};

export const getByType = async (req, res, next) => {
    const { type } = req.params;

    try {
        const getCases = await getByTypeService(type);
        if (!getCases || getCases.length === 0) {
            return handleResponse(
                res,
                404,
                'No cases found for the given type',
            );
        }
        handleResponse(res, 200, 'Cases retrieved successfully', getCases);
    } catch (err) {
        next(err);
    }
};

export const getByEmail = async (req, res, next) => {
    const { email } = req.params;

    try {
        const getCases = await getByEmailService(email);
        if (!getCases || getCases.length === 0) {
            return handleResponse(
                res,
                404,
                'No cases found for the given email',
            );
        }
        handleResponse(res, 200, 'Cases retrieved successfully', getCases);
    } catch (err) {
        next(err);
    }
};

export const getById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const getCase = await getByIdService(id);
        if (!getCase) {
            return handleResponse(res, 404, 'No case found for the given ID');
        }
        handleResponse(res, 200, 'Case retrieved successfully', getCase);
    } catch (err) {
        next(err);
    }
};

export const updateCase = async (req, res, next) => {
    const { id } = req.params;
    const { name, email, description, type } = req.body;
    try {
        const updatedCase = await updateCaseService(
            id,
            name,
            email,
            description,
            type,
        );
        if (!updatedCase) {
            return handleResponse(res, 404, 'No case found for the given ID');
        }
        handleResponse(res, 200, 'Case updated successfully', updatedCase);
    } catch (err) {
        next(err);
    }
};

export const addToList = async (req, res, next) => {
    const { name, email } = req.body;
    try {
        const newEntry = await addToListService(name, email, 'course');
        if (newEntry.exists) {
            return handleResponse(
                res,
                400,
                'Wpis już istnieje dla tego adresu e-mail i typu',
            );
        }
        if (!newEntry) {
            return handleResponse(res, 400, 'Entry not added to the list');
        }
        handleResponse(
            res,
            201,
            'Entry added to the list successfully',
            newEntry,
        );
    } catch (err) {
        next(err);
    }
};

export const addToListRecruitment = async (req, res, next) => {
    const { name, email } = req.body;
    try {
        const newEntry = await addToListRecruitmentService(
            name,
            email,
            'recruitment',
        );
        if (newEntry.exists) {
            return handleResponse(
                res,
                400,
                'Wpis już istnieje dla tego adresu e-mail i typu',
            );
        }
        if (!newEntry) {
            return handleResponse(
                res,
                400,
                'Entry not added to the recruitment list',
            );
        }
        handleResponse(
            res,
            201,
            'Entry added to the recruitment list successfully',
            newEntry,
        );
    } catch (err) {
        next(err);
    }
};
