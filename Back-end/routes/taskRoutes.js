const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskControllers')
const authMiddleware = require('../middlewares/authmiddleware');

router.post('/add', authMiddleware, TaskController.add)
router.get('/getAll', authMiddleware, TaskController.getAll)
router.delete('/delete/:taskId', authMiddleware, TaskController.delete)


module.exports = router;