const pool = require('../config/configDatabase');

const authModel = {
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0]; // undefined si pas trouvé
  },
  saveResetToken: async (email, token, expires) => {
        await pool.query(`
            UPDATE users
            SET reset_token = $1, reset_token_expires = $2
            WHERE email = $3
        `, [token, expires, email]);
    },
};

module.exports = authModel;
