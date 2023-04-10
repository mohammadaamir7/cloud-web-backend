const jwt = require('jsonwebtoken')
require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: '8h' })
}

module.exports = generateToken