const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');

// CRUD Projects (/api/projects)
router.post('/',
    auth, [
        check('nameProject', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    projectController.createProject
);

router.get('/',
    auth,
    projectController.obtainProjects
);

router.put('/:id',
    auth, [
        check('nameProject', 'El nombre del proyecto es obligatorio').not().isEmpty()
    ],
    projectController.editProject
);

router.delete('/:id',
    auth,
    projectController.deleteProject
);

module.exports = router;