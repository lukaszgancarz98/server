import pool from '../config/db.js';

export const createCaseService = async (name, email, description, type) => {
    const result = await pool.query(
        'INSERT INTO fenix (name, email, description, type) VALUES ($1, $2, $3, $4) RETURNING id, name, email, description, type',
        [name, email, description, type],
    );
    return result.rows[0];
};

export const getByIdService = async (id) => {
    const result = await pool.query(
        'SELECT id, email, name, description FROM fenix WHERE id = $1',
        [id],
    );
    return result.rows[0];
};

export const getByEmailService = async (email) => {
    const result = await pool.query(
        'SELECT id, email, name, description FROM fenix WHERE email = $1',
        [email],
    );
    return result.rows;
};

export const getByTypeService = async (type) => {
    const result = await pool.query(
        'SELECT id, email, name, description FROM fenix WHERE type = $1',
        [type],
    );
    return result.rows;
};

export const updateCaseService = async (id, name, email, description, type) => {
    const result = await pool.query(
        'UPDATE fenix SET name=$1, email=$2, description=$3, type=$4 WHERE id=$5 RETURNING id, name, email, description, type',
        [name, email, description, type, id],
    );
    return result.rows[0];
};

export const addToListRecruitmentService = async (name, email, type) => {
    const checkIfExists = await pool.query(
        'SELECT id FROM fenix WHERE email = $1 AND type = $2',
        [email, type],
    );
    if (checkIfExists.rows.length > 0) {
        return { exists: true };
    }
    const result = await pool.query(
        'INSERT INTO fenix (name, email, type) VALUES ($1, $2, $3) RETURNING id, name, email, type',
        [name, email, type],
    );
    return result.rows[0];
};

export const addToListService = async (name, email, type) => {
    const checkIfExists = await pool.query(
        'SELECT id FROM fenix WHERE email = $1 AND type = $2',
        [email, type],
    );
    if (checkIfExists.rows.length > 0) {
        return { exists: true };
    }
    const result = await pool.query(
        'INSERT INTO fenix (name, email, type) VALUES ($1, $2, $3) RETURNING id, name, email, type',
        [name, email, type],
    );
    return result.rows[0];
};
