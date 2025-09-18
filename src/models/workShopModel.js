import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const createWorkShopReceiverService = async (email, id) => {
    const data = await getAllWorkShopReceiversService();
    const findExisting = data.find(item => item.email === email && id === item.workshop_id);
    if (findExisting) {
        return {};
    }
    const result = await pool.query("INSERT INTO workshop (email, workshop_id) VALUES ($1, $2) RETURNING *", [email, id]);
    
    return result.rows;
};

export const getAllWorkShopReceiversService = async () => {
    const result = await pool.query("SELECT * FROM workshop");

    return result.rows;
};

export const deleteWorkShopReceiverService = async (id) => {
    const result = await pool.query('DELETE FROM workshop WHERE id=$1', [id]);

    return result.rows[0];
};
