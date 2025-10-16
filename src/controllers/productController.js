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
    updateProductProductTypesPriceService,
    deleteProductWithProductTypesService,
    addDocumentService,
    getDocumentService,
    updateDocumentService,
} from '../models/productModels.js';
import { getOrderByIdService } from '../models/orderModels.js';

const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({ status, message, data });
};

export const createProduct = async (req, res, next) => {
    try {
        const newProduct = await createProductService(req.body);
        if (!newProduct) {
            return handleResponse(res, 400, 'Product not created');
        }
        handleResponse(res, 201, 'Product created successfully', newProduct);
    } catch (err) {
        next(err);
    }
};

export const getAllProducts = async (req, res, next) => {
    try {
        const { page } = req.body;
        const products = await getAllProductService(page);
        handleResponse(res, 200, 'Products fetched successfully', products);
    } catch (err) {
        next(err);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const product = await getProductByIdService(req.params.id);
        if (!product) {
            return handleResponse(res, 404, 'Product not found');
        }
        handleResponse(res, 200, 'Product fetched successfully', product);
    } catch (err) {
        next(err);
    }
};

export const updateProductById = async (req, res, next) => {
    try {
        const updateProduct = await updateProductByIdService(
            req.params.id,
            req.body,
        );
        handleResponse(res, 200, 'Product updated successfully', updateProduct);
    } catch (err) {
        next(err);
    }
};

export const deleteProductById = async (req, res, next) => {
    try {
        const response = await deleteProductByIdService(req.params.id);
        handleResponse(res, 200, 'Product deleted successfully', response);
    } catch (err) {
        next(err);
    }
};

export const createProductType = async (req, res, next) => {
    try {
        const product = await createProductTypeService(req.body);
        if (!product) {
            return handleResponse(res, 404, 'ProductType not created');
        }
        handleResponse(res, 200, 'ProductType created successfully', product);
    } catch (err) {
        next(err);
    }
};

export const getProductTypes = async (req, res, next) => {
    try {
        const product = await getProductTypesService();
        if (!product) {
            return handleResponse(res, 404, 'ProductTypes not found');
        }
        handleResponse(res, 200, 'ProductTypes fetched successfully', product);
    } catch (err) {
        next(err);
    }
};

export const getProductTypeById = async (req, res, next) => {
    try {
        const product = await getProductTypesByIdService(req.params.id);
        if (!product) {
            return handleResponse(res, 404, 'ProductType not found');
        }
        handleResponse(res, 200, 'ProductType fetched successfully', product);
    } catch (err) {
        next(err);
    }
};

export const getProductTypesByProductId = async (req, res, next) => {
    try {
        const product = await getProductTypesByProductIdService(req.params.id);
        if (!product) {
            return handleResponse(res, 404, 'ProductTypes not found');
        }
        handleResponse(res, 200, 'ProductTypes fetched successfully', product);
    } catch (err) {
        next(err);
    }
};

export const updateProductTypeByID = async (req, res, next) => {
    const {
        price,
        size,
        color,
        size_placeholder,
        stock_quantity,
        images,
        sale_price,
        sale_amount,
    } = req.body;
    const dataReceived = {
        price,
        size,
        color,
        size_placeholder,
        stock_quantity,
        images,
        sale_price,
        sale_amount,
        id: req.params.id,
    };
    const data = Object.entries(dataReceived).filter(
        ([key, value]) => value !== undefined,
    );
    try {
        const product = await updateProductTypesByIdService(data);
        if (!product) {
            return handleResponse(res, 404, 'ProductType not updated found');
        }
        handleResponse(res, 200, 'ProductType updated successfully', product);
    } catch (err) {
        next(err);
    }
};

export const updateProductTypes = async (req, res, next) => {
    const { productTypes } = req.body;

    try {
        const requests = productTypes.map(async (item) => {
            if (item.del) {
                return await deleteProductTypeService(item.id);
            }

            const {
                price,
                size,
                color,
                size_placeholder,
                stock_quantity,
                images,
                sale_price,
                sale_amount,
                id,
            } = item;
            const dataReceived = {
                price,
                size,
                color,
                size_placeholder,
                stock_quantity,
                images,
                sale_price,
                sale_amount,
                id,
            };
            const data = Object.entries(dataReceived).filter(
                ([key, value]) => value !== undefined,
            );

            return await updateProductTypesByIdService(data);
        });
        const results = await Promise.all(requests);

        handleResponse(res, 200, 'ProductTypes updated successfully', results);
    } catch (err) {
        next(err);
    }
};

