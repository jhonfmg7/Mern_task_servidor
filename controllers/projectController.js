const Project = require('../models/Project');
const { validationResult } = require('express-validator')

// Create Project
exports.createProject = async(req, res) => {

    // Check Errors
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {

        // Create Project
        const project = new Project(req.body);

        // Save creator of project
        project.creator = req.user.id;

        // Save Project
        project.save();

        // Response
        res.json({ project });

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

// Get all projects of current user
exports.obtainProjects = async(req, res) => {
    try {

        const projects = await Project.find({ creator: req.user.id });
        res.json({ projects })

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}

// Edit a Project
exports.editProject = async(req, res) => {

    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Info Project Extraction
    const { nameProject } = req.body;
    const newProject = {};

    if (nameProject) {
        newProject.nameProject = nameProject;
    }

    try {

        // Check ID
        let projectCheck = await Project.findById({ _id: req.params.id });

        // Check if project exists
        if (!projectCheck) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // Check the creator of project
        if (projectCheck.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Proyecto no permitido' })
        }

        // Update
        project = await Project.findByIdAndUpdate({ _id: req.params.id }, { $set: newProject }, { new: true });

        // Response
        res.json({ project });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error })
    }
}

// Delete a Project
exports.deleteProject = async(req, res) => {

    try {

        // Check ID
        let projectCheck = await Project.findById({ _id: req.params.id });

        // Check if project exists
        if (!projectCheck) {
            return res.status(404).json({ msg: 'Proyecto no encontrado' })
        }

        // Check the creator of project
        if (projectCheck.creator.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Proyecto no permitido' })
        }

        // Delete project
        await Project.findOneAndRemove({ _id: req.params.id });

        // Response
        res.json({ msg: 'proyecto eliminado' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de servidor' })
    }
}