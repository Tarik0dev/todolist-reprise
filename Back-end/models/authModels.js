const pool = require('../config/configDatabase');

const authModel = {
  findByEmail: async (email) => {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0]; // undefined si pas trouvé
  },
  resetPassword: async (email, password) => {
        await pool.query(`
            UPDATE users
            SET password = $1
            WHERE email = $2
        `, [password, email]);
    },
  
};

module.exports = authModel;