export const deleteProductType = async (req, res, next) => {
    try {
        const product = await deleteProductTypeService(req.params.id);
        if (!product) {
            return handleResponse(res, 404, 'ProductType not found');
        }
        handleResponse(res, 200, 'Product deleted successfully', product);
    } catch (err) {
        next(err);
    }
};

export const deleteProductWithProductTypes = async (req, res, next) => {
    try {
        const product = await deleteProductWithProductTypesService(
            req.params.id,
        );
        if (!product) {
            return handleResponse(res, 404, 'ProductType not found');
        }
        handleResponse(res, 200, 'Product deleted successfully', product);
    } catch (err) {
        next(err);
    }
};

export const addDocument = async (req, res, next) => {
    const { originalname, buffer } = req.file;
    try {
        const product = await addDocumentService(originalname, buffer);
        if (!product) {
            return handleResponse(res, 404, 'Upload failed');
        }
        handleResponse(res, 200, 'File uploaded successfully', product);
    } catch (err) {
        next(err);
    }
};

export const updateDocument = async (req, res, next) => {
    const { originalname, buffer } = req.file;
    const id = req.params.id;

    try {
        const product = await updateDocumentService(originalname, buffer, id);
        if (!product) {
            return handleResponse(res, 404, 'Upload failed');
        }
        handleResponse(res, 200, 'File uploaded successfully', product);
    } catch (err) {
        next(err);
    }
};

export const getDocument = async (req, res, next) => {
    const orderId = req.params.id;
    const { productId } = req.body;
    try {
        const order = await getOrderByIdService(orderId);

        const productType = await getProductTypesByIdService(productId);

        const findProductInOrder = order.products.find(
            (item) => item === productType.id,
        );

        if (findProductInOrder) {
            const product = await getProductByIdService(productType.productId);

            if (!product.file_id) {
                return handleResponse(res, 200, {});
            }

            const document = await getDocumentService(product.file_id);

            if (!document) {
                return handleResponse(res, 404, 'Not found');
            }

            const base64Data = document.file.toString('base64');

            return handleResponse(res, 200, 'Document succesfully fetched', {
                name: document.name,
                data: base64Data,
                mimeType: 'application/pdf',
            });
        }

        handleResponse(res, 404, 'Not found');
    } catch (err) {
        next(err);
    }
};

export const getDocuments = async (req, res, next) => {
    const orderId = req.params.id;
    const { products } = req.body;
    try {
        const order = await getOrderByIdService(orderId);

        if (!order.payment_date) {
            return handleResponse(res, 404, 'Pay first for this order');
        }

        const requests = products.map((item) =>
            getProductTypesByIdService(item),
        );
        const results = await Promise.all(requests);

        const requestsProduct = results.map((item) =>
            getProductByIdService(item.productId),
        );
        const resultsProduct = await Promise.all(requestsProduct);

        const filesProducts = resultsProduct.filter(
            (item) => item.file_id !== null,
        );

        if (filesProducts.length === 0) {
            return handleResponse(
                res,
                404,
                'No documents found for products in this order',
            );
        }

        const documents = await Promise.all(
            filesProducts.map(async (product) => {
                const doc = await getDocumentService(product.file_id);

                if (!doc) return null;

                const base64Data = doc.file.toString('base64');

                return {
                    name: doc.name,
                    data: base64Data,
                    mimeType: 'application/pdf',
                };
            }),
        );

        return handleResponse(res, 200, 'Document succesfully fetched', {
            documents,
        });
    } catch (err) {
        next(err);
    }
};

export const createProductWithProductsTypes = async (req, res, next) => {
    const { product, productTypes } = req.body;
    try {
        const response = await createProductWithProductsTypesService(
            product,
            productTypes,
        );
        if (!response) {
            return handleResponse(res, 404, 'Error');
        }
        handleResponse(
            res,
            200,
            'Product adn ProductTypes created successfully',
            response,
        );
    } catch (err) {
        next(err);
    }
};

export const updateProductProductTypesPrice = async (req, res, next) => {
    try {
        const response = await updateProductProductTypesPriceService(
            req.params.id,
            req.params.price,
        );
        if (!response) {
            return handleResponse(res, 404, 'Error');
        }
        handleResponse(
            res,
            200,
            'Product adn ProductTypes created successfully',
            response,
        );
    } catch (err) {
        next(err);
    }
};
