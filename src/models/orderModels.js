import pool from "../config/db.js";

export const getAllOrdersService = async () => {
    const result = await pool.query("SELECT * FROM orders");
    return result.rows;
};

export const getOrderByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM orders WHERE id = $1", [id]);
    return result.rows[0];
};

export const createOrderService = async (price, products, email, status) => {
    const result = await pool.query(
        "INSERT INTO orders (price, products, email, status) VALUES ($1, $2, $3, $4) RETURNING id, price, products, email, status",
        [price, products, email, status]
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

    const result = req.rows[0];

    return result;
};

export const updateOrderDetailsService = async (id, orderDetails) => {
    const data = JSON.stringify(orderDetails);

    const req = await pool.query('UPDATE orders SET "orderDetails"=$1 WHERE id=$2 RETURNING *', [data, id]);

    const result = req.rows[0];

    return result;
};
