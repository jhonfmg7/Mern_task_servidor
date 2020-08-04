// Routes for authenticate users
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { check } = require('express-validator');

// Auth User (/api/auth)
router.post('/',
    authController.authenticateUser
);

router.get('/',
    auth,
    authController.authUser

)

module.exports = router;