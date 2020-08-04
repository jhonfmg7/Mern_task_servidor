const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const taskController = require('../controllers/taskController');
const auth = require('../middleware/auth');

// CRUD Tasks (/api/tasks)
router.post('/',
    auth, [
        check('name', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('projectId', 'El projecto es obligatorio').not().isEmpty()
    ],
    taskController.createTask
);

router.get('/',
    auth,
    taskController.getTasks
);

router.put('/:id',
    auth, [
        check('name', 'El nombre de la tarea es obligatorio').not().isEmpty(),
        check('projectId', 'El projecto es obligatorio').not().isEmpty()
    ],
    taskController.editTask
);

router.delete('/:id',
    auth,
    taskController.deleteTask
)

module.exports = router;