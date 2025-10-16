import express from 'express';
import multer from 'multer';
import {
    updateProductTypes,
    getDocuments,
    getDocument,
    addDocument,
    updateDocument,
    deleteProductWithProductTypes,
    getProductTypesByProductId,
    getProductTypeById,
    createProductWithProductsTypes,
    deleteProductType,
    updateProductTypeByID,
    getProductTypes,
    createProduct,
    getAllProducts,
    getProductById,
    updateProductById,
    deleteProductById,
    createProductType,
    updateProductProductTypesPrice,
} from '../controllers/productController.js';

const router = express.Router();
const upload = multer();

router.post('/create', createProduct);
router.post('/products', getAllProducts);
router.post('/createVariants', createProductWithProductsTypes);
router.post('/productType', createProductType);
router.get('/productTypes', getProductTypes);
router.post('/productTypes', updateProductTypes);
router.get('/productType/:id', getProductTypeById);
router.get('/productType/product/:id', getProductTypesByProductId);
router.post('/productType/:id', updateProductTypeByID);
router.delete('/productType/:id', deleteProductType);
router.delete('/all/:id', deleteProductWithProductTypes);
router.post('/document', upload.single('file'), addDocument);
router.post('/document/update/:id', upload.single('file'), updateDocument);
router.post('/document/:id', getDocument);
router.post('/documents/:id', getDocuments);
router.post('/:id/productTypes/price/:price', updateProductProductTypesPrice);
router.get('/:id', getProductById);
router.post('/:id', updateProductById);
router.delete('/:id', deleteProductById);

export default router;
