const taskModel = require("../models/taskModels");

const taskControllers = {
  add: async (req, res) => {
    const user = req.auth;
    try {
      const { description } = req.body;

      const insertedTask = await taskModel.create({
        description,
        userId: user.userId,
      });

      // 201 status created -> une resource a été crée / 200 aussi valide dans ce cas.
      res.status(201).json({
        message: "La tâche a été inséré.",
      });
    } catch (error) {
      res.status(400).json({
        message: "Erreur lors de l'insertion.",
      });
    }
  },

  getAll: async(req, res) => {

    try {
      const user = req.auth;

      const tasks = await taskModel.getAll(user.userId);

      res.status(200).json({
        data: tasks
      });


    }
    catch(error){
      console.log(error)
      res.status(400).json({
        message: "Erreur lors de la récupération des tâches.",
      });
    }
    
  },

  delete: async(req, res) => {

    try {
          const user = req.auth.userId;
          const taskId = req.params.taskId;
          const request = await taskModel.delete(user, taskId)
          res.status(200).json({
        message: "la tache à bien été supprimée"
      });
      console.log("la tache à bien été supprimée")
    }

    catch (error) {

      console.log(error)
    }

  }





};
module.exports = taskControllers;
