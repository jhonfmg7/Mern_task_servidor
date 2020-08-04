const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Read token of header
    const token = req.header('x-auth-token');

    // Check if dont exist token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso no valido' })
    }

    // Validate Token
    try {

        const encryption = jwt.verify(token, process.env.SECRET);
        req.user = encryption.user;
        next();

    } catch (error) {

        console.log(error);
        res.status(401).json({ msg: 'token no valido' })
    }
}