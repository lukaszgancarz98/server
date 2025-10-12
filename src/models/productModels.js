import pool from "../config/db.js";

export const createProductService = async (data) => {
    const result = await pool.query(
        "INSERT INTO products (name, description, image, type) VALUES ($1, $2, $3, $4) RETURNING *",
        [data.name, data.description, data.image, data.type]
    );

    return result.rows[0];
};

export const getAllProductService = async (page) => {
    const result = await pool.query("SELECT * FROM products WHERE page=$1", [page]);

    return result.rows;
};

export const getProductByIdService = async (id) => {
    const req = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
    const result = req.rows[0];

    return result;
};

export const getProductTypesByProductIdService = async (id) => {
    const req = await pool.query('SELECT * FROM "productType" WHERE "productId" = $1', [id]);
    const result = req.rows;

    return result;
};

export const updateProductByIdService = async (id, data) => {
    const req = await pool.query("UPDATE products SET name=$1, description=$2, short_description=$3, image=$4, category=$5, page=$6, tag=$7, size_image=$8, file_id=$9 WHERE id=$10 RETURNING *", [data.name, data.description, data.short_description, data.image, data.category, data.page, data.tag, data.size_iamge, data.file_id, id]);
    const result = req.rows[0];

    return result;
};

export const deleteProductByIdService = async (id) => {
    const req = await pool.query("DELETE FROM products WHERE id=$1", [id]);
    const result = req.rows[0];

    return result;
};

export const deleteProductWithProductTypesService = async (id) => {
    const get = await pool.query('SELECT * FROM "productType" WHERE "productId"=$1', [id]);

    const promises = get.rows.map(element => {
        return pool.query('DELETE FROM "productType" WHERE id=$1', [element.id]);
    });

    const results = await Promise.all(promises);

    const req = await pool.query("DELETE FROM products WHERE id=$1", [id]);
    const result = req.rows[0];

    return {result, results};
};

export const createProductTypeService = async (data) => {
    const req = await pool.query(
        'INSERT INTO "productType" (price, size, color, size_placeholder, stock_quantity, images, sale_price, sale_amount, "productId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
        [data.price, data.size, data.color, data.size_placeholder, data.stock_quantity, data.images, data.sale_price, data.sale_amount, data.productId]);
    const result = req.rows[0];

    return result;
};

export const updateDocumentService = async (originalname, buffer, id) => {
    const req = await pool.query(
        "UPDATE files SET name=$1, file=$2 WHERE id=$3 RETURNING *",
        [originalname, buffer, id]);
    console.log(req, 'xD')
    const result = req.rows[0];

    return result;
};

export const addDocumentService = async (originalname, buffer) => {
    const req = await pool.query(
        "INSERT INTO files (name, file) VALUES ($1, $2) RETURNING *",
        [originalname, buffer]);

    const result = req.rows[0];

    return result;
};

export const getDocumentService = async (id) => {
    const req = await pool.query(
        "SELECT * FROM files WHERE id=$1",
        [id]);

    const result = req.rows[0];

    return result;
};

export const getProductTypesService = async () => {
    const req = await pool.query('SELECT * FROM "productType"');
    const result = req.rows;
    
    return result;
};

export const getProductTypesByIdService = async (id) => {
    const req = await pool.query('SELECT * FROM "productType" WHERE id=$1', [id]);
    const result = req.rows[0];

    return result;
};

export const getProductByIdProductTypesService = async (id) => {
    const req = await pool.query('SELECT * FROM "productType" WHERE id=$1', [id]);
    const prodRes = await pool.query('SELECT * FROM products WHERE id=$1', [req.rows[0].productId]);
    const result = prodRes.rows[0];

    return result;
};

export const updateProductTypesByIdService = async (data) => {
    const setParts = data.map(([key], index) => `${key}=$${index + 1}`).join(", ");
    const values = data.map(([_, value]) => value);
    const query = `UPDATE "productType" SET ${setParts} WHERE id=$${values.length} RETURNING *`;
    const result = await pool.query(query, values);

    return result.rows[0];
};

export const deleteProductTypeService = async (id) => {
    const req = await pool.query('DELETE FROM "productType" WHERE id=$1', [id]);
    console.log(req)
    const result = req.rowCount;

    return result;
};

export const createProductWithProductsTypesService = async (product, productTypes) => {
    const resultProduct = await pool.query(
        "INSERT INTO products (name, description, short_description, image, size_image, category, tag, page) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [product.name, product.description, product.short_description, product.image, product.size_image, product.category, product.tag, product.page]
    );

    const promises = productTypes.map(element => {
        return pool.query(
            'INSERT INTO "productType" (price, size, color, images, size_placeholder, stock_quantity, "productId") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [element.price, element.size, element.color, element.images, element.size_placeholder, element.stock_quantity, resultProduct.rows[0].id]
        );
    });

    const results = await Promise.all(promises);
    const resultsProductTypes = results.map(r => r.rows[0]);

    return { product: resultProduct.rows[0], productTypes: resultsProductTypes };
};

export const updateProductProductTypesPriceService = async (id, price) => {
    const req = await pool.query(
        'UPDATE "productType" SET price=$1 WHERE "productId"=$2 RETURNING *',
        [price, id]
    );

    return req.rows;
};
