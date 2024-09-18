const express = require('express');
const { createTodo, alertTodo, getPaginatedTodos, updateTodoStatus } = require('../controllers/todoController');
const upload = require('../middlewares/upload.js');

const router = express.Router();

router.post('/todo', upload.single('image'), createTodo);
router.get('/alert', alertTodo);
router.get('/todos', getPaginatedTodos);
router.patch('/todos/:id', updateTodoStatus);



module.exports = router;
