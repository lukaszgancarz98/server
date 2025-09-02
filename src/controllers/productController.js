import {
    createProductService,
    getAllProductService,
    getProductByIdService,
    updateProductByIdService,
    deleteProductByIdService,
    createProductTypeService,
    getProductTypesService,
    getProductTypesByIdService,
    updateProductTypesByIdService,
    deleteProductTypeService,
    createProductWithProductsTypesService,
    getProductTypesByProductIdService,
} from "../models/productModels.js";

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({ status, message, data });
};

export const createProduct = async (req, res, next) => {
    try {
        const newProduct = await createProductService(req.body);
        if (!newProduct) {
            return handleResponse(res, 400, "Product not created");
        }
        handleResponse(res, 201, "Product created successfully", newProduct);
    } catch (err) {
        next(err);
    }
};

export const getAllProducts = async (req, res, next) => {
    try {
        const users = await getAllProductService();
        handleResponse(res, 200, "Products fetched successfully", users);
    } catch (err) {
        next(err);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await getProductByIdService(req.params.id);
        if (!product) {
            return handleResponse(res, 404, "Product not found");
        }
        handleResponse(res, 200, "Product fetched successfully", product);
    } catch (err) {
        next(err);
    }
};

export const updateProductById = async (req, res, next) => {
    try {
        const updateProduct = await updateProductByIdService(req.params.id, req.body);
        handleResponse(res, 200, "Product updated successfully", updateProduct);
    } catch (err) {
        next(err);
    }
};

export const deleteProductById = async (req, res, next) => {
    try {
        const req = await deleteProductByIdService(req.params.id);
        handleResponse(res, 200, "Product deleted successfully", req);
    } catch (err) {
        next(err);
    }
};

export const createProductType = async (req, res, next) => {
    try {
        const product = await createProductTypeService(req.body);
        if (!product) {
            return handleResponse(res, 404, "ProductType not created");
        }
        handleResponse(res, 200, "ProductType created successfully", product);
    } catch (err) {
        next(err);
    }
}

export const getProductTypes = async (req, res, next) => {
    console.log('xDDDDDD')
    try {
        const product = await getProductTypesService();
        if (!product) {
            return handleResponse(res, 404, "ProductTypes not found");
        }
        handleResponse(res, 200, "ProductTypes fetched successfully", product);
    } catch (err) {
        next(err);
    }
}

export const getProductTypeById = async (req, res, next) => {
    try {
        const product = await getProductTypesByIdService(req.params.id);
        if (!product) {
            return handleResponse(res, 404, "ProductType not found");
        }
        handleResponse(res, 200, "ProductType fetched successfully", product);
    } catch (err) {
        next(err);
    }
}

export const getProductTypesByProductId = async (req, res, next) => {
    try {
        const product = await getProductTypesByProductIdService(req.params.id);
        if (!product) {
            return handleResponse(res, 404, "ProductTypes not found");
        }
        handleResponse(res, 200, "ProductTypes fetched successfully", product);
    } catch (err) {
        next(err);
    }
}

export const updateProductTypeByID = async (req, res, next) => {
        const { email, status, products, price } = req.body;
        const dataReceived = { email, status, products, price, id: req.params.id };
        const data = Object.entries(dataReceived).filter(([key, value]) => value !== undefined);
    try {
        const product = await updateProductTypesByIdService(data);
        if (!product) {
            return handleResponse(res, 404, "ProductType not updated found");
        }
        handleResponse(res, 200, "ProductType updated successfully", product);
    } catch (err) {
        next(err);
    }
}

export const deleteProductType = async (req, res, next) => {
    try {
        const product = await deleteProductTypeService(req.params.id);
        if (!product) {
            return handleResponse(res, 404, "ProductType not found");
        }
        handleResponse(res, 200, "Product deleted successfully", product);
    } catch (err) {
        next(err);
    }
}

export const createProductWithProductsTypes = async (req, res, next) => {
    const { product, productTypes } = req.body;
    try {
        const response = await createProductWithProductsTypesService(product, productTypes);
        if (!response) {
            return handleResponse(res, 404, "Error");
        }
        handleResponse(res, 200, "Product adn ProductTypes created successfully", response);
    } catch (err) {
        next(err);
    }
}