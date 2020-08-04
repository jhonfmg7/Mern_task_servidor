const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// Create a new task
exports.createTask = async(req, res) => {

    // Check Errors
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Project extraction and check if this exist
    const { projectId } = req.body;

    try {

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(400).json({ msg: 'Proyecto no encontrado' })
        }

        // Check for authority of project to authenticate user 
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Proyecto no permitido' })
        }

        // Create task
        const task = new Task(req.body);
        await task.save();
        res.json({ task });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de servidor' })
    }
}

// Get all tasks for the project
exports.getTasks = async(req, res) => {

    // Project extraction and check if this exist
    const { projectId } = req.query;

    try {

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(400).json({ msg: 'Proyecto no encontrado' })
        }

        // Check for authority of project to authenticate user 
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Proyecto no permitido' })
        }

        // Get task per project
        const tasks = await Task.find({ projectId: projectId })
        res.json({ tasks });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de servidor' })
    }
}

// Update task by Id
exports.editTask = async(req, res) => {

    // Project extraction and check if this exist
    const { projectId, name, state } = req.body;

    try {

        // Validate (Task exist)
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(400).json({ msg: 'tarea no encontrada' })
        }

        // Validate (Project exist)
        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(400).json({ msg: 'Proyecto no encontrado' })
        }

        // Check for authority of project to authenticate user 
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Proyecto no permitido' })
        }

        // Create an object with new info
        const newTask = {};

        newTask.name = name;

        newTask.state = state;

        // Save updated task
        task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, { new: true });
        res.json({ task })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de servidor' })
    }
}

// Delete task
exports.deleteTask = async(req, res) => {

    // Project extraction and check if this exist
    const { projectId } = req.query;

    try {

        // Validate (Task exist)
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(400).json({ msg: 'tarea no encontrada' })
        }

        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(400).json({ msg: 'Proyecto no encontrado' })
        }

        // Check for authority of project to authenticate user 
        if (project.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Proyecto no permitido' })
        }

        // Delete Task
        await Task.findOneAndDelete({ _id: req.params.id });

        // Response
        res.json({ msg: 'Tarea eliminada' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de servidor' })
    }
}