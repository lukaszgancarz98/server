import pool from '../config/db.js';
import bcrypt from 'bcrypt';

export const createWorkShopReceiverService = async (email, id, page, name) => {
    const data = await getAllWorkShopReceiversService();
    const findExisting = data.find(
        (item) => item.email === email && id === item.workshop_id,
    );
    const findEmail = data.find(
        (item) => item.email === email && page === item.page,
    );

    if (findExisting && page === 'cal') {
        return {};
    }
    if (findEmail) {
        return {};
    }
    const result = await pool.query(
        'INSERT INTO workshop (email, workshop_id, page, name) VALUES ($1, $2, $3, $4) RETURNING *',
        [email, id, page, name],
    );

    return result.rows;
};

export const getAllWorkShopReceiversService = async () => {
    const result = await pool.query('SELECT * FROM workshop');

    return result.rows;
};

export const deleteWorkShopReceiverService = async (id) => {
    const result = await pool.query('DELETE FROM workshop WHERE id=$1', [id]);

    return result.rows[0];
};
