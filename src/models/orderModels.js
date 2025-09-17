import pool from "../config/db.js";

export const getAllOrdersService = async () => {
    const result = await pool.query("SELECT * FROM orders");
    return result.rows;
};

export const getOrderByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);

    return result.rows[0];
};

export const createOrderService = async (price, products, email) => {
    const result = await pool.query(
        "INSERT INTO orders (price, products, email) VALUES ($1, $2, $3) RETURNING id, price, products, email",
        [price, products, email]
    );
    return result.rows[0];
};

export const updateOrderByIdService = async (id, data) => {
    const setParts = data.map(([key], index) => `${key}=$${index + 1}`).join(", ");
    const values = data.map(([_, value]) => value);
    values.push(id);
    const query = `UPDATE orders SET ${setParts} WHERE id=$${values.length} RETURNING *`;
    const result = await pool.query(query, values);

    return result.rows[0];
};

export const deleteOrderByIdService = async (id) => {
    const req = await pool.query("DELETE FROM orders WHERE id=$1", [id]);
    const result = req.rows[0];

    return result;
};

export const getOrderByEmailService = async (email) => {
    const req = await pool.query("SELECT * FROM orders WHERE email = $1", [email]);

    const result = req.rows.filter(item => !item.finalize_date && !item.payment_date);

    return result[0];
};

export const updateOrderDetailsService = async (id, orderDetails) => {
    const data = JSON.stringify(orderDetails);

    const req = await pool.query('UPDATE orders SET "orderDetails"=$1 WHERE id=$2 RETURNING *', [data, id]);

    const result = req.rows[0];

    return result;
};

export const updateOrderPaymentToken = async (data, id) => {
    const { expires_in, access_token } = data;

    let now = new Date();

    now.setSeconds(now.getSeconds() + expires_in);

    const req = await pool.query('UPDATE orders SET token=$1, token_expire_date=$2 WHERE id=$3 RETURNING *', [access_token, now, id]);

    const result = req.rows[0];

    return result?.token;
};

export const getOrderPaymentToken = async (id) => {
    const req = await pool.query("SELECT * FROM orders WHERE id=$1", [id]);

    const result = req.rows[0];

    return { token: result?.token, expire: result?.token_expire_date};
};

export const getOrderPaymentTokenAndId = async (id) => {
    const req = await pool.query("SELECT * FROM orders WHERE id=$1", [id]);

    const result = req.rows[0];

    return { token: result.token, expire: result.token_expire_date, paymentorder_id: result.paymentorder_id };
};

export const updateProductAmountService = async (id, amount) => {
    const req = await pool.query('SELECT * FROM "productType" WHERE id=$1', [id]);

    if (req.rows.length > 0) {

        const dbAmount = Number(req.rows[0].sale_amount);
        
        if(dbAmount > 0) {
            const calculatedAmount = dbAmount + Number(amount);
            const response = await pool.query('UPDATE "productType" SET sale_amount=$1 WHERE id=$2 RETURNING *', [calculatedAmount, id]);

            return response.rows[0];
        }
    }
    return undefined;
};

export const getOrdersByIdService = async (id) => {
    const request = await pool.query("SELECT * FROM users WHERE id=$1", [id]);
    const userEmail = request.rows[0].email;
    const req = await pool.query("SELECT * FROM orders WHERE email=$1", [userEmail]);

    return req.rows;
};
