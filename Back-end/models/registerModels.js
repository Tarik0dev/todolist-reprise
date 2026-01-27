const pool = require('../config/configDatabase')

const registerModel = {


    create: async ({ firstName, lastName, email, password }) => {
        const result = await pool.query(
            'INSERT INTO users (firstname, lastname, email, password ) VALUES ($1, $2, $3, $4) RETURNING *',
            [firstName, lastName, email, password]);

                return result.rows[0];
    }};

    module.exports = registerModel;