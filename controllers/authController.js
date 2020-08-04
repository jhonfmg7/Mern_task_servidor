const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.authenticateUser = async(req, res) => {

    // Check Errors
    const errors = await validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Email and password Extraction
    const { email, password } = req.body;

    try {
        // Check user register
        let user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ msg: 'El usuario no existe' });
        }

        // Check password
        const correctPassword = await bcryptjs.compare(password, user.password);

        if (!correctPassword) {
            return res.status(400).json({ msg: 'Contraseña incorrecta' });
        }

        // JWT if all pass the validate
        // create and firm JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(payload, process.env.SECRET, {
            expiresIn: 3600
        }, (error, token) => {
            if (error) throw error;

            // Message of confirm
            res.json({ token });
        })

    } catch (error) {
        console.log(error);
    }
}

// Get auth user
exports.authUser = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error de servidor' })
    }
}