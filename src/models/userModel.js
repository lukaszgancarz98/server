import pool from "../config/db.js";
import bcrypt from "bcrypt";

export const getAllUsersService = async () => {
    const result = await pool.query("SELECT id, email, name, surname FROM users");
    return result.rows;
};

export const getUserByIdService = async (id) => {
    const result = await pool.query("SELECT id, email, name, surname FROM users WHERE id = $1", [id]);
    return result.rows[0];
};

export const createUserService = async (name, email, surname, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
        "INSERT INTO users (email, name, surname, password) VALUES ($1, $2, $3, $4) RETURNING id, email, name, surname",
        [email, name, surname, hashedPassword]
    );
    return result.rows[0];
};

export const updateUserByIdService = async (id, name, email) => {
    const result = await pool.query(
        "UPDATE users SET email=$1, name=$2 WHERE id=$3 RETURNING id, email, name",
        [email, name, id]
    );
    return result.rows[0];
};

export const loginUserService = async (email, password) => {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
    const user = result.rows[0];
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    delete user.password;
    return user;
};

export const authGoogleUserService = async (data) => {
    const result = await pool.query("SELECT * FROM users WHERE email=$1", [data.email]);
    const user = result.rows[0];
    if (!user) {
        const hashedPassword = await bcrypt.hash(data.email, 10);
        const result = await pool.query(
            "INSERT INTO users (email, name, surname, password) VALUES ($1, $2, $3, $4) RETURNING id, email, name, surname",
            [data.email, data.name, data.surname, hashedPassword]
        );

        return result.rows[0];
    };

    const match = await bcrypt.compare(data.email, user.password);
    if (!match) return null;

    delete user.password;
    return user;
};
