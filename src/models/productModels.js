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
    const req = await pool.query("UPDATE products SET description=$1, image=$2 WHERE id=$3 RETURNING *", [data.description, data.image, id]);
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
        "INSERT INTO productType (price, size, color, shortDescription, images, sizePlaceHolder, stock_quantity, productId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [data.price, data.size, data.color, data.shortDescription, data.images, data.sizePlaceHolder, data.stock_quantity, data.productId]);
    const result = req.rows[0];

    return result;
};

export const getProductTypesService = async () => {
    const req = await pool.query('SELECT * FROM "productType"');
    const result = req.rows;
    
    return result;
};

export const getProductTypesByIdService = async (id) => {
    const req = await pool.query("DELETE FROM productType WHERE id=$1", [id]);
    const result = req.rows[0];

    return result;
};

export const updateProductTypesByIdService = async (data) => {
    const setParts = data.map(([key], index) => `${key}=$${index + 1}`).join(", ");
    const values = data.map(([_, value]) => value);
    values.push(id);
    const query = `UPDATE productType SET ${setParts} WHERE id=$${values.length} RETURNING *`;
    const result = await pool.query(query, values);

    return result.rows[0];
};

export const deleteProductTypeService = async (email) => {
    const req = await pool.query("SELECT * FROM orders WHERE email = $1", [email]);

    const result = req.rows[0];

    return result;
};

export const createProductWithProductsTypesService = async (product, productTypes) => {
    const resultProduct = await pool.query(
        "INSERT INTO products (name, description, image, size_image, category, tag, page) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
        [product.name, product.description, product.image, product.size_image, product.category, product.tag, product.page]
    );

    const promises = productTypes.map(element => {
        return pool.query(
            'INSERT INTO "productType" (price, size, color, "shortDescription", images, "sizePlaceHolder", stock_quantity, "productId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [element.price, element.size, element.color, element.shortDescription, element.images, element.sizePlaceHolder, element.stock_quantity, resultProduct.rows[0].id]
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
