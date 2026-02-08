const pool = require("../config/configDatabase");

const taskModel = {
  create: async ({ description, userId }) => {
    const result = await pool.query(
      "INSERT INTO tasks (description, user_id) VALUES ($1, $2) RETURNING *",
      [description, userId],
    );

    return result.rows[0];
  },
  getAll: async (userId) => {
  const result = await pool.query(
    "SELECT id, description, is_done FROM tasks WHERE user_id = $1 ORDER BY created_at DESC ",
    [userId],
  );

  return result.rows;
},


delete: async(user, taskId) => {

  const result = await pool.query(

    "DELETE FROM tasks WHERE user_id = $1 AND id = $2",
    [user, taskId]
  )
},
update: async(description, user, taskId) => {

  const result = await pool.query(

    "UPDATE tasks SET description = $1 WHERE user_id = $2 AND id = $3",
    [description, user, taskId]
  )
},

updateCheckboxTask: async(is_done, user, taskId)=> {

  const result = await pool.query(

    "UPDATE tasks SET is_done = $1 WHERE user_id = $2 AND id = $3",
    [is_done, user, taskId]
  )
},
};


module.exports = taskModel;
